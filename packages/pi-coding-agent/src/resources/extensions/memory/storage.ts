/**
 * JSON file storage for the memory extraction pipeline.
 *
 * Replaces sql.js (SQLite in-memory) with individual JSON files.
 *
 * File structure:
 * - .gsd/memory/jobs/{job-id}.json
 * - .gsd/memory/threads/{thread-id}.json
 * - .gsd/memory/stage1/{thread-id}.json
 *
 * Each JSON file contains the full row data. Directory scans replace SQL indexes.
 * Atomic writes via temp file + rename.
 */

import { randomUUID } from "crypto";
import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	renameSync,
	rmSync,
	statSync,
	writeFileSync,
} from "fs";
import { join } from "path";
import { tmpdir } from "os";

export interface ThreadRow {
	thread_id: string;
	file_path: string;
	file_size: number;
	file_mtime: number;
	cwd: string;
	status: "pending" | "processing" | "done" | "error";
	error_message: string | null;
	created_at: string;
	updated_at: string;
}

export interface Stage1OutputRow {
	thread_id: string;
	extraction_json: string;
	created_at: string;
}

export interface JobRow {
	id: string;
	phase: "stage1" | "stage2";
	thread_id: string | null;
	status: "pending" | "claimed" | "done" | "error";
	worker_id: string | null;
	ownership_token: string | null;
	lease_expires_at: string | null;
	error_message: string | null;
	created_at: string;
	updated_at: string;
}

interface JobFileData {
	id: string;
	phase: "stage1" | "stage2";
	thread_id: string | null;
	status: "pending" | "claimed" | "done" | "error";
	worker_id: string | null;
	ownership_token: string | null;
	lease_expires_at: string | null;
	error_message: string | null;
	created_at: string;
	updated_at: string;
}

interface ThreadFileData {
	thread_id: string;
	file_path: string;
	file_size: number;
	file_mtime: number;
	cwd: string;
	status: "pending" | "processing" | "done" | "error";
	error_message: string | null;
	created_at: string;
	updated_at: string;
}

interface Stage1FileData {
	thread_id: string;
	extraction_json: string;
	created_at: string;
}

/**
 * Atomic write: write to temp file, then rename.
 * Ensures readers never see partial writes.
 */
function atomicWrite(filePath: string, content: string): void {
	const dir = join(filePath, "..");
	const tempPath = join(tmpdir(), `gsd-memory-${randomUUID()}.tmp`);
	writeFileSync(tempPath, content, "utf-8");
	renameSync(tempPath, filePath);
}

/**
 * Read and parse a JSON file, or return undefined if not found.
 */
function readJsonFile<T>(filePath: string): T | undefined {
	if (!existsSync(filePath)) {
		return undefined;
	}
	try {
		const raw = readFileSync(filePath, "utf-8");
		return JSON.parse(raw) as T;
	} catch {
		return undefined;
	}
}

/**
 * Serialize to JSON with consistent formatting.
 */
function toJson(data: unknown): string {
	return JSON.stringify(data, null, 2);
}

/**
 * Get the current ISO timestamp.
 */
function nowISO(): string {
	return new Date().toISOString();
}

export class MemoryStorage {
	private baseDir: string;
	private jobsDir: string;
	private threadsDir: string;
	private stage1Dir: string;

	// In-memory cache for fast lookups
	private jobsCache: Map<string, JobFileData> = new Map();
	private threadsCache: Map<string, ThreadFileData> = new Map();
	private stage1Cache: Map<string, Stage1FileData> = new Map();

	private persistTimer: ReturnType<typeof setTimeout> | null = null;

	private constructor(baseDir: string) {
		this.baseDir = baseDir;
		this.jobsDir = join(baseDir, "jobs");
		this.threadsDir = join(baseDir, "threads");
		this.stage1Dir = join(baseDir, "stage1");
	}

	/**
	 * Create or open a MemoryStorage at the given base directory.
	 * If old agent.db exists, migration is handled separately.
	 */
	static async create(baseDir: string): Promise<MemoryStorage> {
		const storage = new MemoryStorage(baseDir);
		storage.ensureDirs();
		await storage.loadFromFiles();
		return storage;
	}

	private ensureDirs(): void {
		if (!existsSync(this.baseDir)) {
			mkdirSync(this.baseDir, { recursive: true });
		}
		if (!existsSync(this.jobsDir)) {
			mkdirSync(this.jobsDir, { recursive: true });
		}
		if (!existsSync(this.threadsDir)) {
			mkdirSync(this.threadsDir, { recursive: true });
		}
		if (!existsSync(this.stage1Dir)) {
			mkdirSync(this.stage1Dir, { recursive: true });
		}
	}

	private async loadFromFiles(): Promise<void> {
		// Load jobs
		try {
			const entries = readdirSync(this.jobsDir);
			for (const entry of entries) {
				if (!entry.endsWith(".json")) continue;
				const data = readJsonFile<JobFileData>(join(this.jobsDir, entry));
				if (data) {
					this.jobsCache.set(data.id, data);
				}
			}
		} catch {
			// Dir doesn't exist yet
		}

		// Load threads
		try {
			const entries = readdirSync(this.threadsDir);
			for (const entry of entries) {
				if (!entry.endsWith(".json")) continue;
				const data = readJsonFile<ThreadFileData>(join(this.threadsDir, entry));
				if (data) {
					this.threadsCache.set(data.thread_id, data);
				}
			}
		} catch {
			// Dir doesn't exist yet
		}

		// Load stage1 outputs
		try {
			const entries = readdirSync(this.stage1Dir);
			for (const entry of entries) {
				if (!entry.endsWith(".json")) continue;
				const data = readJsonFile<Stage1FileData>(join(this.stage1Dir, entry));
				if (data) {
					this.stage1Cache.set(data.thread_id, data);
				}
			}
		} catch {
			// Dir doesn't exist yet
		}
	}

	private persistJob(id: string): void {
		const data = this.jobsCache.get(id);
		if (!data) return;
		const filePath = join(this.jobsDir, `${id}.json`);
		atomicWrite(filePath, toJson(data));
	}

	private persistThread(threadId: string): void {
		const data = this.threadsCache.get(threadId);
		if (!data) return;
		const filePath = join(this.threadsDir, `${threadId}.json`);
		atomicWrite(filePath, toJson(data));
	}

	private persistStage1(threadId: string): void {
		const data = this.stage1Cache.get(threadId);
		if (!data) return;
		const filePath = join(this.stage1Dir, `${threadId}.json`);
		atomicWrite(filePath, toJson(data));
	}

	private schedulePersist(): void {
		if (this.persistTimer) {
			clearTimeout(this.persistTimer);
		}
		this.persistTimer = setTimeout(() => {
			this.persistTimer = null;
			this.persistAll();
		}, 500);
	}

	private persistAll(): void {
		for (const [id] of this.jobsCache) {
			this.persistJob(id);
		}
		for (const [threadId] of this.threadsCache) {
			this.persistThread(threadId);
		}
		for (const [threadId] of this.stage1Cache) {
			this.persistStage1(threadId);
		}
	}

	/**
	 * Insert or update thread records. Skips threads whose file hasn't changed
	 * (same size + mtime = watermark match).
	 */
	upsertThreads(
		threads: Array<{
			threadId: string;
			filePath: string;
			fileSize: number;
			fileMtime: number;
			cwd: string;
		}>,
	): { inserted: number; updated: number; skipped: number } {
		let inserted = 0;
		let updated = 0;
		let skipped = 0;

		for (const t of threads) {
			const existing = this.threadsCache.get(t.threadId);

			if (!existing) {
				const now = nowISO();
				const threadData: ThreadFileData = {
					thread_id: t.threadId,
					file_path: t.filePath,
					file_size: t.fileSize,
					file_mtime: t.fileMtime,
					cwd: t.cwd,
					status: "pending",
					error_message: null,
					created_at: now,
					updated_at: now,
				};
				this.threadsCache.set(t.threadId, threadData);

				// Create a pending stage1 job
				const jobId = randomUUID();
				const jobData: JobFileData = {
					id: jobId,
					phase: "stage1",
					thread_id: t.threadId,
					status: "pending",
					worker_id: null,
					ownership_token: null,
					lease_expires_at: null,
					error_message: null,
					created_at: now,
					updated_at: now,
				};
				this.jobsCache.set(jobId, jobData);

				inserted++;
			} else if (existing.file_size !== t.fileSize || existing.file_mtime !== t.fileMtime) {
				const now = nowISO();
				this.threadsCache.set(t.threadId, {
					...existing,
					file_path: t.filePath,
					file_size: t.fileSize,
					file_mtime: t.fileMtime,
					cwd: t.cwd,
					status: "pending",
					updated_at: now,
				});

				// Re-enqueue job if thread was done or errored
				if (existing.status === "done" || existing.status === "error") {
					const now2 = nowISO();
					const jobId = randomUUID();
					const jobData: JobFileData = {
						id: jobId,
						phase: "stage1",
						thread_id: t.threadId,
						status: "pending",
						worker_id: null,
						ownership_token: null,
						lease_expires_at: null,
						error_message: null,
						created_at: now2,
						updated_at: now2,
					};
					this.jobsCache.set(jobId, jobData);
				}
				updated++;
			} else {
				skipped++;
			}
		}

		this.schedulePersist();
		return { inserted, updated, skipped };
	}

	/**
	 * Claim up to `limit` stage1 jobs for the given worker.
	 * Uses lease-based ownership with an ownership_token UUID.
	 */
	claimStage1Jobs(
		workerId: string,
		limit: number,
		leaseSeconds: number,
	): Array<{ jobId: string; threadId: string; ownershipToken: string }> {
		const token = randomUUID();
		const expiresAt = new Date(Date.now() + leaseSeconds * 1000).toISOString();
		const now = nowISO();

		// Find eligible jobs: pending, or claimed with expired lease
		const eligible: JobFileData[] = [];
		for (const job of this.jobsCache.values()) {
			if (job.phase !== "stage1") continue;
			if (job.status === "pending") {
				eligible.push(job);
			} else if (job.status === "claimed" && job.lease_expires_at) {
				if (new Date(job.lease_expires_at) < new Date()) {
					eligible.push(job);
				}
			}
			if (eligible.length >= limit) break;
		}

		const claimed: Array<{ jobId: string; threadId: string; ownershipToken: string }> = [];
		for (const job of eligible) {
			const updated: JobFileData = {
				...job,
				status: "claimed",
				worker_id: workerId,
				ownership_token: token,
				lease_expires_at: expiresAt,
				updated_at: now,
			};
			this.jobsCache.set(job.id, updated);
			if (job.thread_id) {
				claimed.push({
					jobId: job.id,
					threadId: job.thread_id,
					ownershipToken: token,
				});
			}
		}

		this.schedulePersist();
		return claimed;
	}

	/**
	 * Mark a stage1 job as complete and store the extraction output.
	 */
	completeStage1Job(threadId: string, output: string): void {
		const now = nowISO();

		// Mark job as done
		for (const [id, job] of this.jobsCache) {
			if (job.thread_id === threadId && job.phase === "stage1" && job.status === "claimed") {
				this.jobsCache.set(id, {
					...job,
					status: "done",
					updated_at: now,
				});
				break;
			}
		}

		// Store output
		const stage1Data: Stage1FileData = {
			thread_id: threadId,
			extraction_json: output,
			created_at: now,
		};
		this.stage1Cache.set(threadId, stage1Data);

		// Mark thread as done
		const thread = this.threadsCache.get(threadId);
		if (thread) {
			this.threadsCache.set(threadId, {
				...thread,
				status: "done",
				updated_at: now,
			});
		}

		this.schedulePersist();
	}

	/**
	 * Mark a stage1 job as errored.
	 */
	failStage1Job(threadId: string, errorMessage: string): void {
		const now = nowISO();

		// Mark job as error
		for (const [id, job] of this.jobsCache) {
			if (job.thread_id === threadId && job.phase === "stage1" && job.status === "claimed") {
				this.jobsCache.set(id, {
					...job,
					status: "error",
					error_message: errorMessage,
					updated_at: now,
				});
				break;
			}
		}

		// Mark thread as error
		const thread = this.threadsCache.get(threadId);
		if (thread) {
			this.threadsCache.set(threadId, {
				...thread,
				status: "error",
				error_message: errorMessage,
				updated_at: now,
			});
		}

		this.schedulePersist();
	}

	/**
	 * Try to claim the global phase 2 consolidation job.
	 * Only one worker can hold this at a time.
	 */
	tryClaimGlobalPhase2Job(
		workerId: string,
		leaseSeconds: number,
	): { jobId: string; ownershipToken: string } | null {
		const token = randomUUID();
		const expiresAt = new Date(Date.now() + leaseSeconds * 1000).toISOString();

		// Check for pending stage1 jobs
		for (const job of this.jobsCache.values()) {
			if (job.phase === "stage1" && (job.status === "pending" || job.status === "claimed")) {
				return null;
			}
		}

		// Check for active stage2 jobs
		for (const job of this.jobsCache.values()) {
			if (
				job.phase === "stage2" &&
				job.status === "claimed" &&
				job.lease_expires_at &&
				new Date(job.lease_expires_at) > new Date()
			) {
				return null;
			}
		}

		// Check for stage1 outputs
		if (this.stage1Cache.size === 0) {
			return null;
		}

		const jobId = randomUUID();
		const now = nowISO();
		const jobData: JobFileData = {
			id: jobId,
			phase: "stage2",
			thread_id: null,
			status: "claimed",
			worker_id: workerId,
			ownership_token: token,
			lease_expires_at: expiresAt,
			error_message: null,
			created_at: now,
			updated_at: now,
		};
		this.jobsCache.set(jobId, jobData);

		this.schedulePersist();
		return { jobId, ownershipToken: token };
	}

	/**
	 * Complete the phase 2 consolidation job.
	 */
	completePhase2Job(jobId: string): void {
		const job = this.jobsCache.get(jobId);
		if (job && job.phase === "stage2") {
			this.jobsCache.set(jobId, {
				...job,
				status: "done",
				updated_at: nowISO(),
			});
		}
		this.schedulePersist();
	}

	/**
	 * Get all stage1 extraction outputs.
	 */
	getStage1Outputs(): Array<{ threadId: string; extractionJson: string }> {
		const results: Array<{ threadId: string; extractionJson: string }> = [];
		for (const data of this.stage1Cache.values()) {
			results.push({
				threadId: data.thread_id,
				extractionJson: data.extraction_json,
			});
		}
		return results;
	}

	/**
	 * Get all stage1 outputs for a specific cwd.
	 */
	getStage1OutputsForCwd(cwd: string): Array<{ threadId: string; extractionJson: string }> {
		const results: Array<{ threadId: string; extractionJson: string }> = [];

		// Find threads matching this cwd
		const matchingThreadIds = new Set<string>();
		for (const thread of this.threadsCache.values()) {
			if (thread.cwd === cwd) {
				matchingThreadIds.add(thread.thread_id);
			}
		}

		// Get stage1 outputs for those threads
		for (const [threadId, data] of this.stage1Cache) {
			if (matchingThreadIds.has(threadId)) {
				results.push({
					threadId: data.thread_id,
					extractionJson: data.extraction_json,
				});
			}
		}

		return results;
	}

	/**
	 * Get thread info by ID.
	 */
	getThread(threadId: string): ThreadRow | undefined {
		const data = this.threadsCache.get(threadId);
		if (!data) return undefined;
		return {
			thread_id: data.thread_id,
			file_path: data.file_path,
			file_size: data.file_size,
			file_mtime: data.file_mtime,
			cwd: data.cwd,
			status: data.status,
			error_message: data.error_message,
			created_at: data.created_at,
			updated_at: data.updated_at,
		};
	}

	/**
	 * Get pipeline statistics.
	 */
	getStats(): {
		totalThreads: number;
		pendingThreads: number;
		doneThreads: number;
		errorThreads: number;
		totalStage1Outputs: number;
		pendingStage1Jobs: number;
	} {
		let totalThreads = 0;
		let pendingThreads = 0;
		let doneThreads = 0;
		let errorThreads = 0;

		for (const thread of this.threadsCache.values()) {
			totalThreads++;
			if (thread.status === "pending") pendingThreads++;
			else if (thread.status === "done") doneThreads++;
			else if (thread.status === "error") errorThreads++;
		}

		let pendingStage1Jobs = 0;
		for (const job of this.jobsCache.values()) {
			if (job.phase === "stage1" && (job.status === "pending" || job.status === "claimed")) {
				pendingStage1Jobs++;
			}
		}

		return {
			totalThreads,
			pendingThreads,
			doneThreads,
			errorThreads,
			totalStage1Outputs: this.stage1Cache.size,
			pendingStage1Jobs,
		};
	}

	/**
	 * Clear all data (for /memory clear).
	 */
	clearAll(): void {
		this.stage1Cache.clear();
		this.jobsCache.clear();
		this.threadsCache.clear();

		// Remove all files
		try {
			for (const entry of readdirSync(this.stage1Dir)) {
				rmSync(join(this.stage1Dir, entry));
			}
		} catch {
			// Dir doesn't exist
		}
		try {
			for (const entry of readdirSync(this.jobsDir)) {
				rmSync(join(this.jobsDir, entry));
			}
		} catch {
			// Dir doesn't exist
		}
		try {
			for (const entry of readdirSync(this.threadsDir)) {
				rmSync(join(this.threadsDir, entry));
			}
		} catch {
			// Dir doesn't exist
		}
	}

	/**
	 * Clear data for a specific cwd (for /memory clear in project scope).
	 */
	clearForCwd(cwd: string): void {
		// Find threads to remove
		const toRemove: string[] = [];
		for (const [threadId, thread] of this.threadsCache) {
			if (thread.cwd === cwd) {
				toRemove.push(threadId);
			}
		}

		// Remove stage1 outputs
		for (const threadId of toRemove) {
			this.stage1Cache.delete(threadId);
			try {
				const filePath = join(this.stage1Dir, `${threadId}.json`);
				if (existsSync(filePath)) rmSync(filePath);
			} catch {
				// File doesn't exist
			}
		}

		// Remove jobs for those threads
		const jobsToRemove: string[] = [];
		for (const [jobId, job] of this.jobsCache) {
			if (job.thread_id && toRemove.includes(job.thread_id)) {
				jobsToRemove.push(jobId);
			}
		}
		for (const jobId of jobsToRemove) {
			this.jobsCache.delete(jobId);
			try {
				const filePath = join(this.jobsDir, `${jobId}.json`);
				if (existsSync(filePath)) rmSync(filePath);
			} catch {
				// File doesn't exist
			}
		}

		// Remove threads
		for (const threadId of toRemove) {
			this.threadsCache.delete(threadId);
			try {
				const filePath = join(this.threadsDir, `${threadId}.json`);
				if (existsSync(filePath)) rmSync(filePath);
			} catch {
				// File doesn't exist
			}
		}
	}

	/**
	 * Reset all threads to pending (for /memory rebuild).
	 */
	resetAllForCwd(cwd: string): void {
		// Find matching threads
		const matchingThreadIds: string[] = [];
		for (const [threadId, thread] of this.threadsCache) {
			if (thread.cwd === cwd) {
				matchingThreadIds.push(threadId);
			}
		}

		// Remove stage1 outputs and jobs for these threads
		for (const threadId of matchingThreadIds) {
			this.stage1Cache.delete(threadId);
			try {
				const filePath = join(this.stage1Dir, `${threadId}.json`);
				if (existsSync(filePath)) rmSync(filePath);
			} catch {
				// File doesn't exist
			}
		}

		// Remove existing jobs for these threads
		const jobsToRemove: string[] = [];
		for (const [jobId, job] of this.jobsCache) {
			if (job.thread_id && matchingThreadIds.includes(job.thread_id)) {
				jobsToRemove.push(jobId);
			}
		}
		for (const jobId of jobsToRemove) {
			this.jobsCache.delete(jobId);
			try {
				const filePath = join(this.jobsDir, `${jobId}.json`);
				if (existsSync(filePath)) rmSync(filePath);
			} catch {
				// File doesn't exist
			}
		}

		// Reset threads to pending and create new jobs
		const now = nowISO();
		for (const threadId of matchingThreadIds) {
			const thread = this.threadsCache.get(threadId);
			if (thread) {
				this.threadsCache.set(threadId, {
					...thread,
					status: "pending",
					updated_at: now,
				});
				this.persistThread(threadId);

				// Create new stage1 job
				const jobId = randomUUID();
				const jobData: JobFileData = {
					id: jobId,
					phase: "stage1",
					thread_id: threadId,
					status: "pending",
					worker_id: null,
					ownership_token: null,
					lease_expires_at: null,
					error_message: null,
					created_at: now,
					updated_at: now,
				};
				this.jobsCache.set(jobId, jobData);
				this.persistJob(jobId);
			}
		}
	}

	close(): void {
		if (this.persistTimer) {
			clearTimeout(this.persistTimer);
			this.persistTimer = null;
		}
		this.persistAll();
	}
}
