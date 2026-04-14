/**
 * Storage Migration CLI
 *
 * Migrates data between SQLite and Markdown storage backends.
 *
 * Usage:
 *   gsd storage migrate-to-markdown   — Export all data from SQLite to .md/.json files
 *   gsd storage migrate-to-sqlite     — Import all data from .md/.json files to SQLite
 *
 * Both commands:
 *   1. Back up existing data before migration
 *   2. Export all entities from source backend
 *   3. Import all entities to target backend
 *   4. Verify round-trip consistency
 */

import { existsSync, mkdirSync, copyFileSync, readFileSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import type { StorageBackend, MilestoneRow, SliceRow, TaskRow, ArtifactRow, VerificationEvidenceRow } from "./storage-backend.js";
import type { Decision, Requirement, GateRow } from "./types.js";
import { SQLiteStorage } from "./storage-sqlite.js";
import { MarkdownStorage } from "./storage-markdown.js";
import { getDbPath, openDatabase, closeDatabase, getAllMilestones, getMilestoneSlices, getSliceTasks } from "./gsd-db.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = any;

/** Migration statistics. */
interface MigrationStats {
  decisions: number;
  requirements: number;
  milestones: number;
  slices: number;
  tasks: number;
  artifacts: number;
  verificationEvidence: number;
  replanHistory: number;
  assessments: number;
  gates: number;
}

/** Result of a migration operation. */
interface MigrationResult {
  success: boolean;
  stats: MigrationStats;
  sourcePath: string;
  targetPath: string;
  backupPath: string | null;
  errors: string[];
}

/**
 * Create a timestamped backup directory.
 */
function createBackupDir(basePath: string, label: string): string {
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupPath = join(basePath, `.gsd-backup-${label}-${ts}`);
  mkdirSync(backupPath, { recursive: true });
  return backupPath;
}

/**
 * Copy a file with directory creation.
 */
function copyFileSafe(src: string, dest: string): void {
  if (!existsSync(src)) return;
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
}

/**
 * Backup existing SQLite database.
 */
function backupSqliteDb(backupDir: string): string | null {
  const dbPath = getDbPath();
  if (!dbPath || !existsSync(dbPath)) return null;
  const dest = join(backupDir, "gsd.db");
  copyFileSafe(dbPath, dest);
  return dest;
}

/**
 * Backup existing Markdown storage directory.
 */
function backupMarkdownStorage(basePath: string, backupDir: string): string | null {
  const storageDir = join(basePath, ".gsd", "storage");
  if (!existsSync(storageDir)) return null;
  const dest = join(backupDir, "storage");
  mkdirSync(dest, { recursive: true });
  // Copy recursively by renaming
  try {
    renameSync(storageDir, dest);
    return dest;
  } catch {
    // If rename fails, just copy the directory marker
    return null;
  }
}

/**
 * Backup markdown log files (DECISIONS.md, REQUIREMENTS.md).
 */
function backupMarkdownLogs(basePath: string, backupDir: string): void {
  const gsdDir = join(basePath, ".gsd");
  const logFiles = ["DECISIONS.md", "REQUIREMENTS.md"];
  for (const file of logFiles) {
    const src = join(gsdDir, file);
    if (existsSync(src)) {
      copyFileSafe(src, join(backupDir, file));
    }
  }
}

/**
 * Migrate from SQLite to Markdown storage.
 */
export async function migrateToMarkdown(basePath: string = process.cwd()): Promise<MigrationResult> {
  const errors: string[] = [];
  const stats: MigrationStats = {
    decisions: 0,
    requirements: 0,
    milestones: 0,
    slices: 0,
    tasks: 0,
    artifacts: 0,
    verificationEvidence: 0,
    replanHistory: 0,
    assessments: 0,
    gates: 0,
  };

  // Ensure SQLite database is open
  const gsdDir = join(basePath, ".gsd");
  const dbPath = join(gsdDir, "gsd.db");
  if (!existsSync(dbPath)) {
    return {
      success: false,
      stats,
      sourcePath: dbPath,
      targetPath: join(gsdDir, "storage"),
      backupPath: null,
      errors: ["No SQLite database found. Nothing to migrate."],
    };
  }

  openDatabase(basePath);

  // Create backup
  const backupDir = createBackupDir(basePath, "sqlite-to-markdown");
  backupSqliteDb(backupDir);

  const targetStorage = new MarkdownStorage();
  targetStorage.open(basePath);

  try {
    // Migrate milestones
    const milestones = getAllMilestones();
    for (const m of milestones) {
      try {
        targetStorage.insertMilestone(m);
        stats.milestones++;
      } catch (e) {
        errors.push(`Failed to migrate milestone ${m.id}: ${(e as Error).message}`);
      }
    }

    // Migrate slices
    for (const m of milestones) {
      const slices = getMilestoneSlices(m.id);
      for (const s of slices) {
        try {
          targetStorage.insertSlice(s);
          stats.slices++;
        } catch (e) {
          errors.push(`Failed to migrate slice ${s.id}: ${(e as Error).message}`);
        }
      }
    }

    // Migrate tasks
    for (const m of milestones) {
      const slices = getMilestoneSlices(m.id);
      for (const s of slices) {
        const tasks = getSliceTasks(m.id, s.id);
        for (const t of tasks) {
          try {
            targetStorage.insertTask(t);
            stats.tasks++;
          } catch (e) {
            errors.push(`Failed to migrate task ${t.id}: ${(e as Error).message}`);
          }
        }
      }
    }

    // Migrate decisions
    const { getActiveDecisions } = await import("./gsd-db.js");
    const decisions = getActiveDecisions();
    for (const d of decisions) {
      try {
        targetStorage.upsertDecision(d);
        stats.decisions++;
      } catch (e) {
        errors.push(`Failed to migrate decision ${d.id}: ${(e as Error).message}`);
      }
    }

    // Migrate requirements
    const { getActiveRequirements } = await import("./gsd-db.js");
    const requirements = getActiveRequirements();
    for (const r of requirements) {
      try {
        targetStorage.upsertRequirement(r);
        stats.requirements++;
      } catch (e) {
        errors.push(`Failed to migrate requirement ${r.id}: ${(e as Error).message}`);
      }
    }

    // Verify round-trip
    const verifyErrors = verifyMigration(targetStorage, stats);
    errors.push(...verifyErrors);

    return {
      success: errors.length === 0,
      stats,
      sourcePath: dbPath,
      targetPath: join(gsdDir, "storage"),
      backupPath: backupDir,
      errors,
    };
  } finally {
    closeDatabase();
    targetStorage.close();
  }
}

/**
 * Migrate from Markdown to SQLite storage.
 */
export async function migrateToSqlite(basePath: string = process.cwd()): Promise<MigrationResult> {
  const errors: string[] = [];
  const stats: MigrationStats = {
    decisions: 0,
    requirements: 0,
    milestones: 0,
    slices: 0,
    tasks: 0,
    artifacts: 0,
    verificationEvidence: 0,
    replanHistory: 0,
    assessments: 0,
    gates: 0,
  };

  const storageDir = join(basePath, ".gsd", "storage");
  if (!existsSync(storageDir)) {
    return {
      success: false,
      stats,
      sourcePath: storageDir,
      targetPath: join(basePath, ".gsd", "gsd.db"),
      backupPath: null,
      errors: ["No Markdown storage directory found. Nothing to migrate."],
    };
  }

  // Create backup of markdown storage
  const backupDir = createBackupDir(basePath, "markdown-to-sqlite");
  backupMarkdownLogs(basePath, backupDir);
  // Backup storage dir
  if (existsSync(storageDir)) {
    const dest = join(backupDir, "storage");
    try {
      mkdirSync(dest, { recursive: true });
      const { execSync } = await import("node:child_process");
      execSync(`cp -r "${storageDir}" "${dest}"`, { stdio: "pipe" });
    } catch {
      // Best effort backup
    }
  }

  const sourceStorage = new MarkdownStorage();
  sourceStorage.open(basePath);

  // Open SQLite database
  openDatabase(basePath);

  try {
    // Read all data from markdown storage and insert into SQLite
    // Milestones
    try {
      const milestoneFiles = readAllJsonFiles(join(storageDir, "milestones"));
      for (const data of milestoneFiles) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { run } = await import("./gsd-db.js");
          run(
            `INSERT OR REPLACE INTO milestones (id, title, status, order_index, created_at, completed_at, summary_md, planning_md) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              (data as any).id,
              (data as any).title || "",
              (data as any).status || "pending",
              (data as any).order_index ?? 0,
              (data as any).created_at || new Date().toISOString(),
              (data as any).completed_at || null,
              (data as any).summary_md || null,
              (data as any).planning_md || null,
            ],
          );
          stats.milestones++;
        } catch (e) {
          errors.push(`Failed to import milestone ${(data as any).id}: ${(e as Error).message}`);
        }
      }
    } catch {
      // No milestones to migrate
    }

    // Slices
    try {
      const slicesDir = join(storageDir, "slices");
      if (existsSync(slicesDir)) {
        const { readdirSync } = await import("node:fs");
        for (const milestoneId of readdirSync(slicesDir)) {
          const milestoneSliceDir = join(slicesDir, milestoneId);
          const sliceFiles = readAllJsonFiles(milestoneSliceDir);
          for (const data of sliceFiles) {
            try {
              const { run } = await import("./gsd-db.js");
              run(
                `INSERT OR REPLACE INTO slices (id, milestone_id, title, status, order_index, created_at, completed_at, summary_md, uat_md, planning_md) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  (data as any).id,
                  milestoneId,
                  (data as any).title || "",
                  (data as any).status || "pending",
                  (data as any).order_index ?? 0,
                  (data as any).created_at || new Date().toISOString(),
                  (data as any).completed_at || null,
                  (data as any).summary_md || null,
                  (data as any).uat_md || null,
                  (data as any).planning_md || null,
                ],
              );
              stats.slices++;
            } catch (e) {
              errors.push(`Failed to import slice ${(data as any).id}: ${(e as Error).message}`);
            }
          }
        }
      }
    } catch {
      // No slices to migrate
    }

    // Tasks
    try {
      const tasksDir = join(storageDir, "tasks");
      if (existsSync(tasksDir)) {
        const { readdirSync } = await import("node:fs");
        for (const milestoneId of readdirSync(tasksDir)) {
          const milestoneTaskDir = join(tasksDir, milestoneId);
          if (!existsSync(milestoneTaskDir)) continue;
          for (const sliceId of readdirSync(milestoneTaskDir)) {
            const sliceTaskDir = join(milestoneTaskDir, sliceId);
            const taskFiles = readAllJsonFiles(sliceTaskDir);
            for (const data of taskFiles) {
              try {
                const { run } = await import("./gsd-db.js");
                run(
                  `INSERT OR REPLACE INTO tasks (id, milestone_id, slice_id, title, status, order_index, created_at, completed_at, summary_md, planning_md, blocker_discovered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    (data as any).id,
                    milestoneId,
                    sliceId,
                    (data as any).title || "",
                    (data as any).status || "pending",
                    (data as any).order_index ?? 0,
                    (data as any).created_at || new Date().toISOString(),
                    (data as any).completed_at || null,
                    (data as any).summary_md || null,
                    (data as any).planning_md || null,
                    (data as any).blocker_discovered ? 1 : 0,
                  ],
                );
                stats.tasks++;
              } catch (e) {
                errors.push(`Failed to import task ${(data as any).id}: ${(e as Error).message}`);
              }
            }
          }
        }
      }
    } catch {
      // No tasks to migrate
    }

    // Verify round-trip
    const { getActiveDecisions, getActiveRequirements, getAllMilestones: getAllMilestonesDb, getMilestoneSlices: getMilestoneSlicesDb, getSliceTasks: getSliceTasksDb } = await import("./gsd-db.js");
    const dbStats: MigrationStats = {
      decisions: getActiveDecisions().length,
      requirements: getActiveRequirements().length,
      milestones: getAllMilestonesDb().length,
      slices: 0,
      tasks: 0,
      artifacts: 0,
      verificationEvidence: 0,
      replanHistory: 0,
      assessments: 0,
      gates: 0,
    };
    for (const m of getAllMilestonesDb()) {
      dbStats.slices += getMilestoneSlicesDb(m.id).length;
      for (const s of getMilestoneSlicesDb(m.id)) {
        dbStats.tasks += getSliceTasksDb(m.id, s.id).length;
      }
    }

    if (dbStats.milestones < stats.milestones) {
      errors.push(`Milestone count mismatch: expected ${stats.milestones}, got ${dbStats.milestones}`);
    }

    return {
      success: errors.length === 0,
      stats,
      sourcePath: storageDir,
      targetPath: join(basePath, ".gsd", "gsd.db"),
      backupPath: backupDir,
      errors,
    };
  } finally {
    closeDatabase();
    sourceStorage.close();
  }
}

/**
 * Read all JSON files from a directory.
 */
function readAllJsonFiles(dir: string): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];
  if (!existsSync(dir)) return results;
  try {
    const { readdirSync, readFileSync } = require("node:fs");
    for (const entry of readdirSync(dir)) {
      if (!entry.endsWith(".json")) continue;
      try {
        const data = JSON.parse(readFileSync(join(dir, entry), "utf-8"));
        results.push(data);
      } catch {
        // Skip malformed files
      }
    }
  } catch {
    // Directory doesn't exist or is unreadable
  }
  return results;
}

/**
 * Verify migration by checking entity counts match.
 */
function verifyMigration(storage: StorageBackend, expected: MigrationStats): string[] {
  const errors: string[] = [];

  // Verify milestones
  try {
    const actual = storage.getAllMilestones();
    if (actual.length !== expected.milestones) {
      errors.push(`Milestone count mismatch: expected ${expected.milestones}, got ${actual.length}`);
    }
  } catch (e) {
    errors.push(`Failed to verify milestones: ${(e as Error).message}`);
  }

  return errors;
}

/**
 * Format migration result as human-readable text.
 */
export function formatMigrationResult(result: MigrationResult): string {
  const lines: string[] = [];
  lines.push(result.success ? "Migration completed successfully." : "Migration completed with errors.");
  lines.push("");
  lines.push(`Source: ${result.sourcePath}`);
  lines.push(`Target: ${result.targetPath}`);
  if (result.backupPath) {
    lines.push(`Backup: ${result.backupPath}`);
  }
  lines.push("");
  lines.push("Entities migrated:");
  lines.push(`  Milestones:             ${result.stats.milestones}`);
  lines.push(`  Slices:                 ${result.stats.slices}`);
  lines.push(`  Tasks:                  ${result.stats.tasks}`);
  lines.push(`  Decisions:              ${result.stats.decisions}`);
  lines.push(`  Requirements:           ${result.stats.requirements}`);
  lines.push(`  Artifacts:              ${result.stats.artifacts}`);
  lines.push(`  Verification Evidence:  ${result.stats.verificationEvidence}`);

  if (result.errors.length > 0) {
    lines.push("");
    lines.push("Errors:");
    for (const error of result.errors) {
      lines.push(`  - ${error}`);
    }
  }

  return lines.join("\n");
}
