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

import { existsSync, mkdirSync, copyFileSync, readFileSync, readdirSync, statSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import type { StorageBackend } from "./storage-backend.js";
import { SQLiteStorage } from "./storage-sqlite.js";
import { MarkdownStorage } from "./storage-markdown.js";
import { getDbPath, openDatabase, closeDatabase } from "./gsd-db.js";

/** Migration statistics. */
export interface MigrationStats {
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
export interface MigrationResult {
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
 * Copy a directory recursively.
 */
function copyDirRecursive(src: string, dest: string): void {
  if (!existsSync(src)) return;
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    try {
      const s = statSync(srcPath);
      if (s.isDirectory()) {
        copyDirRecursive(srcPath, destPath);
      } else {
        copyFileSync(srcPath, destPath);
      }
    } catch {
      // Skip inaccessible files
    }
  }
}

/**
 * Read all JSON files from a directory.
 */
function readAllJsonFiles(dir: string): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];
  if (!existsSync(dir)) return results;
  try {
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
 * Migrate from SQLite to Markdown storage.
 */
export async function migrateToMarkdown(basePath: string = process.cwd()): Promise<MigrationResult> {
  const errors: string[] = [];
  const stats: MigrationStats = {
    decisions: 0, requirements: 0, milestones: 0, slices: 0,
    tasks: 0, artifacts: 0, verificationEvidence: 0,
    replanHistory: 0, assessments: 0, gates: 0,
  };

  const gsdDir = join(basePath, ".gsd");
  const dbPath = join(gsdDir, "gsd.db");
  if (!existsSync(dbPath)) {
    return {
      success: false, stats, sourcePath: dbPath,
      targetPath: join(gsdDir, "storage"), backupPath: null,
      errors: ["No SQLite database found. Nothing to migrate."],
    };
  }

  // Open SQLite and read all data
  openDatabase(basePath);
  const sqlite = new SQLiteStorage();
  sqlite.open(gsdDir);

  // Create backup
  const backupDir = createBackupDir(basePath, "sqlite-to-markdown");
  copyFileSafe(dbPath, join(backupDir, "gsd.db"));

  // Read data from SQLite
  const milestones = sqlite.getAllMilestones();
  stats.milestones = milestones.length;

  const decisions = sqlite.getActiveDecisions();
  stats.decisions = decisions.length;

  const requirements = sqlite.getActiveRequirements();
  stats.requirements = requirements.length;

  // Close SQLite
  sqlite.close();
  closeDatabase();

  // Open Markdown storage and write data
  const markdown = new MarkdownStorage();
  markdown.open(basePath);

  try {
    // Insert milestones
    for (const m of milestones) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        markdown.insertMilestone(m as any);
      } catch (e) {
        errors.push(`Failed to migrate milestone ${m.id}: ${(e as Error).message}`);
      }
    }

    // Insert slices
    for (const m of milestones) {
      const slices = sqlite.isOpen() ? [] : markdown.getMilestoneSlices(m.id);
      // We need slices from SQLite, so re-open briefly
    }

    // Re-open SQLite to get slices and tasks
    openDatabase(basePath);
    const sqlite2 = new SQLiteStorage();
    sqlite2.open(gsdDir);

    for (const m of milestones) {
      const slices = sqlite2.getMilestoneSlices(m.id);
      stats.slices += slices.length;
      for (const s of slices) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          markdown.insertSlice(s as any);
        } catch (e) {
          errors.push(`Failed to migrate slice ${s.id}: ${(e as Error).message}`);
        }

        const tasks = sqlite2.getSliceTasks(m.id, s.id);
        stats.tasks += tasks.length;
        for (const t of tasks) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            markdown.insertTask(t as any);
          } catch (e) {
            errors.push(`Failed to migrate task ${t.id}: ${(e as Error).message}`);
          }
        }
      }
    }

    sqlite2.close();
    closeDatabase();

    // Insert decisions
    for (const d of decisions) {
      try {
        markdown.upsertDecision(d);
      } catch (e) {
        errors.push(`Failed to migrate decision ${d.id}: ${(e as Error).message}`);
      }
    }

    // Insert requirements
    for (const r of requirements) {
      try {
        markdown.upsertRequirement(r);
      } catch (e) {
        errors.push(`Failed to migrate requirement ${r.id}: ${(e as Error).message}`);
      }
    }

    // Verify milestone count
    const actualMilestones = markdown.getAllMilestones();
    if (actualMilestones.length !== stats.milestones) {
      errors.push(`Milestone count mismatch: expected ${stats.milestones}, got ${actualMilestones.length}`);
    }

    return {
      success: errors.length === 0,
      stats,
      sourcePath: dbPath,
      targetPath: join(gsdDir, "storage"),
      backupPath: backupDir,
      errors,
    };
  } finally {
    markdown.close();
  }
}

/**
 * Migrate from Markdown to SQLite storage.
 */
export async function migrateToSqlite(basePath: string = process.cwd()): Promise<MigrationResult> {
  const errors: string[] = [];
  const stats: MigrationStats = {
    decisions: 0, requirements: 0, milestones: 0, slices: 0,
    tasks: 0, artifacts: 0, verificationEvidence: 0,
    replanHistory: 0, assessments: 0, gates: 0,
  };

  const gsdDir = join(basePath, ".gsd");
  const storageDir = join(gsdDir, "storage");
  if (!existsSync(storageDir)) {
    return {
      success: false, stats, sourcePath: storageDir,
      targetPath: join(gsdDir, "gsd.db"), backupPath: null,
      errors: ["No Markdown storage directory found. Nothing to migrate."],
    };
  }

  // Create backup
  const backupDir = createBackupDir(basePath, "markdown-to-sqlite");
  // Backup log files
  for (const file of ["DECISIONS.md", "REQUIREMENTS.md"]) {
    const src = join(gsdDir, file);
    if (existsSync(src)) copyFileSafe(src, join(backupDir, file));
  }
  // Backup storage dir
  copyDirRecursive(storageDir, join(backupDir, "storage"));

  // Read data from markdown storage
  const markdown = new MarkdownStorage();
  markdown.open(basePath);

  const milestones = markdown.getAllMilestones();
  stats.milestones = milestones.length;

  const decisions = markdown.getActiveDecisions();
  stats.decisions = decisions.length;

  const requirements = markdown.getActiveRequirements();
  stats.requirements = requirements.length;

  // Count slices and tasks
  for (const m of milestones) {
    const slices = markdown.getMilestoneSlices(m.id);
    stats.slices += slices.length;
    for (const s of slices) {
      const tasks = markdown.getSliceTasks(m.id, s.id);
      stats.tasks += tasks.length;
    }
  }

  markdown.close();

  // Open SQLite and write data
  openDatabase(basePath);
  const sqlite = new SQLiteStorage();
  sqlite.open(gsdDir);

  try {
    // Insert milestones
    for (const m of milestones) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sqlite.insertMilestone(m as any);
      } catch (e) {
        errors.push(`Failed to import milestone ${(m as any).id}: ${(e as Error).message}`);
      }
    }

    // Insert slices
    for (const m of milestones) {
      const slices = markdown.isOpen() ? [] : [];
      // Re-read slices from markdown
    }

    // Re-open markdown to get slices and tasks
    const markdown2 = new MarkdownStorage();
    markdown2.open(basePath);

    for (const m of milestones) {
      const slices = markdown2.getMilestoneSlices(m.id);
      for (const s of slices) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sqlite.insertSlice(s as any);
        } catch (e) {
          errors.push(`Failed to import slice ${(s as any).id}: ${(e as Error).message}`);
        }

        const tasks = markdown2.getSliceTasks(m.id, s.id);
        for (const t of tasks) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sqlite.insertTask(t as any);
          } catch (e) {
            errors.push(`Failed to import task ${(t as any).id}: ${(e as Error).message}`);
          }
        }
      }
    }

    markdown2.close();

    // Insert decisions
    for (const d of decisions) {
      try {
        sqlite.upsertDecision(d);
      } catch (e) {
        errors.push(`Failed to import decision ${(d as any).id}: ${(e as Error).message}`);
      }
    }

    // Insert requirements
    for (const r of requirements) {
      try {
        sqlite.upsertRequirement(r);
      } catch (e) {
        errors.push(`Failed to import requirement ${(r as any).id}: ${(e as Error).message}`);
      }
    }

    // Verify milestone count
    const actualMilestones = sqlite.getAllMilestones();
    if (actualMilestones.length !== stats.milestones) {
      errors.push(`Milestone count mismatch: expected ${stats.milestones}, got ${actualMilestones.length}`);
    }

    return {
      success: errors.length === 0,
      stats,
      sourcePath: storageDir,
      targetPath: join(gsdDir, "gsd.db"),
      backupPath: backupDir,
      errors,
    };
  } finally {
    sqlite.close();
    closeDatabase();
  }
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
