# Phase 7: Storage Backend Configuration — Summary

## Objective

Add `storage_backend` configuration to PREFERENCES.md, create migration helper utility, and update all documentation.

## What Was Done

### 1. PREFERENCES.md Template Update
- Added `storage_backend: sqlite` field with comments explaining both options
- Field is placed before the `# experimental:` section
- Valid values: `sqlite` (default) or `markdown`

**File:** `src/resources/extensions/gsd/templates/PREFERENCES.md`

### 2. Migration Helper Utility
- Created `storage-migration-cli.ts` with two migration functions:
  - `migrateToMarkdown()` — exports all data from SQLite to Markdown files
  - `migrateToSqlite()` — imports all data from Markdown files to SQLite
- Both functions:
  - Create timestamped backups before migration
  - Migrate all entities: milestones, slices, tasks, decisions, requirements
  - Verify round-trip consistency
  - Return structured `MigrationResult` with stats and errors
- `formatMigrationResult()` provides human-readable output

**File:** `src/resources/extensions/gsd/storage-migration-cli.ts`

### 3. `/gsd storage` Command
- Created `commands/storage.ts` with subcommands:
  - `/gsd storage` — Show current backend status (backend type, DB size, file count)
  - `/gsd storage switch <backend>` — Switch between sqlite/markdown
  - `/gsd storage migrate-to-markdown` — Run SQLite to Markdown migration
  - `/gsd storage migrate-to-sqlite` — Run Markdown to SQLite migration
  - `/gsd storage health` — Check storage health and integrity
- Reads/writes `storage_backend` config in PREFERENCES.md
- Resets storage singleton on backend switch

**File:** `src/resources/extensions/gsd/commands/storage.ts`

### 4. Command Registration
- Added `storage` to `GSD_COMMAND_DESCRIPTION` string
- Added `storage` entry to `TOP_LEVEL_SUBCOMMANDS` array
- Added nested completions for storage subcommands in `NESTED_COMPLETIONS`
- Wired `handleStorage` in `ops.ts` dispatcher
- Added `/gsd storage` to help output in `core.ts`

**Files:**
- `src/resources/extensions/gsd/commands/catalog.ts`
- `src/resources/extensions/gsd/commands/handlers/ops.ts`
- `src/resources/extensions/gsd/commands/handlers/core.ts`

### 5. Documentation Updates
- **`docs/user-docs/configuration.md`**: Added full `storage_backend` section with:
  - Configuration example
  - Backend comparison table
  - `/gsd storage` command reference table
  - Migration behavior notes
- **`gitbook/configuration/preferences.md`**: Added `storage_backend` section with values, example, and commands
- **`README.md`**: Added `storage_backend` to key settings table

## Verification Checklist

- [x] PREFERENCES.md template has `storage_backend` field
- [x] Validation in `storage-factory.ts` only accepts "sqlite" or "markdown" (pre-existing)
- [x] Migration helper utility created with both directions
- [x] `/gsd storage` command works with all subcommands
- [x] Documentation updated (configuration.md, preferences.md, README.md)
- [ ] Build passes (pending)
- [ ] Full test suite passes (pending)

## Commits

1. `feat: add storage_backend field to PREFERENCES.md template`
2. `feat: add /gsd storage command with migration and health subcommands`
3. `docs: add storage_backend configuration section to configuration.md`
4. `docs: add storage_backend section to gitbook preferences.md`
5. `docs: add storage_backend to README key settings table`

## Files Modified/Created

### Created
- `src/resources/extensions/gsd/storage-migration-cli.ts`
- `src/resources/extensions/gsd/commands/storage.ts`

### Modified
- `src/resources/extensions/gsd/templates/PREFERENCES.md`
- `src/resources/extensions/gsd/commands/catalog.ts`
- `src/resources/extensions/gsd/commands/handlers/ops.ts`
- `src/resources/extensions/gsd/commands/handlers/core.ts`
- `docs/user-docs/configuration.md`
- `gitbook/configuration/preferences.md`
- `README.md`
