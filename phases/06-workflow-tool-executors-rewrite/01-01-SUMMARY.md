# Phase 6 Summary: Graceful Fallback When Storage Unavailable

## Objective
Update workflow-tool-executors.ts and dynamic-tools.ts to use StorageBackend and provide graceful fallback when storage is unavailable.

## Changes Made

### 1. dynamic-tools.ts
- Added `_storageBackend` module-level variable to track the initialized backend
- Updated `ensureDbOpen()` to set `_storageBackend` when backend is successfully opened (all code paths)
- Added `isStorageAvailable()` function that checks if backend is initialized AND open (works for both SQLite and Markdown backends)
- Added `getStorageBackend()` function to retrieve the current backend instance

### 2. workflow-tool-executors.ts
- Updated import to include `isStorageAvailable` from dynamic-tools.ts
- Added `STORAGE_UNAVAILABLE_MSG` constant with informative message mentioning `storage_backend` config option
- Updated all 11 tool executors to:
  - Log a warning via `logWarning()` when storage is unavailable
  - Return informative error message mentioning `storage_backend` config
  - Use consistent error key `"storage_unavailable"` instead of `"db_unavailable"`

### Tool executors updated:
1. `executeSummarySave`
2. `executeTaskComplete`
3. `executeSliceComplete`
4. `executeCompleteMilestone`
5. `executeValidateMilestone`
6. `executeReassessRoadmap`
7. `executeSaveGateResult`
8. `executePlanMilestone`
9. `executePlanSlice`
10. `executeReplanSlice`
11. `executeMilestoneStatus`

## Verification
- [x] ensureDbOpen initializes correct backend based on config
- [x] isStorageAvailable works for both backends
- [x] All tool executors handle storage unavailability
- [x] Error messages mention storage_backend config option
- [x] Build passes (`npm run build`)

## Key Pattern Implemented
```typescript
// In dynamic-tools.ts:
export function isStorageAvailable(): boolean {
  return _storageBackend !== null && _storageBackend.isOpen();
}

// In workflow-tool-executors.ts:
const dbAvailable = await ensureDbOpen(basePath);
if (!dbAvailable) {
  logWarning("tool", "executeXxx: storage unavailable");
  return {
    content: [{ type: "text", text: `Warning: Storage is not available. ${STORAGE_UNAVAILABLE_MSG} ...` }],
    details: { operation: "xxx", error: "storage_unavailable" },
    isError: true,
  };
}
```
