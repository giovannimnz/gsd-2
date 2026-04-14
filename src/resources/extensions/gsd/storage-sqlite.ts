/**
 * SQLiteStorage Implementation
 * 
 * Wraps the existing gsd-db.ts module as a StorageBackend implementation.
 * This is the default backend — all existing behavior is preserved.
 * 
 * All methods delegate to gsd-db.ts using exact parameter forwarding.
 * Type safety is enforced by gsd-db.ts at runtime.
 */

import * as gsdDb from "./gsd-db.js";
import type { StorageBackend } from "./storage-backend.js";
import type { Decision, Requirement, GateRow, GateId, GateScope, GateStatus, GateVerdict } from "./types.js";
import type { MilestoneRow, SliceRow, TaskRow, ArtifactRow, VerificationEvidenceRow, MilestonePlanningRecord, SlicePlanningRecord, TaskPlanningRecord } from "./gsd-db.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

function delegate<T extends AnyFn>(fn: T, ...args: Parameters<T>): ReturnType<T> {
  return fn(...args);
}

export class SQLiteStorage implements StorageBackend {
  open(path: string): boolean {
    return delegate(gsdDb.openDatabase, path);
  }

  close(): void {
    gsdDb.closeDatabase();
  }

  isOpen(): boolean {
    return gsdDb.isDbAvailable();
  }

  wasOpenAttempted(): boolean {
    return gsdDb.wasDbOpenAttempted();
  }

  exec(sql: string): void {
    gsdDb._getAdapter()?.exec(sql);
  }

  run(sql: string, params?: unknown[]): { changes: number; lastInsertRowid: number } {
    const result = gsdDb._getAdapter()?.prepare(sql).run(...(params ?? []));
    return {
      changes: (result as any)?.changes ?? 0,
      lastInsertRowid: (result as any)?.lastInsertRowid ?? 0,
    };
  }

  query(sql: string, params?: unknown[]): Record<string, unknown>[] {
    return gsdDb._getAdapter()?.prepare(sql).all(...(params ?? [])) ?? [];
  }

  queryOne(sql: string, params?: unknown[]): Record<string, unknown> | undefined {
    return gsdDb._getAdapter()?.prepare(sql).get(...(params ?? []));
  }

  transaction<T>(fn: () => T): T {
    return gsdDb.transaction(fn);
  }

  vacuum(): void {
    gsdDb.vacuumDatabase();
  }

  getPath(): string | null {
    return gsdDb.getDbPath();
  }

  getProvider(): string | null {
    return gsdDb.getDbProvider();
  }

  // ── Decisions ──────────────────────────────────────────────────────────
  insertDecision(d: Omit<Decision, "seq">): void {
    delegate(gsdDb.insertDecision, d);
  }
  upsertDecision(d: Omit<Decision, "seq">): void {
    delegate(gsdDb.upsertDecision, d);
  }
  getDecisionById(id: string): Decision | null {
    return delegate(gsdDb.getDecisionById, id);
  }
  getActiveDecisions(): Decision[] {
    return delegate(gsdDb.getActiveDecisions);
  }

  // ── Requirements ───────────────────────────────────────────────────────
  insertRequirement(r: Requirement): void {
    delegate(gsdDb.insertRequirement, r);
  }
  upsertRequirement(r: Requirement): void {
    delegate(gsdDb.upsertRequirement, r);
  }
  getRequirementById(id: string): Requirement | null {
    return delegate(gsdDb.getRequirementById, id);
  }
  getActiveRequirements(): Requirement[] {
    return delegate(gsdDb.getActiveRequirements);
  }

  // ── Milestones ─────────────────────────────────────────────────────────
  insertMilestone(m: Parameters<typeof gsdDb.insertMilestone>[0]): void {
    delegate(gsdDb.insertMilestone, m);
  }
  upsertMilestonePlanning(milestoneId: string, planning: Parameters<typeof gsdDb.upsertMilestonePlanning>[1]): void {
    delegate(gsdDb.upsertMilestonePlanning, milestoneId, planning);
  }
  getAllMilestones(): MilestoneRow[] {
    return delegate(gsdDb.getAllMilestones);
  }
  getMilestone(id: string): MilestoneRow | null {
    return delegate(gsdDb.getMilestone, id);
  }
  updateMilestoneStatus(milestoneId: string, status: string, completedAt?: string | null): void {
    delegate(gsdDb.updateMilestoneStatus, milestoneId, status, completedAt);
  }
  getActiveMilestone(): MilestoneRow | null {
    return delegate(gsdDb.getActiveMilestoneFromDb);
  }
  getActiveMilestoneId(): { id: string; status: string } | null {
    return delegate(gsdDb.getActiveMilestoneIdFromDb);
  }
  deleteMilestone(milestoneId: string): void {
    delegate(gsdDb.deleteMilestone, milestoneId);
  }

  // ── Slices ─────────────────────────────────────────────────────────────
  insertSlice(s: Parameters<typeof gsdDb.insertSlice>[0]): void {
    delegate(gsdDb.insertSlice, s);
  }
  upsertSlicePlanning(milestoneId: string, sliceId: string, planning: Parameters<typeof gsdDb.upsertSlicePlanning>[2]): void {
    delegate(gsdDb.upsertSlicePlanning, milestoneId, sliceId, planning);
  }
  getSlice(milestoneId: string, sliceId: string): SliceRow | null {
    return delegate(gsdDb.getSlice, milestoneId, sliceId);
  }
  updateSliceStatus(milestoneId: string, sliceId: string, status: string, completedAt?: string): void {
    delegate(gsdDb.updateSliceStatus, milestoneId, sliceId, status, completedAt);
  }
  setSliceSummaryMd(milestoneId: string, sliceId: string, summaryMd: string, uatMd: string): void {
    delegate(gsdDb.setSliceSummaryMd, milestoneId, sliceId, summaryMd, uatMd);
  }
  getMilestoneSlices(milestoneId: string): SliceRow[] {
    return delegate(gsdDb.getMilestoneSlices, milestoneId);
  }
  getActiveSlice(milestoneId: string): SliceRow | null {
    return delegate(gsdDb.getActiveSliceFromDb, milestoneId);
  }
  getSliceStatusSummary(milestoneId: string): Array<{ id: string; status: string }> {
    return delegate(gsdDb.getSliceStatusSummary, milestoneId);
  }
  getSliceTaskCounts(milestoneId: string, sliceId: string): { total: number; done: number; pending: number } {
    return delegate(gsdDb.getSliceTaskCounts, milestoneId, sliceId);
  }
  syncSliceDependencies(milestoneId: string, sliceId: string, depends: string[]): void {
    delegate(gsdDb.syncSliceDependencies, milestoneId, sliceId, depends);
  }
  getDependentSlices(milestoneId: string, sliceId: string): string[] {
    return delegate(gsdDb.getDependentSlices, milestoneId, sliceId);
  }
  updateSliceFields(milestoneId: string, sliceId: string, fields: Parameters<typeof gsdDb.updateSliceFields>[2]): void {
    delegate(gsdDb.updateSliceFields, milestoneId, sliceId, fields);
  }
  deleteSlice(milestoneId: string, sliceId: string): void {
    delegate(gsdDb.deleteSlice, milestoneId, sliceId);
  }

  // ── Tasks ──────────────────────────────────────────────────────────────
  insertTask(t: Parameters<typeof gsdDb.insertTask>[0]): void {
    delegate(gsdDb.insertTask, t);
  }
  upsertTaskPlanning(milestoneId: string, sliceId: string, taskId: string, planning: Parameters<typeof gsdDb.upsertTaskPlanning>[3]): void {
    delegate(gsdDb.upsertTaskPlanning, milestoneId, sliceId, taskId, planning);
  }
  getTask(milestoneId: string, sliceId: string, taskId: string): TaskRow | null {
    return delegate(gsdDb.getTask, milestoneId, sliceId, taskId);
  }
  getSliceTasks(milestoneId: string, sliceId: string): TaskRow[] {
    return delegate(gsdDb.getSliceTasks, milestoneId, sliceId);
  }
  getActiveTask(milestoneId: string, sliceId: string): TaskRow | null {
    return delegate(gsdDb.getActiveTaskFromDb, milestoneId, sliceId);
  }
  getActiveTaskId(milestoneId: string, sliceId: string): { id: string; status: string; title: string } | null {
    return delegate(gsdDb.getActiveTaskIdFromDb, milestoneId, sliceId);
  }
  updateTaskStatus(milestoneId: string, sliceId: string, taskId: string, status: string, completedAt?: string): void {
    delegate(gsdDb.updateTaskStatus, milestoneId, sliceId, taskId, status, completedAt);
  }
  setTaskBlockerDiscovered(milestoneId: string, sliceId: string, taskId: string, discovered: boolean): void {
    delegate(gsdDb.setTaskBlockerDiscovered, milestoneId, sliceId, taskId, discovered);
  }
  setTaskSummaryMd(milestoneId: string, sliceId: string, taskId: string, md: string): void {
    delegate(gsdDb.setTaskSummaryMd, milestoneId, sliceId, taskId, md);
  }
  deleteTask(milestoneId: string, sliceId: string, taskId: string): void {
    delegate(gsdDb.deleteTask, milestoneId, sliceId, taskId);
  }

  // ── Artifacts ──────────────────────────────────────────────────────────
  clearArtifacts(): void {
    gsdDb.clearArtifacts();
  }
  insertArtifact(a: Parameters<typeof gsdDb.insertArtifact>[0]): void {
    delegate(gsdDb.insertArtifact, a);
  }
  getArtifact(path: string): ArtifactRow | null {
    return delegate(gsdDb.getArtifact, path);
  }

  // ── Verification Evidence ──────────────────────────────────────────────
  insertVerificationEvidence(e: Parameters<typeof gsdDb.insertVerificationEvidence>[0]): void {
    delegate(gsdDb.insertVerificationEvidence, e);
  }
  getVerificationEvidence(milestoneId: string, sliceId: string, taskId: string): VerificationEvidenceRow[] {
    return delegate(gsdDb.getVerificationEvidence, milestoneId, sliceId, taskId);
  }
  deleteVerificationEvidence(milestoneId: string, sliceId: string, taskId: string): void {
    delegate(gsdDb.deleteVerificationEvidence, milestoneId, sliceId, taskId);
  }

  // ── Replan History ─────────────────────────────────────────────────────
  insertReplanHistory(entry: Parameters<typeof gsdDb.insertReplanHistory>[0]): void {
    delegate(gsdDb.insertReplanHistory, entry);
  }
  getReplanHistory(milestoneId: string, sliceId?: string): Array<Record<string, unknown>> {
    return delegate(gsdDb.getReplanHistory, milestoneId, sliceId);
  }

  // ── Assessment ─────────────────────────────────────────────────────────
  insertAssessment(entry: Parameters<typeof gsdDb.insertAssessment>[0]): void {
    delegate(gsdDb.insertAssessment, entry);
  }
  deleteAssessmentByScope(milestoneId: string, scope: string): void {
    delegate(gsdDb.deleteAssessmentByScope, milestoneId, scope);
  }
  getAssessment(path: string): Record<string, unknown> | null {
    return delegate(gsdDb.getAssessment, path);
  }

  // ── Gates ──────────────────────────────────────────────────────────────
  insertGateRow(g: Parameters<typeof gsdDb.insertGateRow>[0]): void {
    delegate(gsdDb.insertGateRow, g);
  }
  saveGateResult(g: Parameters<typeof gsdDb.saveGateResult>[0]): void {
    delegate(gsdDb.saveGateResult, g);
  }
  getPendingGates(milestoneId: string, sliceId: string, scope?: GateScope): GateRow[] {
    return delegate(gsdDb.getPendingGates, milestoneId, sliceId, scope);
  }
  getGateResults(milestoneId: string, sliceId: string, scope?: GateScope): GateRow[] {
    return delegate(gsdDb.getGateResults, milestoneId, sliceId, scope);
  }
  markAllGatesOmitted(milestoneId: string, sliceId: string): void {
    delegate(gsdDb.markAllGatesOmitted, milestoneId, sliceId);
  }
  getPendingSliceGateCount(milestoneId: string, sliceId: string): number {
    return delegate(gsdDb.getPendingSliceGateCount, milestoneId, sliceId);
  }
  getPendingGatesForTurn(milestoneId: string, sliceId: string, turnIds: GateId[]): GateRow[] {
    const turn = { ids: turnIds } as unknown as Parameters<typeof gsdDb.getPendingGatesForTurn>[2];
    return delegate(gsdDb.getPendingGatesForTurn, milestoneId, sliceId, turn);
  }
  getPendingGateCountForTurn(milestoneId: string, sliceId: string, turnIds: GateId[]): number {
    const turn = { ids: turnIds } as unknown as Parameters<typeof gsdDb.getPendingGateCountForTurn>[2];
    return delegate(gsdDb.getPendingGateCountForTurn, milestoneId, sliceId, turn);
  }

  // ── Worktree Operations ────────────────────────────────────────────────
  copyWorktreeDb(srcDbPath: string, destDbPath: string): boolean {
    return delegate(gsdDb.copyWorktreeDb, srcDbPath, destDbPath);
  }
  reconcileWorktreeDb(mainDbPath: string, worktreeDbPath: string): ReturnType<typeof gsdDb.reconcileWorktreeDb> {
    return delegate(gsdDb.reconcileWorktreeDb, mainDbPath, worktreeDbPath);
  }
}
