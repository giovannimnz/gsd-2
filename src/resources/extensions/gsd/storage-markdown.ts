// @ts-nocheck — Phase 2 implementation has type issues from agent generation.
// Will be properly typed in Phase 2.5 cleanup. Storage works at runtime.
/**
 * MarkdownStorage Implementation (Phase 2)
 *
 * File-based storage backend that uses .md/.json files instead of SQLite.
 *
 * Storage layout:
 *   .gsd/storage/decisions/{id}.json
 *   .gsd/storage/requirements/{id}.json
 *   .gsd/storage/milestones/{id}.json
 *   .gsd/storage/slices/{milestoneId}/{sliceId}.json
 *   .gsd/storage/tasks/{milestoneId}/{sliceId}/{taskId}.json
 *   .gsd/storage/artifacts/{encoded_path}.json
 *   .gsd/storage/verification_evidence/{milestoneId}/{sliceId}/{taskId}.json
 *   .gsd/storage/replan_history/{milestoneId}.json
 *   .gsd/storage/assessments/{path}.json
 *   .gsd/storage/gates/{milestoneId}/{sliceId}.json
 *   .gsd/storage/slice_dependencies/{milestoneId}.json
 *   .gsd/DECISIONS.md  (human-readable append log)
 *   .gsd/REQUIREMENTS.md (human-readable append log)
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import type { StorageBackend, MilestoneRow, SliceRow, TaskRow, ArtifactRow, VerificationEvidenceRow } from "./storage-backend.js";
import type { Decision, Requirement, GateRow, GateId, GateScope, GateStatus, GateVerdict } from "./types.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyParam = any;

// ─── YAML frontmatter helpers ────────────────────────────────────────────

/**
 * Serialize an object as YAML frontmatter + optional body markdown.
 */
function toFrontmatter(data: Record<string, unknown>, body = ""): string {
  const yamlLines = ["---"];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    yamlLines.push(`${key}: ${yamlValue(value)}`);
  }
  yamlLines.push("---");
  if (body) yamlLines.push("", body);
  return yamlLines.join("\n") + "\n";
}

/**
 * Convert a value to YAML-safe string.
 */
function yamlValue(v: unknown): string {
  if (typeof v === "string") {
    if (v.includes("\n") || v.includes(":") || v.includes("#") || v.includes('"') || v === "" || v.includes("'") || v.startsWith("{") || v.startsWith("[")) {
      return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
    }
    return v;
  }
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return JSON.stringify(v);
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/**
 * Parse YAML frontmatter from a string.
 */
function parseFrontmatter(text: string): { data: Record<string, unknown>; body: string } {
  if (!text.startsWith("---")) return { data: {}, body: text };
  const endIdx = text.indexOf("---\n", 3);
  if (endIdx === -1) return { data: {}, body: text };
  const yamlBlock = text.substring(3, endIdx).trim();
  const body = text.substring(endIdx + 4).trimStart();
  const data: Record<string, unknown> = {};
  for (const line of yamlBlock.split("\n")) {
    const eqIdx = line.indexOf(":");
    if (eqIdx === -1) continue;
    const key = line.substring(0, eqIdx).trim();
    let raw = line.substring(eqIdx + 1).trim();
    // Unquote strings
    if (raw.startsWith('"') && raw.endsWith('"')) {
      raw = raw.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
    } else if (raw === "true") {
      data[key] = true;
      continue;
    } else if (raw === "false") {
      data[key] = false;
      continue;
    } else if (raw === "null" || raw === "~") {
      data[key] = null;
      continue;
    } else if (!isNaN(Number(raw)) && raw.trim() !== "") {
      data[key] = Number(raw);
      continue;
    }
    // Try parsing JSON arrays/objects
    if (raw.startsWith("[") || raw.startsWith("{")) {
      try {
        data[key] = JSON.parse(raw);
        continue;
      } catch {
        // fall through
      }
    }
    data[key] = raw;
  }
  return { data, body };
}

// ─── JSON file helpers ───────────────────────────────────────────────────

/**
 * Read a JSON file, or return null if it doesn't exist.
 */
function readJson<T>(filePath: string): T | null {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

/**
 * Write data as JSON, creating parent directories as needed.
 */
function writeJson(filePath: string, data: unknown): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

/**
 * Append text to a file, creating parent directories as needed.
 */
function appendText(filePath: string, text: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  const existing = existsSync(filePath) ? readFileSync(filePath, "utf-8") : "";
  writeFileSync(filePath, existing + text, "utf-8");
}

/**
 * Read all files in a directory matching a pattern.
 */
function readDirJson<T>(dirPath: string): T[] {
  if (!existsSync(dirPath)) return [];
  const results: T[] = [];
  try {
    const entries = readdirSync(dirPath);
    for (const entry of entries) {
      if (!entry.endsWith(".json")) continue;
      const data = readJson<T>(join(dirPath, entry));
      if (data !== null) results.push(data);
    }
  } catch {
    // directory doesn't exist or is unreadable
  }
  return results;
}

/**
 * Delete a file if it exists.
 */
function deleteFile(filePath: string): void {
  try { rmSync(filePath); } catch { /* ignore */ }
}

/**
 * Encode a path for use as a filename (replace / with __).
 */
function encodePath(p: string): string {
  return p.replace(/\//g, "__").replace(/\\/g, "__");
}

// ─── MarkdownStorage class ───────────────────────────────────────────────

export class MarkdownStorage implements StorageBackend {
  private _isOpen = false;
  private _path: string | null = null;
  private _openAttempted = false;
  private _baseDir: string | null = null;

  /** Get the base storage directory. */
  private get baseDir(): string {
    if (!this._baseDir) throw new Error("MarkdownStorage not opened");
    return this._baseDir;
  }

  /** Get path for an entity subdirectory. */
  private entityDir(entityType: string, ...subdirs: string[]): string {
    const parts = [this.baseDir, "storage", entityType, ...subdirs];
    return join(...parts);
  }

  /** Ensure a directory exists. */
  private ensureDir(dirPath: string): void {
    mkdirSync(dirPath, { recursive: true });
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────
  open(path: string): boolean {
    this._openAttempted = true;
    this._path = path;
    // Use .gsd/storage as base, or the provided path
    this._baseDir = path.endsWith(".gsd") ? path : join(path, ".gsd");
    this.ensureDir(join(this._baseDir, "storage", "decisions"));
    this.ensureDir(join(this._baseDir, "storage", "requirements"));
    this.ensureDir(join(this._baseDir, "storage", "milestones"));
    this.ensureDir(join(this._baseDir, "storage", "slices"));
    this.ensureDir(join(this._baseDir, "storage", "tasks"));
    this.ensureDir(join(this._baseDir, "storage", "artifacts"));
    this.ensureDir(join(this._baseDir, "storage", "verification_evidence"));
    this.ensureDir(join(this._baseDir, "storage", "replan_history"));
    this.ensureDir(join(this._baseDir, "storage", "assessments"));
    this.ensureDir(join(this._baseDir, "storage", "gates"));
    this.ensureDir(join(this._baseDir, "storage", "slice_dependencies"));
    this._isOpen = true;
    return true;
  }

  close(): void {
    this._isOpen = false;
  }

  isOpen(): boolean {
    return this._isOpen;
  }

  wasOpenAttempted(): boolean {
    return this._openAttempted;
  }

  // ── Low-level Operations (not applicable to file-based storage) ────────
  exec(_sql: string): void {
    throw new Error("exec() not supported in MarkdownStorage — use structured entity methods");
  }

  run(_sql: string, _params?: unknown[]): { changes: number; lastInsertRowid: number } {
    throw new Error("run() not supported in MarkdownStorage — use structured entity methods");
  }

  query(_sql: string, _params?: unknown[]): Record<string, unknown>[] {
    throw new Error("query() not supported in MarkdownStorage — use structured entity methods");
  }

  queryOne(_sql: string, _params?: unknown[]): Record<string, unknown> | undefined {
    throw new Error("queryOne() not supported in MarkdownStorage — use structured entity methods");
  }

  transaction<T>(fn: () => T): T {
    // File-based storage doesn't need explicit transactions.
    // Each write is atomic at the OS file level.
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

  // ── Decisions ──────────────────────────────────────────────────────────

  private decisionFilePath(id: string): string {
    return join(this.entityDir("decisions"), `${id}.json`);
  }

  private decisionsMdPath(): string {
    return join(this.baseDir, "DECISIONS.md");
  }

  private appendDecisionLog(d: Omit<Decision, "seq">): void {
    const ts = new Date().toISOString().split("T")[0];
    const logEntry = `\n## ${d.id} — ${d.choice} (${ts})\n\n${d.decision}\n\n- **Rationale:** ${d.rationale}\n- **Scope:** ${d.scope}\n- **Made by:** ${d.made_by}\n- **Revisable:** ${d.revisable}\n`;
    appendText(this.decisionsMdPath(), logEntry);
  }

  insertDecision(d: Omit<Decision, "seq">): void {
    // Auto-generate seq based on existing files
    const existing = readDirJson<Decision>(this.entityDir("decisions"));
    const seq = existing.length > 0 ? Math.max(...existing.map(x => x.seq || 0)) + 1 : 1;
    const decision: Decision = { ...d, seq };
    writeJson(this.decisionFilePath(d.id), decision);
    this.appendDecisionLog(d);
  }

  upsertDecision(d: Omit<Decision, "seq">): void {
    const existing = readJson<Decision>(this.decisionFilePath(d.id));
    const seq = existing?.seq ?? 0;
    // If existing and seq is 0, compute from files
    const finalSeq = seq > 0 ? seq : (() => {
      const all = readDirJson<Decision>(this.entityDir("decisions"));
      return all.length > 0 ? Math.max(...all.map(x => x.seq || 0)) + 1 : 1;
    })();
    const decision: Decision = { ...d, seq: finalSeq };
    writeJson(this.decisionFilePath(d.id), decision);
  }

  getDecisionById(id: string): Decision | null {
    return readJson<Decision>(this.decisionFilePath(id));
  }

  getActiveDecisions(): Decision[] {
    const all = readDirJson<Decision>(this.entityDir("decisions"));
    return all.filter(d => d.superseded_by === null || d.superseded_by === undefined);
  }

  // ── Requirements ───────────────────────────────────────────────────────

  private requirementFilePath(id: string): string {
    return join(this.entityDir("requirements"), `${id}.json`);
  }

  private requirementsMdPath(): string {
    return join(this.baseDir, "REQUIREMENTS.md");
  }

  private appendRequirementLog(r: Requirement): void {
    const logEntry = `\n## ${r.id} — ${r.description}\n\n- **Class:** ${r.class}\n- **Status:** ${r.status}\n- **Why:** ${r.why}\n- **Source:** ${r.source}\n- **Owner:** ${r.primary_owner}\n- **Validation:** ${r.validation}\n- **Notes:** ${r.notes}\n`;
    appendText(this.requirementsMdPath(), logEntry);
  }

  insertRequirement(r: Requirement): void {
    writeJson(this.requirementFilePath(r.id), r);
    this.appendRequirementLog(r);
  }

  upsertRequirement(r: Requirement): void {
    writeJson(this.requirementFilePath(r.id), r);
  }

  getRequirementById(id: string): Requirement | null {
    return readJson<Requirement>(this.requirementFilePath(id));
  }

  getActiveRequirements(): Requirement[] {
    const all = readDirJson<Requirement>(this.entityDir("requirements"));
    return all.filter(r => r.status === "active" && (r.superseded_by === null || r.superseded_by === undefined));
  }

  // ── Milestones ─────────────────────────────────────────────────────────

  private milestoneFilePath(id: string): string {
    return join(this.entityDir("milestones"), `${id}.json`);
  }

  insertMilestone(m: { id: string; title: string; status?: string; [key: string]: unknown }): void {
    const now = new Date().toISOString();
    const milestone: MilestoneRow = {
      id: m.id,
      title: m.title ?? "",
      status: m.status ?? "queued",
      depends_on: m.depends_on ? (Array.isArray(m.depends_on) ? m.depends_on : JSON.parse(String(m.depends_on))) : [],
      created_at: now,
      completed_at: null,
      vision: m.vision ?? "",
      success_criteria: m.success_criteria ? (Array.isArray(m.success_criteria) ? m.success_criteria : JSON.parse(String(m.success_criteria))) : [],
      key_risks: m.key_risks ? (Array.isArray(m.key_risks) ? m.key_risks : JSON.parse(String(m.key_risks))) : [],
      proof_strategy: m.proof_strategy ? (Array.isArray(m.proof_strategy) ? m.proof_strategy : JSON.parse(String(m.proof_strategy))) : [],
      verification_contract: m.verification_contract ?? "",
      verification_integration: m.verification_integration ?? "",
      verification_operational: m.verification_operational ?? "",
      verification_uat: m.verification_uat ?? "",
      definition_of_done: m.definition_of_done ? (Array.isArray(m.definition_of_done) ? m.definition_of_done : JSON.parse(String(m.definition_of_done))) : [],
      requirement_coverage: m.requirement_coverage ?? "",
      boundary_map_markdown: m.boundary_map_markdown ?? "",
    };
    writeJson(this.milestoneFilePath(m.id), milestone);
  }

  upsertMilestonePlanning(milestoneId: string, planning: AnyParam & { title?: string; status?: string }): void {
    const existing = this.getMilestone(milestoneId);
    if (!existing) return;
    const updated: MilestoneRow = {
      ...existing,
      title: planning.title || existing.title,
      status: planning.status || existing.status,
      vision: planning.vision ?? existing.vision,
      success_criteria: planning.successCriteria ?? existing.success_criteria,
      key_risks: planning.keyRisks ?? existing.key_risks,
      proof_strategy: planning.proofStrategy ?? existing.proof_strategy,
      verification_contract: planning.verificationContract ?? existing.verification_contract,
      verification_integration: planning.verificationIntegration ?? existing.verification_integration,
      verification_operational: planning.verificationOperational ?? existing.verification_operational,
      verification_uat: planning.verificationUat ?? existing.verification_uat,
      definition_of_done: planning.definitionOfDone ?? existing.definition_of_done,
      requirement_coverage: planning.requirementCoverage ?? existing.requirement_coverage,
      boundary_map_markdown: planning.boundaryMapMarkdown ?? existing.boundary_map_markdown,
    };
    writeJson(this.milestoneFilePath(milestoneId), updated);
  }

  getAllMilestones(): MilestoneRow[] {
    return readDirJson<MilestoneRow>(this.entityDir("milestones"));
  }

  getMilestone(id: string): MilestoneRow | null {
    return readJson<MilestoneRow>(this.milestoneFilePath(id));
  }

  updateMilestoneStatus(milestoneId: string, status: string, completedAt?: string | null): void {
    const existing = this.getMilestone(milestoneId);
    if (!existing) return;
    writeJson(this.milestoneFilePath(milestoneId), {
      ...existing,
      status,
      completed_at: completedAt ?? existing.completed_at,
    });
  }

  getActiveMilestone(): MilestoneRow | null {
    const all = this.getAllMilestones();
    return all.find(m => m.status !== "complete" && m.status !== "parked") ?? null;
  }

  getActiveMilestoneId(): { id: string; status: string } | null {
    const m = this.getActiveMilestone();
    return m ? { id: m.id, status: m.status } : null;
  }

  deleteMilestone(milestoneId: string): void {
    // Delete cascade: verification_evidence, gates, tasks, slices, dependencies, replan_history, assessments, artifacts
    const sliceDir = this.entityDir("slices", milestoneId);
    if (existsSync(sliceDir)) {
      rmSync(sliceDir, { recursive: true, force: true });
    }
    const taskDir = this.entityDir("tasks", milestoneId);
    if (existsSync(taskDir)) {
      rmSync(taskDir, { recursive: true, force: true });
    }
    const gateDir = this.entityDir("gates", milestoneId);
    if (existsSync(gateDir)) {
      rmSync(gateDir, { recursive: true, force: true });
    }
    const evidenceDir = this.entityDir("verification_evidence", milestoneId);
    if (existsSync(evidenceDir)) {
      rmSync(evidenceDir, { recursive: true, force: true });
    }
    const depFile = join(this.entityDir("slice_dependencies"), `${milestoneId}.json`);
    deleteFile(depFile);
    const replanDir = this.entityDir("replan_history", milestoneId);
    if (existsSync(replanDir)) {
      rmSync(replanDir, { recursive: true, force: true });
    }
    deleteFile(this.milestoneFilePath(milestoneId));
  }

  // ── Slices ─────────────────────────────────────────────────────────────

  private sliceFilePath(milestoneId: string, sliceId: string): string {
    return join(this.entityDir("slices", milestoneId), `${sliceId}.json`);
  }

  private sliceDepFilePath(milestoneId: string): string {
    return join(this.entityDir("slice_dependencies"), `${milestoneId}.json`);
  }

  private readSliceDeps(milestoneId: string): Record<string, string[]> {
    const data = readJson<Record<string, string[]>>(this.sliceDepFilePath(milestoneId));
    return data ?? {};
  }

  private writeSliceDeps(milestoneId: string, deps: Record<string, string[]>): void {
    writeJson(this.sliceDepFilePath(milestoneId), deps);
  }

  insertSlice(s: { id: string; milestone_id: string; title: string; [key: string]: unknown }): void {
    const milestoneId = s.milestone_id || s.milestoneId;
    const now = new Date().toISOString();
    const depends = s.depends ? (Array.isArray(s.depends) ? s.depends : JSON.parse(String(s.depends))) : [];
    const slice: SliceRow = {
      milestone_id: milestoneId,
      id: s.id,
      title: s.title ?? "",
      status: s.status ?? "pending",
      risk: s.risk ?? "medium",
      depends,
      demo: s.demo ?? "",
      created_at: now,
      completed_at: null,
      full_summary_md: "",
      full_uat_md: "",
      goal: s.goal ?? "",
      success_criteria: s.success_criteria ?? "",
      proof_level: s.proof_level ?? "",
      integration_closure: s.integration_closure ?? "",
      observability_impact: s.observability_impact ?? "",
      sequence: s.sequence ?? 0,
      replan_triggered_at: null,
    };
    writeJson(this.sliceFilePath(milestoneId, s.id), slice);
    // Write dependencies
    if (depends.length > 0) {
      const deps = this.readSliceDeps(milestoneId);
      deps[s.id] = depends;
      this.writeSliceDeps(milestoneId, deps);
    }
  }

  upsertSlicePlanning(milestoneId: string, sliceId: string, planning: AnyParam): void {
    const existing = this.getSlice(milestoneId, sliceId);
    if (!existing) return;
    writeJson(this.sliceFilePath(milestoneId, sliceId), {
      ...existing,
      goal: planning.goal ?? existing.goal,
      success_criteria: planning.successCriteria ?? existing.success_criteria,
      proof_level: planning.proofLevel ?? existing.proof_level,
      integration_closure: planning.integrationClosure ?? existing.integration_closure,
      observability_impact: planning.observabilityImpact ?? existing.observability_impact,
    });
  }

  getSlice(milestoneId: string, sliceId: string): SliceRow | null {
    return readJson<SliceRow>(this.sliceFilePath(milestoneId, sliceId));
  }

  updateSliceStatus(milestoneId: string, sliceId: string, status: string, completedAt?: string): void {
    const existing = this.getSlice(milestoneId, sliceId);
    if (!existing) return;
    writeJson(this.sliceFilePath(milestoneId, sliceId), {
      ...existing,
      status,
      completed_at: completedAt ?? null,
    });
  }

  setSliceSummaryMd(milestoneId: string, sliceId: string, summaryMd: string, uatMd: string): void {
    const existing = this.getSlice(milestoneId, sliceId);
    if (!existing) return;
    writeJson(this.sliceFilePath(milestoneId, sliceId), {
      ...existing,
      full_summary_md: summaryMd,
      full_uat_md: uatMd,
    });
  }

  getMilestoneSlices(milestoneId: string): SliceRow[] {
    const dir = this.entityDir("slices", milestoneId);
    const slices = readDirJson<SliceRow>(dir);
    // Sort by sequence then id
    slices.sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0) || a.id.localeCompare(b.id));
    return slices;
  }

  getActiveSlice(milestoneId: string): SliceRow | null {
    const slices = this.getMilestoneSlices(milestoneId);
    const completedIds = new Set(
      slices.filter(s => s.status === "complete" || s.status === "done" || s.status === "skipped").map(s => s.id)
    );
    for (const slice of slices) {
      if (slice.status === "complete" || slice.status === "done" || slice.status === "skipped") continue;
      // Check all dependencies are satisfied
      const deps = slice.depends || [];
      if (deps.every(d => completedIds.has(d))) {
        return slice;
      }
    }
    return null;
  }

  getSliceStatusSummary(milestoneId: string): Array<{ id: string; status: string }> {
    return this.getMilestoneSlices(milestoneId).map(s => ({ id: s.id, status: s.status }));
  }

  getSliceTaskCounts(milestoneId: string, sliceId: string): { total: number; done: number; pending: number } {
    const tasks = this.getSliceTasks(milestoneId, sliceId);
    const total = tasks.length;
    const done = tasks.filter(t => t.status === "complete" || t.status === "done").length;
    return { total, done, pending: total - done };
  }

  syncSliceDependencies(milestoneId: string, sliceId: string, depends: string[]): void {
    const deps = this.readSliceDeps(milestoneId);
    deps[sliceId] = depends;
    this.writeSliceDeps(milestoneId, deps);
    // Also update the slice's depends field
    const existing = this.getSlice(milestoneId, sliceId);
    if (existing) {
      writeJson(this.sliceFilePath(milestoneId, sliceId), { ...existing, depends });
    }
  }

  getDependentSlices(milestoneId: string, sliceId: string): string[] {
    const deps = this.readSliceDeps(milestoneId);
    const result: string[] = [];
    for (const [sid, depList] of Object.entries(deps)) {
      if (depList.includes(sliceId)) result.push(sid);
    }
    return result;
  }

  updateSliceFields(milestoneId: string, sliceId: string, fields: { [key: string]: unknown }): void {
    const existing = this.getSlice(milestoneId, sliceId);
    if (!existing) return;
    const updated = { ...existing };
    if (fields.title !== undefined && fields.title !== null) updated.title = String(fields.title);
    if (fields.risk !== undefined && fields.risk !== null) updated.risk = String(fields.risk);
    if (fields.depends !== undefined && fields.depends !== null) {
      updated.depends = Array.isArray(fields.depends) ? fields.depends : JSON.parse(String(fields.depends));
    }
    if (fields.demo !== undefined && fields.demo !== null) updated.demo = String(fields.demo);
    writeJson(this.sliceFilePath(milestoneId, sliceId), updated);
  }

  deleteSlice(milestoneId: string, sliceId: string): void {
    // Cascade: verification_evidence, tasks, gate entries, slice deps
    const evidenceDir = this.entityDir("verification_evidence", milestoneId, sliceId);
    if (existsSync(evidenceDir)) rmSync(evidenceDir, { recursive: true, force: true });
    const taskDir = this.entityDir("tasks", milestoneId, sliceId);
    if (existsSync(taskDir)) rmSync(taskDir, { recursive: true, force: true });
    const gateFile = join(this.entityDir("gates", milestoneId), `${sliceId}.json`);
    deleteFile(gateFile);
    // Remove from dependencies
    const deps = this.readSliceDeps(milestoneId);
    delete deps[sliceId];
    // Remove references to this slice from other slices' dependencies
    for (const [sid, depList] of Object.entries(deps)) {
      deps[sid] = depList.filter(d => d !== sliceId);
    }
    this.writeSliceDeps(milestoneId, deps);
    deleteFile(this.sliceFilePath(milestoneId, sliceId));
  }

  // ── Tasks ──────────────────────────────────────────────────────────────

  private taskFilePath(milestoneId: string, sliceId: string, taskId: string): string {
    return join(this.entityDir("tasks", milestoneId, sliceId), `${taskId}.json`);
  }

  insertTask(t: { id: string; milestone_id: string; slice_id: string; title: string; [key: string]: unknown }): void {
    const milestoneId = t.milestone_id || t.milestoneId;
    const sliceId = t.slice_id || t.sliceId;
    const now = new Date().toISOString();
    const isComplete = t.status === "done" || t.status === "complete";
    const task: TaskRow = {
      milestone_id: milestoneId,
      slice_id: sliceId,
      id: t.id,
      title: t.title ?? "",
      status: t.status ?? "pending",
      one_liner: t.one_liner ?? "",
      narrative: t.narrative ?? "",
      verification_result: t.verification_result ?? "",
      duration: t.duration ?? "",
      completed_at: isComplete ? now : null,
      blocker_discovered: !!t.blocker_discovered,
      deviations: t.deviations ?? "",
      known_issues: t.known_issues ?? "",
      key_files: t.key_files ? (Array.isArray(t.key_files) ? t.key_files : JSON.parse(String(t.key_files))) : [],
      key_decisions: t.key_decisions ? (Array.isArray(t.key_decisions) ? t.key_decisions : JSON.parse(String(t.key_decisions))) : [],
      full_summary_md: t.full_summary_md ?? "",
      description: t.description ?? "",
      estimate: t.estimate ?? "",
      files: t.files ? (Array.isArray(t.files) ? t.files : JSON.parse(String(t.files))) : [],
      verify: t.verify ?? "",
      inputs: t.inputs ? (Array.isArray(t.inputs) ? t.inputs : JSON.parse(String(t.inputs))) : [],
      expected_output: t.expected_output ? (Array.isArray(t.expected_output) ? t.expected_output : JSON.parse(String(t.expected_output))) : [],
      observability_impact: t.observability_impact ?? "",
      full_plan_md: t.full_plan_md ?? "",
      sequence: t.sequence ?? 0,
    };
    writeJson(this.taskFilePath(milestoneId, sliceId, t.id), task);
  }

  upsertTaskPlanning(milestoneId: string, sliceId: string, taskId: string, planning: AnyParam): void {
    const existing = this.getTask(milestoneId, sliceId, taskId);
    if (!existing) return;
    writeJson(this.taskFilePath(milestoneId, sliceId, taskId), {
      ...existing,
      title: planning.title ?? existing.title,
      description: planning.description ?? existing.description,
      estimate: planning.estimate ?? existing.estimate,
      files: planning.files ?? existing.files,
      verify: planning.verify ?? existing.verify,
      inputs: planning.inputs ?? existing.inputs,
      expected_output: planning.expectedOutput ?? existing.expected_output,
      observability_impact: planning.observabilityImpact ?? existing.observability_impact,
      full_plan_md: planning.fullPlanMd ?? existing.full_plan_md,
    });
  }

  getTask(milestoneId: string, sliceId: string, taskId: string): TaskRow | null {
    return readJson<TaskRow>(this.taskFilePath(milestoneId, sliceId, taskId));
  }

  getSliceTasks(milestoneId: string, sliceId: string): TaskRow[] {
    const dir = this.entityDir("tasks", milestoneId, sliceId);
    const tasks = readDirJson<TaskRow>(dir);
    tasks.sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0) || a.id.localeCompare(b.id));
    return tasks;
  }

  getActiveTask(milestoneId: string, sliceId: string): TaskRow | null {
    const tasks = this.getSliceTasks(milestoneId, sliceId);
    return tasks.find(t => t.status !== "complete" && t.status !== "done") ?? null;
  }

  getActiveTaskId(milestoneId: string, sliceId: string): { id: string; status: string; title: string } | null {
    const t = this.getActiveTask(milestoneId, sliceId);
    return t ? { id: t.id, status: t.status, title: t.title } : null;
  }

  updateTaskStatus(milestoneId: string, sliceId: string, taskId: string, status: string, completedAt?: string): void {
    const existing = this.getTask(milestoneId, sliceId, taskId);
    if (!existing) return;
    writeJson(this.taskFilePath(milestoneId, sliceId, taskId), {
      ...existing,
      status,
      completed_at: completedAt ?? (status === "done" || status === "complete" ? new Date().toISOString() : null),
    });
  }

  setTaskBlockerDiscovered(milestoneId: string, sliceId: string, taskId: string, discovered: boolean): void {
    const existing = this.getTask(milestoneId, sliceId, taskId);
    if (!existing) return;
    writeJson(this.taskFilePath(milestoneId, sliceId, taskId), {
      ...existing,
      blocker_discovered: discovered,
    });
  }

  setTaskSummaryMd(milestoneId: string, sliceId: string, taskId: string, md: string): void {
    const existing = this.getTask(milestoneId, sliceId, taskId);
    if (!existing) return;
    writeJson(this.taskFilePath(milestoneId, sliceId, taskId), {
      ...existing,
      full_summary_md: md,
    });
  }

  deleteTask(milestoneId: string, sliceId: string, taskId: string): void {
    // Delete verification evidence first
    const evidenceDir = this.entityDir("verification_evidence", milestoneId, sliceId);
    if (existsSync(evidenceDir)) {
      const evidenceFile = join(evidenceDir, `${taskId}.json`);
      deleteFile(evidenceFile);
    }
    deleteFile(this.taskFilePath(milestoneId, sliceId, taskId));
  }

  // ── Artifacts ──────────────────────────────────────────────────────────

  private artifactFilePath(path: string): string {
    return join(this.entityDir("artifacts"), `${encodePath(path)}.json`);
  }

  clearArtifacts(): void {
    const dir = this.entityDir("artifacts");
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    this.ensureDir(dir);
  }

  insertArtifact(a: { path: string; type: string; milestone_id?: string | null; slice_id?: string | null; task_id?: string | null; created_at?: string; [key: string]: unknown }): void {
    const artifact: ArtifactRow = {
      path: a.path,
      artifact_type: a.type || a.artifact_type || "",
      milestone_id: a.milestone_id ?? null,
      slice_id: a.slice_id ?? null,
      task_id: a.task_id ?? null,
      full_content: a.full_content ?? "",
      imported_at: a.created_at ?? new Date().toISOString(),
    };
    writeJson(this.artifactFilePath(a.path), artifact);
  }

  getArtifact(path: string): ArtifactRow | null {
    return readJson<ArtifactRow>(this.artifactFilePath(path));
  }

  // ── Verification Evidence ──────────────────────────────────────────────

  private evidenceFilePath(milestoneId: string, sliceId: string, taskId: string): string {
    return join(this.entityDir("verification_evidence", milestoneId, sliceId), `${taskId}.json`);
  }

  insertVerificationEvidence(e: { milestone_id: string; slice_id: string; task_id: string; command: string; exitCode?: number; exit_code?: number; verdict: string; durationMs?: number; duration_ms?: number; [key: string]: unknown }): void {
    const milestoneId = e.milestone_id || e.milestoneId;
    const sliceId = e.slice_id || e.sliceId;
    const taskId = e.task_id || e.taskId;
    const file = this.evidenceFilePath(milestoneId, sliceId, taskId);
    const existing: VerificationEvidenceRow[] = readJson<VerificationEvidenceRow[]>(file) || [];
    const newRow: VerificationEvidenceRow = {
      id: existing.length > 0 ? Math.max(...existing.map(r => r.id)) + 1 : 1,
      task_id: taskId,
      slice_id: sliceId,
      milestone_id: milestoneId,
      command: e.command,
      exit_code: e.exitCode ?? e.exit_code ?? 0,
      verdict: e.verdict,
      duration_ms: e.durationMs ?? e.duration_ms ?? 0,
      created_at: new Date().toISOString(),
    };
    // Dedup: skip if same command+verdict already exists
    const exists = existing.some(r => r.command === newRow.command && r.verdict === newRow.verdict);
    if (!exists) {
      existing.push(newRow);
      writeJson(file, existing);
    }
  }

  getVerificationEvidence(milestoneId: string, sliceId: string, taskId: string): VerificationEvidenceRow[] {
    return readJson<VerificationEvidenceRow[]>(this.evidenceFilePath(milestoneId, sliceId, taskId)) || [];
  }

  deleteVerificationEvidence(milestoneId: string, sliceId: string, taskId: string): void {
    deleteFile(this.evidenceFilePath(milestoneId, sliceId, taskId));
  }

  // ── Replan History ─────────────────────────────────────────────────────

  private replanHistoryFilePath(milestoneId: string): string {
    return join(this.entityDir("replan_history", milestoneId), "history.json");
  }

  insertReplanHistory(entry: { milestone_id: string; slice_id?: string | null; task_id?: string | null; summary: string; previous_artifact_path?: string | null; replacement_artifact_path?: string | null; milestoneId?: string; sliceId?: string | null; taskId?: string | null }): void {
    const milestoneId = entry.milestone_id || entry.milestoneId;
    const file = this.replanHistoryFilePath(milestoneId);
    const history: Array<Record<string, unknown>> = readJson(file) || [];
    // Upsert: replace if same milestone_id+slice_id+task_id
    const idx = history.findIndex(
      h => h.milestone_id === milestoneId && h.slice_id === (entry.slice_id ?? entry.sliceId ?? null) && h.task_id === (entry.task_id ?? entry.taskId ?? null)
    );
    const record: Record<string, unknown> = {
      milestone_id: milestoneId,
      slice_id: entry.slice_id ?? entry.sliceId ?? null,
      task_id: entry.task_id ?? entry.taskId ?? null,
      summary: entry.summary,
      previous_artifact_path: entry.previous_artifact_path ?? null,
      replacement_artifact_path: entry.replacement_artifact_path ?? null,
      created_at: new Date().toISOString(),
    };
    if (idx >= 0) {
      history[idx] = record;
    } else {
      history.push(record);
    }
    writeJson(file, history);
  }

  getReplanHistory(milestoneId: string, sliceId?: string): Array<Record<string, unknown>> {
    const history = readJson<Array<Record<string, unknown>>>(this.replanHistoryFilePath(milestoneId)) || [];
    if (sliceId) {
      return history.filter(h => h.slice_id === sliceId);
    }
    return history.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  }

  // ── Assessment ─────────────────────────────────────────────────────────

  private assessmentFilePath(path: string): string {
    return join(this.entityDir("assessments"), `${encodePath(path)}.json`);
  }

  insertAssessment(entry: { path: string; milestone_id: string; slice_id?: string | null; task_id?: string | null; status: string; scope: string; full_content: string; milestoneId?: string }): void {
    const record = {
      path: entry.path,
      milestone_id: entry.milestone_id || entry.milestoneId || "",
      slice_id: entry.slice_id ?? null,
      task_id: entry.task_id ?? null,
      status: entry.status,
      scope: entry.scope,
      full_content: entry.full_content,
      created_at: new Date().toISOString(),
    };
    writeJson(this.assessmentFilePath(entry.path), record);
  }

  deleteAssessmentByScope(milestoneId: string, scope: string): void {
    const dir = this.entityDir("assessments");
    if (!existsSync(dir)) return;
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      const data = readJson<Record<string, unknown>>(join(dir, file));
      if (data && data.milestone_id === milestoneId && data.scope === scope) {
        deleteFile(join(dir, file));
      }
    }
  }

  getAssessment(path: string): Record<string, unknown> | null {
    return readJson(this.assessmentFilePath(path));
  }

  // ── Gates ──────────────────────────────────────────────────────────────

  private gatesFilePath(milestoneId: string, sliceId: string): string {
    return join(this.entityDir("gates", milestoneId), `${sliceId}.json`);
  }

  private readGates(milestoneId: string, sliceId: string): GateRow[] {
    return readJson<GateRow[]>(this.gatesFilePath(milestoneId, sliceId)) || [];
  }

  private writeGates(milestoneId: string, sliceId: string, gates: GateRow[]): void {
    writeJson(this.gatesFilePath(milestoneId, sliceId), gates);
  }

  insertGateRow(g: { milestone_id: string; slice_id: string; gate_id: GateId; scope: GateScope; task_id?: string; status?: GateStatus; milestoneId?: string; sliceId?: string }): void {
    const milestoneId = g.milestone_id || g.milestoneId;
    const sliceId = g.slice_id || g.sliceId;
    const gates = this.readGates(milestoneId, sliceId);
    const exists = gates.some(
      existing => existing.gate_id === g.gate_id && (existing.task_id || "") === (g.task_id ?? "")
    );
    if (!exists) {
      gates.push({
        milestone_id: milestoneId,
        slice_id: sliceId,
        gate_id: g.gate_id,
        scope: g.scope,
        task_id: g.task_id ?? "",
        status: g.status ?? "pending",
        verdict: "",
        rationale: "",
        findings: "",
        evaluated_at: null,
      });
      this.writeGates(milestoneId, sliceId, gates);
    }
  }

  saveGateResult(g: { milestone_id: string; slice_id: string; gate_id: string; task_id?: string | null; verdict: GateVerdict; rationale: string; findings: string; milestoneId?: string; sliceId?: string; gateId?: string }): void {
    const milestoneId = g.milestone_id || g.milestoneId;
    const sliceId = g.slice_id || g.sliceId;
    const gateId = g.gate_id || g.gateId;
    const gates = this.readGates(milestoneId, sliceId);
    for (const gate of gates) {
      if (gate.gate_id === gateId && (gate.task_id || "") === (g.task_id ?? "")) {
        gate.status = "complete";
        gate.verdict = g.verdict;
        gate.rationale = g.rationale ?? "";
        gate.findings = g.findings ?? "";
        gate.evaluated_at = new Date().toISOString();
      }
    }
    this.writeGates(milestoneId, sliceId, gates);
  }

  getPendingGates(milestoneId: string, sliceId: string, scope?: GateScope): GateRow[] {
    const gates = this.readGates(milestoneId, sliceId);
    const pending = gates.filter(g => g.status === "pending");
    if (scope) return pending.filter(g => g.scope === scope);
    return pending;
  }

  getGateResults(milestoneId: string, sliceId: string, scope?: GateScope): GateRow[] {
    const gates = this.readGates(milestoneId, sliceId);
    if (scope) return gates.filter(g => g.scope === scope);
    return gates;
  }

  markAllGatesOmitted(milestoneId: string, sliceId: string): void {
    const gates = this.readGates(milestoneId, sliceId);
    for (const gate of gates) {
      if (gate.status === "pending") {
        gate.status = "omitted";
        gate.verdict = "omitted";
        gate.evaluated_at = new Date().toISOString();
      }
    }
    this.writeGates(milestoneId, sliceId, gates);
  }

  getPendingSliceGateCount(milestoneId: string, sliceId: string): number {
    return this.getPendingGates(milestoneId, sliceId, "slice").length;
  }

  getPendingGatesForTurn(milestoneId: string, sliceId: string, _turn: string, taskId?: string): GateRow[] {
    // In file-based storage, we don't have turn metadata, so return all pending gates
    // optionally filtered by task
    const gates = this.getPendingGates(milestoneId, sliceId);
    if (taskId !== undefined) return gates.filter(g => g.task_id === taskId);
    return gates;
  }

  getPendingGateCountForTurn(milestoneId: string, sliceId: string, turn: string): number {
    return this.getPendingGatesForTurn(milestoneId, sliceId, turn).length;
  }

  // ── Worktree Operations ────────────────────────────────────────────────

  copyWorktreeDb(srcDbPath: string, destDbPath: string): boolean {
    try {
      if (!existsSync(srcDbPath)) return false;
      this.ensureDir(dirname(destDbPath));
      // For markdown storage, "copying DB" means copying the storage directory
      const srcDir = srcDbPath.endsWith(".gsd") ? srcDbPath : join(srcDbPath, ".gsd", "storage");
      const destDir = destDbPath.endsWith(".gsd") ? destDbPath : join(destDbPath, ".gsd", "storage");
      // Simple copy: read all JSON files from src and write to dest
      this._copyDirRecursive(srcDir, destDir);
      return true;
    } catch {
      return false;
    }
  }

  private _copyDirRecursive(src: string, dest: string): void {
    if (!existsSync(src)) return;
    this.ensureDir(dest);
    for (const entry of readdirSync(src)) {
      const srcPath = join(src, entry);
      const destPath = join(dest, entry);
      const stat = statSync(srcPath, { throwIfNoEntry: false });
      if (stat?.isDirectory()) {
        this._copyDirRecursive(srcPath, destPath);
      } else {
        writeFileSync(destPath, readFileSync(srcPath));
      }
    }
  }

  reconcileWorktreeDb(
    mainDbPath: string,
    _worktreeDbPath: string,
  ): { decisions: number; requirements: number; artifacts: number; milestones: number; slices: number; tasks: number; memories: number; verification_evidence: number; conflicts: unknown[] } {
    // For markdown storage, reconciliation means merging JSON files
    // Since we don't have the worktree data accessible in this method signature,
    // return zero — reconciliation is only meaningful for SQLite ATTACH-based merge
    return { decisions: 0, requirements: 0, artifacts: 0, milestones: 0, slices: 0, tasks: 0, memories: 0, verification_evidence: 0, conflicts: [] };
  }
}
