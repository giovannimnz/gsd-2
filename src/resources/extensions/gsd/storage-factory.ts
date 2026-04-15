/**
 * Storage Backend Factory
 * 
 * Creates the appropriate StorageBackend based on PREFERENCES.md config.
 * Reads `storage_backend` field from:
 *   - `~/.gsd/PREFERENCES.md` (global)
 *   - `.gsd/PREFERENCES.md` (project, overrides global)
 * 
 * Default: "sqlite"
 */

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { StorageBackend, BackendType } from "./storage-backend.js";
import { SQLiteStorage } from "./storage-sqlite.js";
import { MarkdownStorage } from "./storage-markdown.js";

/**
 * Read storage_backend from PREFERENCES.md.
 * Returns "sqlite" (default) or "markdown".
 * 
 * @param basePath Project root path (for reading PREFERENCES.md)
 * @returns BackendType - "sqlite" (default) or "markdown"
 */
export function readStorageBackend(basePath: string = process.cwd()): BackendType {
  // Check project-level PREFERENCES.md first
  const projectPrefs = join(basePath, ".gsd", "PREFERENCES.md");
  if (existsSync(projectPrefs)) {
    const content = readFileSync(projectPrefs, "utf-8");
    const match = content.match(/^storage_backend:\s*(.+)$/m);
    if (match) {
      const value = match[1].trim().toLowerCase();
      if (value === "markdown" || value === "sqlite") {
        return value as BackendType;
      }
    }
  }

  // Check global PREFERENCES.md
  const home = process.env.HOME ?? process.env.USERPROFILE ?? "";
  if (home) {
    const globalPrefs = join(home, ".gsd", "PREFERENCES.md");
    if (existsSync(globalPrefs)) {
      const content = readFileSync(globalPrefs, "utf-8");
      const match = content.match(/^storage_backend:\s*(.+)$/m);
      if (match) {
        const value = match[1].trim().toLowerCase();
        if (value === "markdown" || value === "sqlite") {
          return value as BackendType;
        }
      }
    }
  }

  // Default to sqlite
  return "sqlite";
}

/**
 * Global singleton storage backend instance.
 */
let _instance: StorageBackend | null = null;
let _backendType: BackendType | null = null;

/**
 * Create or return the singleton StorageBackend based on PREFERENCES.md config.
 * 
 * @param basePath Project root path (for reading PREFERENCES.md)
 * @returns StorageBackend instance (SQLite or Markdown)
 */
export function createStorageBackend(basePath: string = process.cwd()): StorageBackend {
  if (_instance) {
    return _instance;
  }

  const backendType = readStorageBackend(basePath);
  _backendType = backendType;

  switch (backendType) {
    case "markdown":
      _instance = new MarkdownStorage();
      break;
    case "sqlite":
    default:
      _instance = new SQLiteStorage();
      break;
  }

  // _instance is guaranteed to be non-null after the switch
  return _instance as StorageBackend;
}

/**
 * Get the current backend type, or null if not yet initialized.
 */
export function getBackendType(): BackendType | null {
  return _backendType;
}

/**
 * Reset the singleton (useful for testing).
 */
export function resetStorageBackend(): void {
  if (_instance) {
    try {
      _instance.close();
    } catch {
      // Ignore close errors during reset
    }
  }
  _instance = null;
  _backendType = null;
}
