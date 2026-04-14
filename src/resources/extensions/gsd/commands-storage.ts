/**
 * GSD Storage Management
 *
 * Contains: handleStorage — /gsd storage command handler
 *
 * Subcommands:
 *   /gsd storage              — Show current backend status
 *   /gsd storage switch <backend>  — Switch storage backend
 *   /gsd storage migrate-to-markdown — Migrate SQLite to Markdown
 *   /gsd storage migrate-to-sqlite   — Migrate Markdown to SQLite
 *   /gsd storage health       — Check storage health
 */

import type { ExtensionCommandContext } from "@gsd/pi-coding-agent";
import { existsSync, readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { gsdRoot } from "./paths.js";
import { logWarning } from "./workflow-logger.js";
import { getErrorMessage } from "./error-utils.js";

/**
 * Get file size in a human-readable format.
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Count files recursively in a directory.
 */
function countFiles(dir: string): number {
  if (!existsSync(dir)) return 0;
  let count = 0;
  try {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry);
      try {
        const s = statSync(fullPath);
        if (s.isFile()) count++;
        else if (s.isDirectory()) count += countFiles(fullPath);
      } catch {
        // Skip inaccessible files
      }
    }
  } catch {
    // Directory doesn't exist or is unreadable
  }
  return count;
}

/**
 * Read storage_backend from PREFERENCES.md.
 */
function readStorageBackendConfig(basePath: string): string {
  // Check project-level first
  const projectPrefs = join(basePath, ".gsd", "PREFERENCES.md");
  if (existsSync(projectPrefs)) {
    const content = readFileSync(projectPrefs, "utf-8");
    const match = content.match(/^storage_backend:\s*(.+)$/m);
    if (match) return match[1].trim().toLowerCase();
  }

  // Check global
  const home = process.env.HOME ?? process.env.USERPROFILE ?? "";
  if (home) {
    const globalPrefs = join(home, ".gsd", "PREFERENCES.md");
    if (existsSync(globalPrefs)) {
      const content = readFileSync(globalPrefs, "utf-8");
      const match = content.match(/^storage_backend:\s*(.+)$/m);
      if (match) return match[1].trim().toLowerCase();
    }
  }

  return "sqlite"; // default
}

/**
 * Update storage_backend in project PREFERENCES.md.
 */
function updateStorageBackendConfig(basePath: string, backend: "sqlite" | "markdown"): void {
  const prefsPath = join(basePath, ".gsd", "PREFERENCES.md");

  // Ensure .gsd directory exists
  mkdirSync(join(basePath, ".gsd"), { recursive: true });

  let content = "";
  if (existsSync(prefsPath)) {
    content = readFileSync(prefsPath, "utf-8");
  }

  // Check if storage_backend field exists
  const existingMatch = content.match(/^(# Storage backend for GSD state\n# sqlite.*\n# markdown.*\n)?storage_backend:\s*.+$/m);
  if (existingMatch) {
    // Update existing value
    content = content.replace(
      /^(storage_backend:\s*)\S+$/m,
      `$1${backend}`,
    );
  } else {
    // Add before the --- frontmatter end
    const frontmatterEnd = content.indexOf("\n---");
    if (frontmatterEnd !== -1) {
      content = content.slice(0, frontmatterEnd) +
        `# Storage backend for GSD state\n# sqlite: uses SQLite (default, full-featured)\n# markdown: uses plain .md files (portable, no DB dependency)\nstorage_backend: ${backend}` +
        content.slice(frontmatterEnd);
    } else {
      // No frontmatter — create one
      content = `---\nversion: 1\n# Storage backend for GSD state\nstorage_backend: ${backend}\n---\n\n# GSD Preferences\n`;
    }
  }

  writeFileSync(prefsPath, content, "utf-8");
}

/**
 * Show storage status.
 */
async function showStorageStatus(ctx: ExtensionCommandContext, basePath: string): Promise<void> {
  const currentBackend = readStorageBackendConfig(basePath);
  const gsdDir = gsdRoot(basePath);
  const dbPath = join(gsdDir, "gsd.db");
  const storageDir = join(gsdDir, "storage");

  const lines: string[] = [];
  lines.push("Storage Backend Status\n");
  lines.push(`Backend:     ${currentBackend}`);

  // SQLite info
  if (existsSync(dbPath)) {
    try {
      const dbStat = statSync(dbPath);
      lines.push(`Database:    .gsd/gsd.db (${formatFileSize(dbStat.size)})`);
    } catch {
      lines.push("Database:    .gsd/gsd.db (access error)");
    }
  } else {
    lines.push("Database:    .gsd/gsd.db (not created yet)");
  }

  // Markdown info
  const fileCount = countFiles(storageDir);
  lines.push(`Files:       .gsd/storage/ (${fileCount} files)`);

  lines.push("");
  lines.push("Options:");
  const switchTo = currentBackend === "sqlite" ? "markdown" : "sqlite";
  lines.push(`  /gsd storage switch ${switchTo}  — Switch to ${switchTo.charAt(0).toUpperCase() + switchTo.slice(1)} backend`);
  lines.push(`  /gsd storage migrate-to-${switchTo} — Migrate data to ${switchTo} backend`);
  lines.push("  /gsd storage health     — Check storage health");

  ctx.ui.notify(lines.join("\n"), "info");
}

/**
 * Switch storage backend.
 */
async function switchBackend(ctx: ExtensionCommandContext, basePath: string, target: string): Promise<void> {
  if (target !== "sqlite" && target !== "markdown") {
    ctx.ui.notify(`Invalid backend: "${target}". Use "sqlite" or "markdown".`, "warning");
    return;
  }

  const currentBackend = readStorageBackendConfig(basePath);
  if (currentBackend === target) {
    ctx.ui.notify(`Already using ${target} backend.`, "info");
    return;
  }

  // Update the config
  updateStorageBackendConfig(basePath, target as "sqlite" | "markdown");

  // Reset the storage singleton so it picks up the new backend
  try {
    const { resetStorageBackend } = await import("./storage-factory.js");
    resetStorageBackend();
  } catch {
    // Singleton not loaded yet
  }

  ctx.ui.notify(`Storage backend switched to: ${target}\nRun /gsd storage migrate-to-${target} to migrate existing data.`, "info");
}

/**
 * Run migration.
 */
async function runMigration(ctx: ExtensionCommandContext, basePath: string, direction: "to-markdown" | "to-sqlite"): Promise<void> {
  ctx.ui.notify(`Starting migration ${direction === "to-markdown" ? "SQLite → Markdown" : "Markdown → SQLite"}...`, "info");

  try {
    if (direction === "to-markdown") {
      const { migrateToMarkdown, formatMigrationResult } = await import("./storage-migration-cli.js");
      const result = await migrateToMarkdown(basePath);
      ctx.ui.notify(formatMigrationResult(result), result.success ? "info" : "warning");
    } else {
      const { migrateToSqlite, formatMigrationResult } = await import("./storage-migration-cli.js");
      const result = await migrateToSqlite(basePath);
      ctx.ui.notify(formatMigrationResult(result), result.success ? "info" : "warning");
    }
  } catch (err) {
    logWarning("command", `/gsd storage migrate failed: ${getErrorMessage(err)}`);
    ctx.ui.notify(`Migration failed: ${getErrorMessage(err)}`, "error");
  }
}

/**
 * Check storage health.
 */
async function checkStorageHealth(ctx: ExtensionCommandContext, basePath: string): Promise<void> {
  const currentBackend = readStorageBackendConfig(basePath);
  const gsdDir = gsdRoot(basePath);
  const lines: string[] = ["Storage Health Check\n"];

  const issues: string[] = [];

  // Check backend-specific health
  if (currentBackend === "sqlite") {
    const dbPath = join(gsdDir, "gsd.db");
    if (!existsSync(dbPath)) {
      issues.push("SQLite database does not exist");
    } else {
      try {
        const { openDatabase, isDbAvailable, _getAdapter } = await import("./gsd-db.js");
        if (!isDbAvailable()) {
          openDatabase(gsdDir);
        }
        const adapter = _getAdapter();
        if (adapter) {
          // Basic integrity check
          try {
            const integrity = adapter.prepare("PRAGMA integrity_check").get();
            const ok = integrity && (integrity as Record<string, unknown>)["integrity_check"] === "ok";
            lines.push(`SQLite integrity: ${ok ? "ok" : "FAILED"}`);
            if (!ok) issues.push("SQLite integrity check failed");
          } catch {
            issues.push("Could not run SQLite integrity check");
          }

          // Check table counts
          try {
            const counts = {
              milestones: (adapter.prepare("SELECT count(*) as c FROM milestones").get() as Record<string, unknown>)?.["c"] ?? 0,
              slices: (adapter.prepare("SELECT count(*) as c FROM slices").get() as Record<string, unknown>)?.["c"] ?? 0,
              tasks: (adapter.prepare("SELECT count(*) as c FROM tasks").get() as Record<string, unknown>)?.["c"] ?? 0,
              decisions: (adapter.prepare("SELECT count(*) as c FROM decisions").get() as Record<string, unknown>)?.["c"] ?? 0,
            };
            lines.push(`Milestones: ${counts.milestones}`);
            lines.push(`Slices:     ${counts.slices}`);
            lines.push(`Tasks:      ${counts.tasks}`);
            lines.push(`Decisions:  ${counts.decisions}`);
          } catch {
            issues.push("Could not read table counts");
          }
        } else {
          issues.push("SQLite adapter not available");
        }
      } catch (e) {
        issues.push(`SQLite health check failed: ${getErrorMessage(e)}`);
      }
    }
  } else if (currentBackend === "markdown") {
    const storageDir = join(gsdDir, "storage");
    if (!existsSync(storageDir)) {
      issues.push("Markdown storage directory does not exist");
    } else {
      try {
        const fileCount = countFiles(storageDir);
        lines.push(`Storage files: ${fileCount}`);

        // Check for key directories
        const requiredDirs = ["milestones", "slices", "tasks"];
        for (const dir of requiredDirs) {
          const dirPath = join(storageDir, dir);
          lines.push(`  ${dir}/: ${existsSync(dirPath) ? "exists" : "missing"}`);
        }
      } catch (e) {
        issues.push(`Markdown health check failed: ${getErrorMessage(e)}`);
      }
    }
  }

  if (issues.length > 0) {
    lines.push("");
    lines.push("Issues:");
    for (const issue of issues) {
      lines.push(`  - ${issue}`);
    }
  } else {
    lines.push("\nAll checks passed.");
  }

  ctx.ui.notify(lines.join("\n"), issues.length > 0 ? "warning" : "info");
}

/**
 * Handle /gsd storage command.
 */
export async function handleStorage(args: string, ctx: ExtensionCommandContext): Promise<boolean> {
  const basePath = process.cwd();
  const trimmed = args.trim();

  if (!trimmed || trimmed === "status") {
    await showStorageStatus(ctx, basePath);
    return true;
  }

  if (trimmed.startsWith("switch ")) {
    const target = trimmed.replace(/^switch\s+/, "").trim();
    await switchBackend(ctx, basePath, target);
    return true;
  }

  if (trimmed === "migrate-to-markdown" || trimmed === "migrate-markdown") {
    await runMigration(ctx, basePath, "to-markdown");
    return true;
  }

  if (trimmed === "migrate-to-sqlite" || trimmed === "migrate-sqlite") {
    await runMigration(ctx, basePath, "to-sqlite");
    return true;
  }

  if (trimmed === "health") {
    await checkStorageHealth(ctx, basePath);
    return true;
  }

  // Unknown subcommand
  ctx.ui.notify(
    "Usage:\n" +
    "  /gsd storage                    — Show status\n" +
    "  /gsd storage switch <backend>   — Switch backend (sqlite|markdown)\n" +
    "  /gsd storage migrate-to-markdown — Migrate SQLite to Markdown\n" +
    "  /gsd storage migrate-to-sqlite   — Migrate Markdown to SQLite\n" +
    "  /gsd storage health             — Check storage health",
    "warning",
  );
  return true;
}
