/**
 * StorageBackend Interface
 * 
 * Abstract storage interface for GSD persistence layer.
 * Covers all current gsd-db.ts operations, implemented by:
 *   - SQLiteStorage: wraps existing gsd-db.ts (current behavior)
 *   - MarkdownStorage: file-based storage (stub in Phase 1)
 * 
 * Configured via PREFERENCES.md: storage_backend: "sqlite" | "markdown"
 */

import type { Decision, Requirement, GateRow, GateId, GateScope, GateStatus, GateVerdict } from "./types.js";
import type { MilestoneRow, SliceRow, TaskRow, ArtifactRow, VerificationEvidenceRow, MilestonePlanningRecord, SlicePlanningRecord, TaskPlanningRecord } from "./gsd-db.js";

// Re-export for convenience of consumers
export {
  type Decision,
  type Requirement,
  type GateRow,
  type GateId,
  type GateScope,
  type GateStatus,
  type GateVerdict,
} from "./types.js";
export type {
  MilestoneRow,
  SliceRow,
  TaskRow,
  ArtifactRow,
  VerificationEvidenceRow,
  MilestonePlanningRecord,
  SlicePlanningRecord,
  TaskPlanningRecord,
} from "./gsd-db.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyParam = any;

/**
 * Abstract storage backend for GSD persistence.
 */
export interface StorageBackend {
  // ── Lifecycle ──────────────────────────────────────────────────────────
  open(path: string): boolean;
  close(): void;
  isOpen(): boolean;
  wasOpenAttempted(): boolean;
  exec(sql: string): void;
  run(sql: string, params?: unknown[]): { changes: number; lastInsertRowid: number };
  query(sql: string, params?: unknown[]): Record<string, unknown>[];
  queryOne(sql: string, params?: unknown[]): Record<string, unknown> | undefined;
  transaction<T>(fn: () => T): T;
  vacuum(): void;
  getPath(): string | null;
  getProvider(): string | null;

  // ── Decisions ──────────────────────────────────────────────────────────
  insertDecision(d: Omit<Decision, "seq">): void;
  upsertDecision(d: Omit<Decision, "seq">): void;
  getDecisionById(id: string): Decision | null;
  getActiveDecisions(): Decision[];

  // ── Requirements ───────────────────────────────────────────────────────
  insertRequirement(r: Requirement): void;
  upsertRequirement(r: Requirement): void;
  getRequirementById(id: string): Requirement | null;
  getActiveRequirements(): Requirement[];

  // ── Milestones ─────────────────────────────────────────────────────────
  insertMilestone(m: AnyParam): void;
  upsertMilestonePlanning(milestoneId: string, planning: AnyParam): void;
  getAllMilestones(): MilestoneRow[];
  getMilestone(id: string): MilestoneRow | null;
  updateMilestoneStatus(milestoneId: string, status: string, completedAt?: string | null): void;
  getActiveMilestone(): MilestoneRow | null;
  getActiveMilestoneId(): { id: string; status: string } | null;
  deleteMilestone(milestoneId: string): void;

  // ── Slices ─────────────────────────────────────────────────────────────
  insertSlice(s: AnyParam): void;
  upsertSlicePlanning(milestoneId: string, sliceId: string, planning: AnyParam): void;
  getSlice(milestoneId: string, sliceId: string): SliceRow | null;
  updateSliceStatus(milestoneId: string, sliceId: string, status: string, completedAt?: string): void;
  setSliceSummaryMd(milestoneId: string, sliceId: string, summaryMd: string, uatMd: string): void;
  getMilestoneSlices(milestoneId: string): SliceRow[];
  getActiveSlice(milestoneId: string): SliceRow | null;
  getSliceStatusSummary(milestoneId: string): Array<{ id: string; status: string }>;
  getSliceTaskCounts(milestoneId: string, sliceId: string): { total: number; done: number; pending: number };
  syncSliceDependencies(milestoneId: string, sliceId: string, depends: string[]): void;
  getDependentSlices(milestoneId: string, sliceId: string): string[];
  updateSliceFields(milestoneId: string, sliceId: string, fields: AnyParam): void;
  deleteSlice(milestoneId: string, sliceId: string): void;

  // ── Tasks ──────────────────────────────────────────────────────────────
  insertTask(t: AnyParam): void;
  upsertTaskPlanning(milestoneId: string, sliceId: string, taskId: string, planning: AnyParam): void;
  getTask(milestoneId: string, sliceId: string, taskId: string): TaskRow | null;
  getSliceTasks(milestoneId: string, sliceId: string): TaskRow[];
  getActiveTask(milestoneId: string, sliceId: string): TaskRow | null;
  getActiveTaskId(milestoneId: string, sliceId: string): { id: string; status: string; title: string } | null;
  updateTaskStatus(milestoneId: string, sliceId: string, taskId: string, status: string, completedAt?: string): void;
  setTaskBlockerDiscovered(milestoneId: string, sliceId: string, taskId: string, discovered: boolean): void;
  setTaskSummaryMd(milestoneId: string, sliceId: string, taskId: string, md: string): void;
  deleteTask(milestoneId: string, sliceId: string, taskId: string): void;

  // ── Artifacts ──────────────────────────────────────────────────────────
  clearArtifacts(): void;
  insertArtifact(a: AnyParam): void;
  getArtifact(path: string): ArtifactRow | null;

  // ── Verification Evidence ──────────────────────────────────────────────
  insertVerificationEvidence(e: AnyParam): void;
  getVerificationEvidence(milestoneId: string, sliceId: string, taskId: string): VerificationEvidenceRow[];
  deleteVerificationEvidence(milestoneId: string, sliceId: string, taskId: string): void;

  // ── Replan History ─────────────────────────────────────────────────────
  insertReplanHistory(entry: AnyParam): void;
  getReplanHistory(milestoneId: string, sliceId?: string): Array<Record<string, unknown>>;

  // ── Assessment ─────────────────────────────────────────────────────────
  insertAssessment(entry: AnyParam): void;
  deleteAssessmentByScope(milestoneId: string, scope: string): void;
  getAssessment(path: string): Record<string, unknown> | null;

  // ── Gates ──────────────────────────────────────────────────────────────
  insertGateRow(g: AnyParam): void;
  saveGateResult(g: AnyParam): void;
  getPendingGates(milestoneId: string, sliceId: string, scope?: GateScope): GateRow[];
  getGateResults(milestoneId: string, sliceId: string, scope?: GateScope): GateRow[];
  markAllGatesOmitted(milestoneId: string, sliceId: string): void;
  getPendingSliceGateCount(milestoneId: string, sliceId: string): number;
  getPendingGatesForTurn(milestoneId: string, sliceId: string, turn: AnyParam): GateRow[];
  getPendingGateCountForTurn(milestoneId: string, sliceId: string, turn: AnyParam): number;

  // ── Worktree Operations ────────────────────────────────────────────────
  copyWorktreeDb(srcDbPath: string, destDbPath: string): boolean;
  reconcileWorktreeDb(mainDbPath: string, worktreeDbPath: string): { decisions: number; requirements: number; artifacts: number; milestones: number; slices: number; tasks: number; memories: number; verification_evidence: number; conflicts: unknown[] };
}

/** Backend type enum. */
export type BackendType = "sqlite" | "markdown";
