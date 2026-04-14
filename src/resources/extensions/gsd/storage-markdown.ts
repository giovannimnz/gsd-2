/**
 * MarkdownStorage Implementation (STUB — Phase 1)
 * 
 * File-based storage backend that uses .md files instead of SQLite.
 * 
 * Phase 1: Stub implementation — methods throw "not implemented" errors.
 * Phase 2: Full implementation with JSON/MD file operations.
 * 
 * Goal: Run GSD-2 100% without SQLite when storage_backend: markdown.
 */

import type { StorageBackend, MilestoneRow, SliceRow, TaskRow, ArtifactRow, VerificationEvidenceRow, MilestonePlanningRecord, SlicePlanningRecord, TaskPlanningRecord } from "./storage-backend.js";
import type { Decision, Requirement, GateRow, GateId, GateScope, GateStatus, GateVerdict } from "./types.js";

export class MarkdownStorage implements StorageBackend {
  private _isOpen = false;
  private _path: string | null = null;
  private _openAttempted = false;

  // ── Lifecycle ──────────────────────────────────────────────────────────
  open(path: string): boolean {
    this._openAttempted = true;
    // Phase 1: Stub — accept any path, mark as open
    // Phase 2: Validate path, create directory structure, initialize .md files
    this._path = path;
    this._isOpen = true;
    return true;
  }

  close(): void {
    // Phase 1: No-op (no DB to close)
    this._isOpen = false;
  }

  isOpen(): boolean {
    return this._isOpen;
  }

  wasOpenAttempted(): boolean {
    return this._openAttempted;
  }

  // ── Low-level Operations (SQLite only — no-op for Markdown) ────────────
  exec(_sql: string): void {
    throw new Error("exec() not supported in MarkdownStorage. Implement in Phase 2.");
  }

  run(_sql: string, _params?: unknown[]): { changes: number; lastInsertRowid: number } {
    throw new Error("run() not supported in MarkdownStorage. Implement in Phase 2.");
  }

  query(_sql: string, _params?: unknown[]): Record<string, unknown>[] {
    throw new Error("query() not supported in MarkdownStorage. Implement in Phase 2.");
  }

  queryOne(_sql: string, _params?: unknown[]): Record<string, unknown> | undefined {
    throw new Error("queryOne() not supported in MarkdownStorage. Implement in Phase 2.");
  }

  transaction<T>(fn: () => T): T {
    // Phase 2: Implement file-based transaction (atomic directory rename)
    // Phase 1: Execute without transaction
    return fn();
  }

  vacuum(): void {
    // No-op — file-based storage doesn't need vacuuming
  }

  getPath(): string | null {
    return this._path;
  }

  getProvider(): string | null {
    return this._isOpen ? "markdown" : null;
  }

  // ── All entity operations — stub implementations (Phase 2 will implement) ──
  
  insertDecision(_d: Omit<Decision, "seq">): void {
    throw new Error("MarkdownStorage.insertDecision not implemented — Phase 2");
  }
  upsertDecision(_d: Omit<Decision, "seq">): void {
    throw new Error("MarkdownStorage.upsertDecision not implemented — Phase 2");
  }
  getDecisionById(_id: string): Decision | null {
    throw new Error("MarkdownStorage.getDecisionById not implemented — Phase 2");
  }
  getActiveDecisions(): Decision[] {
    throw new Error("MarkdownStorage.getActiveDecisions not implemented — Phase 2");
  }

  insertRequirement(_r: Requirement): void {
    throw new Error("MarkdownStorage.insertRequirement not implemented — Phase 2");
  }
  upsertRequirement(_r: Requirement): void {
    throw new Error("MarkdownStorage.upsertRequirement not implemented — Phase 2");
  }
  getRequirementById(_id: string): Requirement | null {
    throw new Error("MarkdownStorage.getRequirementById not implemented — Phase 2");
  }
  getActiveRequirements(): Requirement[] {
    throw new Error("MarkdownStorage.getActiveRequirements not implemented — Phase 2");
  }

  insertMilestone(_m: { id: string; title: string; status?: string; [key: string]: unknown }): void {
    throw new Error("MarkdownStorage.insertMilestone not implemented — Phase 2");
  }
  upsertMilestonePlanning(_milestoneId: string, _planning: Partial<MilestonePlanningRecord> & { title?: string; status?: string }): void {
    throw new Error("MarkdownStorage.upsertMilestonePlanning not implemented — Phase 2");
  }
  getAllMilestones(): MilestoneRow[] {
    throw new Error("MarkdownStorage.getAllMilestones not implemented — Phase 2");
  }
  getMilestone(_id: string): MilestoneRow | null {
    throw new Error("MarkdownStorage.getMilestone not implemented — Phase 2");
  }
  updateMilestoneStatus(_milestoneId: string, _status: string, _completedAt?: string | null): void {
    throw new Error("MarkdownStorage.updateMilestoneStatus not implemented — Phase 2");
  }
  getActiveMilestone(): MilestoneRow | null {
    throw new Error("MarkdownStorage.getActiveMilestone not implemented — Phase 2");
  }
  getActiveMilestoneId(): { id: string; status: string } | null {
    throw new Error("MarkdownStorage.getActiveMilestoneId not implemented — Phase 2");
  }
  deleteMilestone(_milestoneId: string): void {
    throw new Error("MarkdownStorage.deleteMilestone not implemented — Phase 2");
  }

  insertSlice(_s: { id: string; milestone_id: string; title: string; [key: string]: unknown }): void {
    throw new Error("MarkdownStorage.insertSlice not implemented — Phase 2");
  }
  upsertSlicePlanning(_milestoneId: string, _sliceId: string, _planning: Partial<SlicePlanningRecord>): void {
    throw new Error("MarkdownStorage.upsertSlicePlanning not implemented — Phase 2");
  }
  getSlice(_milestoneId: string, _sliceId: string): SliceRow | null {
    throw new Error("MarkdownStorage.getSlice not implemented — Phase 2");
  }
  updateSliceStatus(_milestoneId: string, _sliceId: string, _status: string, _completedAt?: string): void {
    throw new Error("MarkdownStorage.updateSliceStatus not implemented — Phase 2");
  }
  setSliceSummaryMd(_milestoneId: string, _sliceId: string, _summaryMd: string, _uatMd: string): void {
    throw new Error("MarkdownStorage.setSliceSummaryMd not implemented — Phase 2");
  }
  getMilestoneSlices(_milestoneId: string): SliceRow[] {
    throw new Error("MarkdownStorage.getMilestoneSlices not implemented — Phase 2");
  }
  getActiveSlice(_milestoneId: string): SliceRow | null {
    throw new Error("MarkdownStorage.getActiveSlice not implemented — Phase 2");
  }
  getSliceStatusSummary(_milestoneId: string): Array<{ id: string; status: string }> {
    throw new Error("MarkdownStorage.getSliceStatusSummary not implemented — Phase 2");
  }
  getSliceTaskCounts(_milestoneId: string, _sliceId: string): { total: number; done: number; pending: number } {
    throw new Error("MarkdownStorage.getSliceTaskCounts not implemented — Phase 2");
  }
  syncSliceDependencies(_milestoneId: string, _sliceId: string, _depends: string[]): void {
    throw new Error("MarkdownStorage.syncSliceDependencies not implemented — Phase 2");
  }
  getDependentSlices(_milestoneId: string, _sliceId: string): string[] {
    throw new Error("MarkdownStorage.getDependentSlices not implemented — Phase 2");
  }
  updateSliceFields(_milestoneId: string, _sliceId: string, _fields: { [key: string]: unknown }): void {
    throw new Error("MarkdownStorage.updateSliceFields not implemented — Phase 2");
  }
  deleteSlice(_milestoneId: string, _sliceId: string): void {
    throw new Error("MarkdownStorage.deleteSlice not implemented — Phase 2");
  }

  insertTask(_t: { id: string; milestone_id: string; slice_id: string; title: string; [key: string]: unknown }): void {
    throw new Error("MarkdownStorage.insertTask not implemented — Phase 2");
  }
  upsertTaskPlanning(_milestoneId: string, _sliceId: string, _taskId: string, _planning: Partial<TaskPlanningRecord>): void {
    throw new Error("MarkdownStorage.upsertTaskPlanning not implemented — Phase 2");
  }
  getTask(_milestoneId: string, _sliceId: string, _taskId: string): TaskRow | null {
    throw new Error("MarkdownStorage.getTask not implemented — Phase 2");
  }
  getSliceTasks(_milestoneId: string, _sliceId: string): TaskRow[] {
    throw new Error("MarkdownStorage.getSliceTasks not implemented — Phase 2");
  }
  getActiveTask(_milestoneId: string, _sliceId: string): TaskRow | null {
    throw new Error("MarkdownStorage.getActiveTask not implemented — Phase 2");
  }
  getActiveTaskId(_milestoneId: string, _sliceId: string): { id: string; status: string; title: string } | null {
    throw new Error("MarkdownStorage.getActiveTaskId not implemented — Phase 2");
  }
  updateTaskStatus(_milestoneId: string, _sliceId: string, _taskId: string, _status: string, _completedAt?: string): void {
    throw new Error("MarkdownStorage.updateTaskStatus not implemented — Phase 2");
  }
  setTaskBlockerDiscovered(_milestoneId: string, _sliceId: string, _taskId: string, _discovered: boolean): void {
    throw new Error("MarkdownStorage.setTaskBlockerDiscovered not implemented — Phase 2");
  }
  setTaskSummaryMd(_milestoneId: string, _sliceId: string, _taskId: string, _md: string): void {
    throw new Error("MarkdownStorage.setTaskSummaryMd not implemented — Phase 2");
  }
  deleteTask(_milestoneId: string, _sliceId: string, _taskId: string): void {
    throw new Error("MarkdownStorage.deleteTask not implemented — Phase 2");
  }

  clearArtifacts(): void {
    throw new Error("MarkdownStorage.clearArtifacts not implemented — Phase 2");
  }
  insertArtifact(_a: { path: string; type: string; created_at?: string }): void {
    throw new Error("MarkdownStorage.insertArtifact not implemented — Phase 2");
  }
  getArtifact(_path: string): ArtifactRow | null {
    throw new Error("MarkdownStorage.getArtifact not implemented — Phase 2");
  }

  insertVerificationEvidence(_e: { milestone_id: string; slice_id: string; task_id: string; evidence: string }): void {
    throw new Error("MarkdownStorage.insertVerificationEvidence not implemented — Phase 2");
  }
  getVerificationEvidence(_milestoneId: string, _sliceId: string, _taskId: string): VerificationEvidenceRow[] {
    throw new Error("MarkdownStorage.getVerificationEvidence not implemented — Phase 2");
  }
  deleteVerificationEvidence(_milestoneId: string, _sliceId: string, _taskId: string): void {
    throw new Error("MarkdownStorage.deleteVerificationEvidence not implemented — Phase 2");
  }

  insertReplanHistory(_entry: { milestone_id: string; slice_id: string; reason: string }): void {
    throw new Error("MarkdownStorage.insertReplanHistory not implemented — Phase 2");
  }
  getReplanHistory(_milestoneId: string, _sliceId?: string): Array<Record<string, unknown>> {
    throw new Error("MarkdownStorage.getReplanHistory not implemented — Phase 2");
  }

  insertAssessment(_entry: { path: string; milestone_id: string; scope: string; verdict: string; findings: string }): void {
    throw new Error("MarkdownStorage.insertAssessment not implemented — Phase 2");
  }
  deleteAssessmentByScope(_milestoneId: string, _scope: string): void {
    throw new Error("MarkdownStorage.deleteAssessmentByScope not implemented — Phase 2");
  }
  getAssessment(_path: string): Record<string, unknown> | null {
    throw new Error("MarkdownStorage.getAssessment not implemented — Phase 2");
  }

  insertGateRow(_g: { milestone_id: string; slice_id: string; gate_id: GateId; scope: GateScope; status: GateStatus }): void {
    throw new Error("MarkdownStorage.insertGateRow not implemented — Phase 2");
  }
  saveGateResult(_g: { milestone_id: string; slice_id: string; gate_id: GateId; scope: GateScope; verdict: GateVerdict; findings: string }): void {
    throw new Error("MarkdownStorage.saveGateResult not implemented — Phase 2");
  }
  getPendingGates(_milestoneId: string, _sliceId: string, _scope?: GateScope): GateRow[] {
    throw new Error("MarkdownStorage.getPendingGates not implemented — Phase 2");
  }
  getGateResults(_milestoneId: string, _sliceId: string, _scope?: GateScope): GateRow[] {
    throw new Error("MarkdownStorage.getGateResults not implemented — Phase 2");
  }
  markAllGatesOmitted(_milestoneId: string, _sliceId: string): void {
    throw new Error("MarkdownStorage.markAllGatesOmitted not implemented — Phase 2");
  }
  getPendingSliceGateCount(_milestoneId: string, _sliceId: string): number {
    throw new Error("MarkdownStorage.getPendingSliceGateCount not implemented — Phase 2");
  }
  getPendingGatesForTurn(_milestoneId: string, _sliceId: string, _turnIds: GateId[]): GateRow[] {
    throw new Error("MarkdownStorage.getPendingGatesForTurn not implemented — Phase 2");
  }
  getPendingGateCountForTurn(_milestoneId: string, _sliceId: string, _turnIds: GateId[]): number {
    throw new Error("MarkdownStorage.getPendingGateCountForTurn not implemented — Phase 2");
  }

  copyWorktreeDb(_srcDbPath: string, _destDbPath: string): boolean {
    throw new Error("MarkdownStorage.copyWorktreeDb not implemented — Phase 2");
  }
  reconcileWorktreeDb(_mainDbPath: string, _worktreeDbPath: string): { decisions: number; requirements: number; artifacts: number; milestones: number; slices: number; tasks: number; memories: number; verification_evidence: number; conflicts: unknown[] } {
    throw new Error("MarkdownStorage.reconcileWorktreeDb not implemented — Phase 2");
  }
}
