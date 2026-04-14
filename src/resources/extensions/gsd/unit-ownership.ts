// GSD Extension — Unit Ownership
// Opt-in per-unit ownership claims for multi-agent safety.
//
// An agent can claim a unit (task, slice) before working on it.
// complete-task and complete-slice enforce ownership when claims exist.
// Claims are stored as individual .claim JSON files in .gsd/unit-claims/
// with atomic write semantics (temp file + rename) for first-writer-wins.
//
// Unit key format:
//   task:  "<milestoneId>/<sliceId>/<taskId>"
//   slice: "<milestoneId>/<sliceId>"
//
// Copyright (c) 2026 Jeremy McSpadden <jeremy@fluxlabs.net>

import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
  readdirSync,
} from "node:fs";
import { join } from "node:path";

// ─── Types ───────────────────────────────────────────────────────────────

export interface UnitClaim {
  unitKey: string;
  agent: string;
  claimed_at: string;
}

interface ClaimFile {
  unitKey: string;
  agentName: string;
  claimedAt: string;
}

// ─── File-based Storage ──────────────────────────────────────────────────

function claimsDir(basePath: string): string {
  return join(basePath, ".gsd", "unit-claims");
}

function claimFilePath(basePath: string, unitKey: string): string {
  // Sanitize unit key for use as filename (replace / with _)
  const safeKey = unitKey.replace(/[/\\]/g, "_");
  return join(claimsDir(basePath), `${safeKey}.claim`);
}

function ensureClaimsDir(basePath: string): void {
  const dir = claimsDir(basePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Initialize the unit-claims directory for a given basePath.
 * Safe to call multiple times (idempotent).
 */
export function initOwnershipTable(basePath: string): void {
  ensureClaimsDir(basePath);
}

/**
 * Close any resources for basePath.
 * No-op for file-based storage (no DB connections to close).
 */
export function closeOwnershipDb(basePath: string): void {
  // No-op — file-based storage doesn't hold open handles
}

// ─── Key Builders ────────────────────────────────────────────────────────

export function taskUnitKey(milestoneId: string, sliceId: string, taskId: string): string {
  return `${milestoneId}/${sliceId}/${taskId}`;
}

export function sliceUnitKey(milestoneId: string, sliceId: string): string {
  return `${milestoneId}/${sliceId}`;
}

// ─── Public API ──────────────────────────────────────────────────────────

/**
 * Claim a unit for an agent.
 * Uses atomic file write (temp file + rename) for first-writer-wins semantics.
 * Returns true if the claim was acquired (or the same agent already owns it).
 * Returns false if a different agent already owns the unit.
 */
export function claimUnit(basePath: string, unitKey: string, agentName: string): boolean {
  ensureClaimsDir(basePath);

  const claimPath = claimFilePath(basePath, unitKey);

  // Check if already claimed
  if (existsSync(claimPath)) {
    try {
      const content = readFileSync(claimPath, "utf-8");
      const claim: ClaimFile = JSON.parse(content);
      // Same agent re-claiming: success
      if (claim.agentName === agentName) return true;
      // Different agent already owns it
      return false;
    } catch {
      // Corrupted claim file — treat as unclaimed
    }
  }

  // Atomic write: write to temp file, then rename
  const tmpPath = claimPath + ".tmp";
  const claim: ClaimFile = {
    unitKey,
    agentName,
    claimedAt: new Date().toISOString(),
  };

  try {
    writeFileSync(tmpPath, JSON.stringify(claim, null, 2), { encoding: "utf-8" });
    renameSync(tmpPath, claimPath);
    return true;
  } catch {
    // Another process may have claimed it first
    // Clean up temp file
    try { unlinkSync(tmpPath); } catch { /* ignore */ }
    // Re-check who owns it
    if (existsSync(claimPath)) {
      try {
        const content = readFileSync(claimPath, "utf-8");
        const claim: ClaimFile = JSON.parse(content);
        return claim.agentName === agentName;
      } catch {
        return false;
      }
    }
    return false;
  }
}

/**
 * Release a unit claim (delete the .claim file).
 */
export function releaseUnit(basePath: string, unitKey: string): void {
  const claimPath = claimFilePath(basePath, unitKey);
  if (existsSync(claimPath)) {
    try { unlinkSync(claimPath); } catch { /* ignore */ }
  }
}

/**
 * Get the current owner of a unit, or null if unclaimed.
 */
export function getOwner(basePath: string, unitKey: string): string | null {
  const claimPath = claimFilePath(basePath, unitKey);
  if (!existsSync(claimPath)) return null;
  try {
    const content = readFileSync(claimPath, "utf-8");
    const claim: ClaimFile = JSON.parse(content);
    return claim.agentName;
  } catch {
    return null;
  }
}

/**
 * Check if an actor is authorized to operate on a unit.
 * Returns null if ownership passes (or is unclaimed).
 * Returns an error string if a different agent owns the unit.
 */
export function checkOwnership(
  basePath: string,
  unitKey: string,
  actorName: string | undefined,
): string | null {
  if (!actorName) return null; // no actor identity provided — opt-in, so allow
  const owner = getOwner(basePath, unitKey);
  if (owner === null) return null; // unit unclaimed
  if (owner === actorName) return null; // actor is the owner
  return `Unit ${unitKey} is owned by ${owner}, not ${actorName}`;
}

// ─── Migration Tool ──────────────────────────────────────────────────────

/**
 * Migrate from SQLite unit-claims.db to file-based .claim files.
 * 
 * Usage:
 *   npx tsx src/resources/extensions/gsd/unit-ownership.ts migrate <basePath> [--delete-db]
 */
async function migrateFromSQLite(basePath: string, deleteDb: boolean = false): Promise<void> {
  const dbPath = join(basePath, ".gsd", "unit-claims.db");
  if (!existsSync(dbPath)) {
    process.stderr.write(`No unit-claims.db found at ${dbPath}\n`);
    return;
  }

  // Dynamically import SQLite
  const { createRequire } = await import("node:module");
  const _require = createRequire(import.meta.url);
  let db: unknown = null;

  try {
    const sqlite = _require("node:sqlite");
    const { DatabaseSync } = sqlite as { DatabaseSync: new (path: string) => unknown };
    db = new DatabaseSync(dbPath);
  } catch {
    try {
      const mod = _require("better-sqlite3");
      const Database = (mod.default || mod) as new (path: string) => unknown;
      db = new Database(dbPath);
    } catch {
      process.stderr.write("No SQLite provider available for migration\n");
      return;
    }
  }

  try {
    const typedDb = db as { prepare(sql: string): { all(): unknown[] } };
    const rows = typedDb.prepare("SELECT unit_key, agent_name, claimed_at FROM unit_claims").all() as Array<Record<string, unknown>>;

    ensureClaimsDir(basePath);
    let migrated = 0;

    for (const row of rows) {
      const claim: ClaimFile = {
        unitKey: row["unit_key"] as string,
        agentName: row["agent_name"] as string,
        claimedAt: row["claimed_at"] as string,
      };
      const claimPath = claimFilePath(basePath, claim.unitKey);
      writeFileSync(claimPath, JSON.stringify(claim, null, 2), { encoding: "utf-8" });
      migrated++;
    }

    process.stderr.write(`Migrated ${migrated} unit claims from SQLite to file-based storage\n`);

    if (deleteDb) {
      unlinkSync(dbPath);
      process.stderr.write(`Deleted ${dbPath}\n`);
    }
  } finally {
    try { (db as { close(): void }).close(); } catch { /* ignore */ }
  }
}

// CLI entry point
if (process.argv[2] === "migrate") {
  const basePath = process.argv[3] ?? process.cwd();
  const deleteDb = process.argv.includes("--delete-db");
  migrateFromSQLite(basePath, deleteDb).then(() => process.exit(0));
}
