---
phase: "03-unit-ownership-rewrite"
plan: "01"
type: implementation
wave: 1
depends_on: ["01-storage-backend-abstraction"]
files_modified:
  - src/resources/extensions/gsd/unit-ownership.ts
autonomous: true
completed: "2026-04-14T07:30:00Z"
---

## Summary

### What Was Built

Replaced SQLite in unit-ownership.ts with file-based locking using individual .claim JSON files.

### Key Changes

1. **Removed all SQLite dependencies** — No node:sqlite or better-sqlite3 imports
2. **File-based storage** — Each claim stored as `.gsd/unit-claims/{unitKey}.claim` (JSON)
3. **Atomic writes** — Temp file + renameSync pattern for first-writer-wins semantics
4. **Migration tool** — `npx tsx .../unit-ownership.ts migrate [path] [--delete-db]`
5. **Same public API** — All existing callers work without changes

### Files Modified

- `src/resources/extensions/gsd/unit-ownership.ts` (267 lines, -200 SQLite lines, +180 file lines)

### Architecture Decisions

1. **Atomic write pattern**: Write to `.claim.tmp`, then `renameSync()` to `.claim`. This is atomic on POSIX and provides first-writer-wins semantics equivalent to `INSERT OR IGNORE`.

2. **No file locking needed**: The renameSync operation is atomic — if two processes try to claim simultaneously, only one succeeds. The loser's temp file is cleaned up.

3. **Backward compatible**: All public functions (claimUnit, releaseUnit, getOwner, checkOwnership, initOwnershipTable, closeOwnershipDb) have the same signatures.

### Verification

- ✅ Build passes
- ✅ No SQLite imports
- ✅ Atomic claim/unclaim operations
- ✅ Migration tool included
