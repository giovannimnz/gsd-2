# Phase 4: Memory Storage Rewrite - SUMMARY

## Objective
Replace sql.js (SQLite in-memory) with JSON file storage for the memory extraction pipeline.

## What Changed

### storage.ts (rewritten)
- Removed all sql.js imports and SQLite database operations
- New implementation uses individual JSON files per entity:
  - `.gsd/memory/{cwd}/jobs/{job-id}.json`
  - `.gsd/memory/{cwd}/threads/{thread-id}.json`
  - `.gsd/memory/{cwd}/stage1/{thread-id}.json`
- Atomic writes via temp file + rename pattern
- In-memory cache with debounced persistence (500ms)
- Same public API: `upsertThreads`, `claimStage1Jobs`, `completeStage1Job`, `failStage1Job`, `tryClaimGlobalPhase2Job`, `completePhase2Job`, `getStage1Outputs`, `getStage1OutputsForCwd`, `getThread`, `getStats`, `clearAll`, `clearForCwd`, `resetAllForCwd`, `close`

### migrate-from-sqlite.ts (new)
- One-shot migration script to convert existing `agent.db` to JSON files
- Usage: `npx tsx packages/pi-coding-agent/src/resources/extensions/memory/migrate-from-sqlite.ts [path-to-agent.db]`
- Reads SQLite tables, writes individual JSON files
- Renames old `agent.db` to `agent.db.migrated` backup

### index.ts (updated)
- `getStorage()` now accepts `cwd` parameter and uses directory-based storage
- New `getMemoryStorageDir(cwd)` function for JSON storage directory
- `getMemoryDir(cwd)` retained for output memory files (MEMORY.md, etc.)

### storage.test.ts (rewritten)
- Updated tests for JSON file storage behavior
- Added 9 new tests for concurrent job operations:
  - claimStage1Jobs correctly claims pending jobs
  - completeStage1Job stores output and marks thread done
  - failStage1Job marks thread as error
  - getStage1OutputsForCwd filters by cwd
  - clearAll removes all data
  - clearForCwd removes only data for specified cwd
  - resetAllForCwd resets threads to pending and creates new jobs
  - phase 2 job claim requires stage1 outputs
  - upsertThreads skips unchanged threads

## Verification
- Build passes: `npm run build`
- All 11 tests pass
- No sql.js imports in storage.ts or index.ts
- Same public API maintained

## File Structure
```
.gsd/memory/<encoded-cwd>/
├── jobs/
│   ├── {uuid}.json       # Job records
├── threads/
│   └── {thread-id}.json  # Thread records
└── stage1/
    └── {thread-id}.json  # Stage 1 extraction outputs
```

## Migration Path
1. Users with existing `agent.db` should run: `npx tsx .../migrate-from-sqlite.ts`
2. Migration creates JSON files and renames `agent.db` to `agent.db.migrated`
3. After migration, sql.js dependency can be removed from package.json
