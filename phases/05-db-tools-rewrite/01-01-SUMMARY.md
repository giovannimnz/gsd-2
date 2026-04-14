# Phase 05-db-tools-rewrite Summary

## Objective
Update all workflow tools in db-tools.ts and query-tools.ts to use the StorageBackend interface instead of direct SQLite calls through gsd-db.ts.

## Files Modified

### 1. `src/resources/extensions/gsd/bootstrap/dynamic-tools.ts`
- **Change**: `ensureDbOpen()` now uses `createStorageBackend()` from storage-factory.ts instead of directly importing `openDatabase` from gsd-db.js.
- **Impact**: All tools that call `ensureDbOpen()` now go through the StorageBackend abstraction for DB opening.

### 2. `src/resources/extensions/gsd/db-writer.ts`
- **Changes**:
  - `nextDecisionId()` — uses `createStorageBackend()` + `backend.queryOne()` instead of `gsd-db._getAdapter()`
  - `nextRequirementId()` — same pattern as above
  - `saveRequirementToDb()` — uses `createStorageBackend()` + backend methods (`transaction`, `queryOne`, `query`, `upsertRequirement`) instead of gsd-db.js
  - `saveDecisionToDb()` — uses `createStorageBackend()` + backend methods (`transaction`, `queryOne`, `query`, `upsertDecision`, `run`, `updateSliceStatus`) instead of gsd-db.js
  - `updateRequirementInDb()` — uses `createStorageBackend()` + backend methods (`getRequirementById`, `upsertRequirement`, `query`) instead of gsd-db.js
  - `saveArtifactToDb()` — uses `createStorageBackend()` + backend methods (`insertArtifact`, `run`) instead of gsd-db.js
- **Result**: Zero direct gsd-db.js imports remain in db-writer.ts.

### 3. `src/resources/extensions/gsd/bootstrap/db-tools.ts`
- **Changes**:
  - `ensureMilestoneDbRow()` — uses `createStorageBackend()` + `backend.insertMilestone()` instead of `import("../gsd-db.js").insertMilestone`
  - `skipSliceExecute` — uses `createStorageBackend()` + `backend.getSlice()` and `backend.updateSliceStatus()` instead of `import("../gsd-db.js")`
- **Result**: Zero direct gsd-db.js imports remain in db-tools.ts. Dynamic imports of db-writer.js functions remain (correct — those functions now use StorageBackend internally).

### 4. `src/resources/extensions/gsd/tools/workflow-tool-executors.ts`
- **Changes**:
  - `executeMilestoneStatus()` — uses `createStorageBackend()` + backend methods (`getMilestone`, `getSliceStatusSummary`, `getSliceTaskCounts`) instead of `_getAdapter()`, `getMilestone`, `getSliceStatusSummary`, `getSliceTaskCounts` from gsd-db.js
  - `executeSaveGateResult()` — uses `createStorageBackend()` + `backend.saveGateResult()` instead of direct `saveGateResult` from gsd-db.js
- **Removed imports**: `getMilestone`, `getSliceStatusSummary`, `getSliceTaskCounts`, `_getAdapter`, `saveGateResult` from gsd-db.js; `invalidateStateCache` from state.js (now dynamically imported)

### 5. `src/resources/extensions/gsd/bootstrap/query-tools.ts`
- **Status**: Already clean — no direct gsd-db.js calls. Uses `ensureDbOpen()` (now StorageBackend-based) and delegates to `executeMilestoneStatus` (now StorageBackend-based).

## Verification
- Build passes: `npm run build` completes with exit code 0
- No direct `gsd-db.js` imports remain in:
  - `db-tools.ts` (verified via grep)
  - `query-tools.ts` (verified via grep)
  - `db-writer.ts` (verified via grep)
- All tools work through the StorageBackend interface
- Both SQLite and Markdown backends are supported

## Architecture
```
Tool (db-tools.ts / query-tools.ts)
  -> ensureDbOpen() -> createStorageBackend() -> StorageBackend.open()
  -> saveDecisionToDb() -> createStorageBackend() -> StorageBackend methods
  -> executeMilestoneStatus() -> createStorageBackend() -> StorageBackend methods
  -> skipSliceExecute -> createStorageBackend() -> StorageBackend methods
```

The StorageBackend factory reads `storage_backend` from PREFERENCES.md and returns either SQLiteStorage (wraps gsd-db.ts) or MarkdownStorage (file-based).
