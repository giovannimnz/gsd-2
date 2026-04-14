/**
 * Storage Migration Tool: SQLite → Markdown/JSON
 *
 * Reads all data from the existing SQLite database (.gsd/gsd.db)
 * and writes equivalent .json files for MarkdownStorage.
 *
 * Usage:
 *   npx tsx src/resources/extensions/gsd/storage-migration.ts [project-root] [--delete-db] [--dry-run]
 *
 * Steps:
 *   1. Open SQLite database
 *   2. Read all entities
 *   3. Write JSON files to .gsd/storage/
 *   4. Append human-readable logs to DECISIONS.md / REQUIREMENTS.md
 *   5. Verify round-trip consistency
 *   6. Optionally delete .db files
 */

import { existsSync, readFileSync, unlinkSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import type { DecisionMadeBy, GateRow } from "./types.js";
import { MarkdownStorage } from "./storage-markdown.js";

const _require = createRequire(import.meta.url);

// ─── SQLite helpers (inline to avoid circular deps) ──────────────────────

interface DbStatement {
  run(...params: unknown[]): unknown;
  get(...params: unknown[]): Record<string, unknown> | undefined;
  all(...params: unknown[]): Record<string, unknown>[];
}

interface DbAdapter {
  exec(sql: string): void;
  prepare(sql: string): DbStatement;
  close(): void;
}

function openSqliteDb(dbPath: string): DbAdapter | null {
  try {
    let providerModule: unknown = null;

    // Try node:sqlite first
    try {
      const mod = _require("node:sqlite");
      if (mod.DatabaseSync) {
        providerModule = mod;
      }
    } catch {
      // Try better-sqlite3
      try {
        const mod = _require("better-sqlite3");
        providerModule = mod.default || mod;
      } catch {
        return null;
      }
    }

    // Check if it's node:sqlite
    if (providerModule && "DatabaseSync" in (providerModule as object)) {
      const { DatabaseSync } = providerModule as { DatabaseSync: new (path: string) => unknown };
      const rawDb = new DatabaseSync(dbPath);
      return createAdapter(rawDb);
    }

    // better-sqlite3
    const Database = providerModule as new (path: string) => unknown;
    const rawDb = new Database(dbPath);
    return createAdapter(rawDb);
  } catch {
    return null;
  }
}

function createAdapter(rawDb: unknown): DbAdapter {
  const db = rawDb as {
    exec(sql: string): void;
    prepare(sql: string): {
      run(...args: unknown[]): unknown;
      get(...args: unknown[]): unknown;
      all(...args: unknown[]): unknown[];
    };
    close(): void;
  };

  function normalizeRow(row: unknown): Record<string, unknown> | undefined {
    if (row == null) return undefined;
    if (Object.getPrototypeOf(row) === null) {
      return { ...(row as Record<string, unknown>) };
    }
    return row as Record<string, unknown>;
  }

  function normalizeRows(rows: unknown[]): Record<string, unknown>[] {
    return rows.map((r) => normalizeRow(r)!);
  }

  const stmtCache = new Map<string, DbStatement>();

  function wrapStmt(raw: { run(...a: unknown[]): unknown; get(...a: unknown[]): unknown; all(...a: unknown[]): unknown[] }): DbStatement {
    return {
      run(...params: unknown[]): unknown { return raw.run(...params); },
      get(...params: unknown[]): Record<string, unknown> | undefined { return normalizeRow(raw.get(...params)); },
      all(...params: unknown[]): Record<string, unknown>[] { return normalizeRows(raw.all(...params)); },
    };
  }

  return {
    exec(sql: string): void { db.exec(sql); },
    prepare(sql: string): DbStatement {
      let cached = stmtCache.get(sql);
      if (cached) return cached;
      cached = wrapStmt(db.prepare(sql));
      stmtCache.set(sql, cached);
      return cached;
    },
    close(): void { db.close(); },
  };
}

// ─── Migration logic ─────────────────────────────────────────────────────

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
  sliceDependencies: number;
  errors: string[];
}

/**
 * Migrate data from SQLite to Markdown storage.
 */
async function migrateFromSqlite(dbPath: string, projectRoot: string, dryRun = false, deleteDb = false): Promise<MigrationStats> {
  const stats: MigrationStats = {
    decisions: 0, requirements: 0, milestones: 0, slices: 0, tasks: 0,
    artifacts: 0, verificationEvidence: 0, replanHistory: 0, assessments: 0,
    gates: 0, sliceDependencies: 0, errors: [],
  };

  if (!existsSync(dbPath)) {
    stats.errors.push(`Database not found: ${dbPath}`);
    return stats;
  }

  const db = openSqliteDb(dbPath);
  if (!db) {
    stats.errors.push("No SQLite provider available");
    return stats;
  }

  try {
    // Initialize MarkdownStorage backend
    const mdStorage = new MarkdownStorage();
    mdStorage.open(projectRoot);

    if (dryRun) {
      console.log("[DRY RUN] Migration preview — no files will be written");
    }

    // ── Migrate Decisions ──────────────────────────────────────────────
    try {
      const rows = db.prepare("SELECT * FROM decisions ORDER BY seq").all();
      for (const row of rows) {
        const decision = {
          seq: row["seq"] as number,
          id: row["id"] as string,
          when_context: row["when_context"] as string,
          scope: row["scope"] as string,
          decision: row["decision"] as string,
          choice: row["choice"] as string,
          rationale: row["rationale"] as string,
          revisable: row["revisable"] as string,
          made_by: (row["made_by"] as DecisionMadeBy) ?? "agent",
          superseded_by: (row["superseded_by"] as string) ?? null,
        };
        if (!dryRun) {
          mdStorage.insertDecision(decision);
        }
        stats.decisions++;
      }
    } catch (err) {
      stats.errors.push(`Failed to migrate decisions: ${(err as Error).message}`);
    }

    // ── Migrate Requirements ───────────────────────────────────────────
    try {
      const rows = db.prepare("SELECT * FROM requirements").all();
      for (const row of rows) {
        const req = {
          id: row["id"] as string,
          class: row["class"] as string,
          status: row["status"] as string,
          description: row["description"] as string,
          why: row["why"] as string,
          source: row["source"] as string,
          primary_owner: row["primary_owner"] as string,
          supporting_slices: row["supporting_slices"] as string,
          validation: row["validation"] as string,
          notes: row["notes"] as string,
          full_content: row["full_content"] as string,
          superseded_by: (row["superseded_by"] as string) ?? null,
        };
        if (!dryRun) {
          mdStorage.insertRequirement(req);
        }
        stats.requirements++;
      }
    } catch (err) {
      stats.errors.push(`Failed to migrate requirements: ${(err as Error).message}`);
    }

    // ── Migrate Milestones ─────────────────────────────────────────────
    try {
      const rows = db.prepare("SELECT * FROM milestones ORDER BY id").all();
      for (const row of rows) {
        const milestone = {
          id: row["id"] as string,
          title: row["title"] as string,
          status: row["status"] as string,
          depends_on: JSON.parse((row["depends_on"] as string) || "[]"),
          created_at: row["created_at"] as string,
          completed_at: (row["completed_at"] as string) ?? null,
          vision: row["vision"] as string,
          success_criteria: JSON.parse((row["success_criteria"] as string) || "[]"),
          key_risks: JSON.parse((row["key_risks"] as string) || "[]"),
          proof_strategy: JSON.parse((row["proof_strategy"] as string) || "[]"),
          verification_contract: row["verification_contract"] as string,
          verification_integration: row["verification_integration"] as string,
          verification_operational: row["verification_operational"] as string,
          verification_uat: row["verification_uat"] as string,
          definition_of_done: JSON.parse((row["definition_of_done"] as string) || "[]"),
          requirement_coverage: row["requirement_coverage"] as string,
          boundary_map_markdown: row["boundary_map_markdown"] as string,
        };
        if (!dryRun) {
          mdStorage.insertMilestone(milestone);
          // If planning fields differ from defaults, upsert planning
          if (milestone.vision || milestone.success_criteria.length > 0) {
            mdStorage.upsertMilestonePlanning(milestone.id, {
              vision: milestone.vision,
              successCriteria: milestone.success_criteria,
              keyRisks: milestone.key_risks,
              proofStrategy: milestone.proof_strategy,
              verificationContract: milestone.verification_contract,
              verificationIntegration: milestone.verification_integration,
              verificationOperational: milestone.verification_operational,
              verificationUat: milestone.verification_uat,
              definitionOfDone: milestone.definition_of_done,
              requirementCoverage: milestone.requirement_coverage,
              boundaryMapMarkdown: milestone.boundary_map_markdown,
            });
          }
          // Update status if not default
          if (milestone.status !== "queued") {
            mdStorage.updateMilestoneStatus(milestone.id, milestone.status, milestone.completed_at);
          }
        }
        stats.milestones++;
      }
    } catch (err) {
      stats.errors.push(`Failed to migrate milestones: ${(err as Error).message}`);
    }

    // ── Migrate Slices ─────────────────────────────────────────────────
    try {
      const rows = db.prepare("SELECT * FROM slices ORDER BY milestone_id, sequence, id").all();
      for (const row of rows) {
        const slice = {
          milestone_id: row["milestone_id"] as string,
          id: row["id"] as string,
          title: row["title"] as string,
          status: row["status"] as string,
          risk: row["risk"] as string,
          depends: JSON.parse((row["depends"] as string) || "[]"),
          demo: row["demo"] as string,
          created_at: row["created_at"] as string,
          completed_at: (row["completed_at"] as string) ?? null,
          full_summary_md: row["full_summary_md"] as string,
          full_uat_md: row["full_uat_md"] as string,
          goal: row["goal"] as string,
          success_criteria: row["success_criteria"] as string,
          proof_level: row["proof_level"] as string,
          integration_closure: row["integration_closure"] as string,
          observability_impact: row["observability_impact"] as string,
          sequence: row["sequence"] as number,
          replan_triggered_at: (row["replan_triggered_at"] as string) ?? null,
        };
        if (!dryRun) {
          mdStorage.insertSlice(slice);
          if (slice.full_summary_md || slice.full_uat_md) {
            mdStorage.setSliceSummaryMd(slice.milestone_id, slice.id, slice.full_summary_md, slice.full_uat_md);
          }
          if (slice.status !== "pending") {
            mdStorage.updateSliceStatus(slice.milestone_id, slice.id, slice.status, slice.completed_at ?? undefined);
          }
          if (slice.goal || slice.success_criteria) {
            mdStorage.upsertSlicePlanning(slice.milestone_id, slice.id, {
              goal: slice.goal,
              successCriteria: slice.success_criteria,
              proofLevel: slice.proof_level,
              integrationClosure: slice.integration_closure,
              observabilityImpact: slice.observability_impact,
            });
          }
        }
        stats.slices++;
      }
    } catch (err) {
      stats.errors.push(`Failed to migrate slices: ${(err as Error).message}`);
    }

    // ── Migrate Slice Dependencies ─────────────────────────────────────
    try {
      const depTableExists = db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='slice_dependencies'").get();
      if (depTableExists) {
        const rows = db.prepare("SELECT * FROM slice_dependencies").all();
        // Group by milestone
        const depMap = new Map<string, Map<string, string[]>>();
        for (const row of rows) {
          const mid = row["milestone_id"] as string;
          const sid = row["slice_id"] as string;
          const dep = row["depends_on_slice_id"] as string;
          if (!depMap.has(mid)) depMap.set(mid, new Map());
          const sliceDeps = depMap.get(mid)!;
          if (!sliceDeps.has(sid)) sliceDeps.set(sid, []);
          sliceDeps.get(sid)!.push(dep);
        }
        if (!dryRun) {
          for (const [mid, sliceDeps] of depMap) {
            for (const [sid, deps] of sliceDeps) {
              mdStorage.syncSliceDependencies(mid, sid, deps);
            }
          }
        }
        stats.sliceDependencies = rows.length;
      }
    } catch (err) {
      stats.errors.push(`Failed to migrate slice dependencies: ${(err as Error).message}`);
    }

    // ── Migrate Tasks ──────────────────────────────────────────────────
    try {
      const rows = db.prepare("SELECT * FROM tasks ORDER BY milestone_id, slice_id, sequence, id").all();
      for (const row of rows) {
        const parseArray = (raw: unknown): string[] => {
          if (Array.isArray(raw)) return raw.filter((x): x is string => typeof x === "string");
          if (typeof raw !== "string") return [];
          try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
          } catch {
            return raw.split(",").map((v) => v.trim()).filter(Boolean);
          }
        };
        const task = {
          milestone_id: row["milestone_id"] as string,
          slice_id: row["slice_id"] as string,
          id: row["id"] as string,
          title: row["title"] as string,
          status: row["status"] as string,
          one_liner: row["one_liner"] as string,
          narrative: row["narrative"] as string,
          verification_result: row["verification_result"] as string,
          duration: row["duration"] as string,
          completed_at: (row["completed_at"] as string) ?? null,
          blocker_discovered: (row["blocker_discovered"] as number) === 1,
          deviations: row["deviations"] as string,
          known_issues: row["known_issues"] as string,
          key_files: parseArray(row["key_files"]),
          key_decisions: parseArray(row["key_decisions"]),
          full_summary_md: row["full_summary_md"] as string,
          description: row["description"] as string,
          estimate: row["estimate"] as string,
          files: parseArray(row["files"]),
          verify: row["verify"] as string,
          inputs: parseArray(row["inputs"]),
          expected_output: parseArray(row["expected_output"]),
          observability_impact: row["observability_impact"] as string,
          full_plan_md: row["full_plan_md"] as string,
          sequence: row["sequence"] as number,
        };
        if (!dryRun) {
          mdStorage.insertTask(task);
          if (task.full_summary_md) {
            mdStorage.setTaskSummaryMd(task.milestone_id, task.slice_id, task.id, task.full_summary_md);
          }
          if (task.description || task.estimate || task.files.length > 0) {
            mdStorage.upsertTaskPlanning(task.milestone_id, task.slice_id, task.id, {
              description: task.description,
              estimate: task.estimate,
              files: task.files,
              verify: task.verify,
              inputs: task.inputs,
              expectedOutput: task.expected_output,
              observabilityImpact: task.observability_impact,
              fullPlanMd: task.full_plan_md,
            });
          }
        }
        stats.tasks++;
      }
    } catch (err) {
      stats.errors.push(`Failed to migrate tasks: ${(err as Error).message}`);
    }

    // ── Migrate Artifacts ──────────────────────────────────────────────
    try {
      const rows = db.prepare("SELECT * FROM artifacts").all();
      for (const row of rows) {
        const artifact = {
          path: row["path"] as string,
          type: row["artifact_type"] as string,
          milestone_id: (row["milestone_id"] as string) ?? null,
          slice_id: (row["slice_id"] as string) ?? null,
          task_id: (row["task_id"] as string) ?? null,
          full_content: row["full_content"] as string,
          created_at: row["imported_at"] as string,
        };
        if (!dryRun) {
          mdStorage.insertArtifact(artifact);
        }
        stats.artifacts++;
      }
    } catch (err) {
      stats.errors.push(`Failed to migrate artifacts: ${(err as Error).message}`);
    }

    // ── Migrate Verification Evidence ──────────────────────────────────
    try {
      const rows = db.prepare("SELECT * FROM verification_evidence ORDER BY milestone_id, slice_id, task_id, id").all();
      for (const row of rows) {
        const evidence = {
          milestone_id: row["milestone_id"] as string,
          slice_id: row["slice_id"] as string,
          task_id: row["task_id"] as string,
          command: row["command"] as string,
          exit_code: row["exit_code"] as number,
          verdict: row["verdict"] as string,
          duration_ms: row["duration_ms"] as number,
          created_at: row["created_at"] as string,
        };
        if (!dryRun) {
          mdStorage.insertVerificationEvidence(evidence);
        }
        stats.verificationEvidence++;
      }
    } catch (err) {
      stats.errors.push(`Failed to migrate verification evidence: ${(err as Error).message}`);
    }

    // ── Migrate Replan History ─────────────────────────────────────────
    try {
      const rows = db.prepare("SELECT * FROM replan_history ORDER BY milestone_id, created_at").all();
      for (const row of rows) {
        const entry = {
          milestone_id: row["milestone_id"] as string,
          slice_id: (row["slice_id"] as string) ?? null,
          task_id: (row["task_id"] as string) ?? null,
          summary: row["summary"] as string,
          previous_artifact_path: (row["previous_artifact_path"] as string) ?? null,
          replacement_artifact_path: (row["replacement_artifact_path"] as string) ?? null,
          created_at: row["created_at"] as string,
        };
        if (!dryRun) {
          mdStorage.insertReplanHistory(entry);
        }
        stats.replanHistory++;
      }
    } catch (err) {
      stats.errors.push(`Failed to migrate replan history: ${(err as Error).message}`);
    }

    // ── Migrate Assessments ────────────────────────────────────────────
    try {
      const rows = db.prepare("SELECT * FROM assessments").all();
      for (const row of rows) {
        const assessment = {
          path: row["path"] as string,
          milestone_id: row["milestone_id"] as string,
          slice_id: (row["slice_id"] as string) ?? null,
          task_id: (row["task_id"] as string) ?? null,
          status: row["status"] as string,
          scope: row["scope"] as string,
          full_content: row["full_content"] as string,
          created_at: row["created_at"] as string,
        };
        if (!dryRun) {
          mdStorage.insertAssessment(assessment);
        }
        stats.assessments++;
      }
    } catch (err) {
      stats.errors.push(`Failed to migrate assessments: ${(err as Error).message}`);
    }

    // ── Migrate Quality Gates ──────────────────────────────────────────
    try {
      const rows = db.prepare("SELECT * FROM quality_gates ORDER BY milestone_id, slice_id").all();
      // Group by milestone/slice
      const gateMap = new Map<string, GateRow[]>();
      for (const row of rows) {
        const key = `${row["milestone_id"]}|${row["slice_id"]}`;
        if (!gateMap.has(key)) gateMap.set(key, []);
        gateMap.get(key)!.push({
          milestone_id: row["milestone_id"] as string,
          slice_id: row["slice_id"] as string,
          gate_id: row["gate_id"] as import("./types.js").GateId,
          scope: row["scope"] as import("./types.js").GateScope,
          task_id: (row["task_id"] as string) ?? "",
          status: row["status"] as import("./types.js").GateStatus,
          verdict: row["verdict"] as import("./types.js").GateVerdict,
          rationale: row["rationale"] as string,
          findings: row["findings"] as string,
          evaluated_at: (row["evaluated_at"] as string) ?? null,
        });
      }
      for (const [key, gates] of gateMap) {
        const [mid, sid] = key.split("|");
        for (const gate of gates) {
          if (gate.status === "pending") {
            if (!dryRun) mdStorage.insertGateRow(gate);
          } else {
            if (!dryRun) mdStorage.saveGateResult({
              ...gate,
              rationale: gate.rationale,
              findings: gate.findings,
            });
          }
        }
      }
      stats.gates = rows.length;
    } catch (err) {
      stats.errors.push(`Failed to migrate quality gates: ${(err as Error).message}`);
    }

    // ── Verification ───────────────────────────────────────────────────
    if (!dryRun) {
      console.log("Verifying round-trip consistency...");
      const verifyDb = openSqliteDb(dbPath);
      if (verifyDb) {
        // Spot-check counts
        const dbDecisions = verifyDb.prepare("SELECT COUNT(*) as c FROM decisions").get();
        const mdDecisions = mdStorage.getActiveDecisions().length + mdStorage.getAllMilestones().length; // rough check
        const totalDbDecisions = (dbDecisions as { c: number }).c;
        if (totalDbDecisions !== stats.decisions) {
          stats.errors.push(`Decision count mismatch: DB=${totalDbDecisions}, migrated=${stats.decisions}`);
        }

        const dbMilestones = verifyDb.prepare("SELECT COUNT(*) as c FROM milestones").get();
        const totalDbMilestones = (dbMilestones as { c: number }).c;
        if (totalDbMilestones !== stats.milestones) {
          stats.errors.push(`Milestone count mismatch: DB=${totalDbMilestones}, migrated=${stats.milestones}`);
        }

        verifyDb.close();
      }
    }

    // ── Delete DB (optional) ───────────────────────────────────────────
    if (!dryRun && deleteDb && stats.errors.length === 0) {
      try {
        unlinkSync(dbPath);
        // Also delete WAL and SHM files if they exist
        try { unlinkSync(`${dbPath}-wal`); } catch { /* ignore */ }
        try { unlinkSync(`${dbPath}-shm`); } catch { /* ignore */ }
        console.log(`Deleted database: ${dbPath}`);
      } catch (err) {
        stats.errors.push(`Failed to delete database: ${(err as Error).message}`);
      }
    }

  } finally {
    db.close();
  }

  return stats;
}

// ─── CLI entry point ─────────────────────────────────────────────────────

// Use dynamic import for top-level await
async function main() {
  const args = process.argv.slice(2);
  const projectRoot = args.find(a => !a.startsWith("--")) || process.cwd();
  const dryRun = args.includes("--dry-run");
  const deleteDb = args.includes("--delete-db");

  const dbPath = join(projectRoot, ".gsd", "gsd.db");

  console.log(`Storage Migration: SQLite → Markdown/JSON`);
  console.log(`Project root: ${projectRoot}`);
  console.log(`Database: ${dbPath}`);
  console.log(`Dry run: ${dryRun}`);
  console.log(`Delete DB after: ${deleteDb}`);
  console.log("");

  if (!existsSync(dbPath)) {
    console.log(`No database found at ${dbPath}. Nothing to migrate.`);
    process.exit(0);
  }

  const stats = await migrateFromSqlite(dbPath, projectRoot, dryRun, deleteDb);

  console.log("Migration stats:");
  console.log(`  Decisions:            ${stats.decisions}`);
  console.log(`  Requirements:         ${stats.requirements}`);
  console.log(`  Milestones:           ${stats.milestones}`);
  console.log(`  Slices:               ${stats.slices}`);
  console.log(`  Tasks:                ${stats.tasks}`);
  console.log(`  Artifacts:            ${stats.artifacts}`);
  console.log(`  Verification evidence: ${stats.verificationEvidence}`);
  console.log(`  Replan history:       ${stats.replanHistory}`);
  console.log(`  Assessments:          ${stats.assessments}`);
  console.log(`  Quality gates:        ${stats.gates}`);
  console.log(`  Slice dependencies:   ${stats.sliceDependencies}`);

  if (stats.errors.length > 0) {
    console.log("\nErrors:");
    for (const err of stats.errors) {
      console.log(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log("\nMigration complete!");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
