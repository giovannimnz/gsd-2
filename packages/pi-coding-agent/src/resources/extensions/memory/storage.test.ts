import assert from "node:assert/strict";
import { describe, it, afterEach } from "node:test";
import { mkdtempSync, rmSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { MemoryStorage } from "./storage.js";

function makeTmpDir(): string {
	return mkdtempSync(join(tmpdir(), "gsd-memory-storage-test-"));
}

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function countJsonFiles(dir: string): number {
	if (!existsSync(dir)) return 0;
	return readdirSync(dir).filter((f) => f.endsWith(".json")).length;
}

describe("MemoryStorage JSON file persistence", () => {
	let dir: string;

	afterEach(() => {
		if (dir) {
			rmSync(dir, { recursive: true, force: true });
		}
	});

	it("multiple rapid mutations only trigger one persist write", async () => {
		dir = makeTmpDir();
		const storage = await MemoryStorage.create(dir);

		const initialThreadCount = countJsonFiles(join(dir, "threads"));
		const initialJobCount = countJsonFiles(join(dir, "jobs"));

		storage.upsertThreads([
			{ threadId: "t1", filePath: "/a.txt", fileSize: 100, fileMtime: 1000, cwd: "/proj" },
		]);
		storage.upsertThreads([
			{ threadId: "t2", filePath: "/b.txt", fileSize: 200, fileMtime: 2000, cwd: "/proj" },
		]);
		storage.upsertThreads([
			{ threadId: "t3", filePath: "/c.txt", fileSize: 300, fileMtime: 3000, cwd: "/proj" },
		]);

		// Files should not have been written yet (debounce window has not elapsed)
		const afterMutationsThreadCount = countJsonFiles(join(dir, "threads"));
		const afterMutationsJobCount = countJsonFiles(join(dir, "jobs"));
		assert.equal(
			afterMutationsThreadCount,
			initialThreadCount,
			"Thread files should not have been written yet (debounce window has not elapsed)",
		);
		assert.equal(
			afterMutationsJobCount,
			initialJobCount,
			"Job files should not have been written yet (debounce window has not elapsed)",
		);

		// Wait for debounce
		await wait(700);

		const afterDebounceThreadCount = countJsonFiles(join(dir, "threads"));
		const afterDebounceJobCount = countJsonFiles(join(dir, "jobs"));
		assert.ok(
			afterDebounceThreadCount > initialThreadCount,
			"Thread files should have been written after debounce window elapsed",
		);
		assert.ok(
			afterDebounceJobCount > initialJobCount,
			"Job files should have been written after debounce window elapsed",
		);

		const stats = storage.getStats();
		assert.equal(stats.totalThreads, 3);

		storage.close();
	});

	it("close() flushes pending changes immediately without waiting for debounce", async () => {
		dir = makeTmpDir();
		const storage = await MemoryStorage.create(dir);

		const initialThreadCount = countJsonFiles(join(dir, "threads"));

		storage.upsertThreads([
			{ threadId: "t1", filePath: "/a.txt", fileSize: 100, fileMtime: 1000, cwd: "/proj" },
		]);

		const beforeCloseThreadCount = countJsonFiles(join(dir, "threads"));
		assert.equal(
			beforeCloseThreadCount,
			initialThreadCount,
			"Thread files should not have been written yet (debounce window has not elapsed)",
		);

		storage.close();

		const afterCloseThreadCount = countJsonFiles(join(dir, "threads"));
		assert.ok(
			afterCloseThreadCount > initialThreadCount,
			"Thread files should have been written immediately on close()",
		);

		// Reopen and verify data persisted
		const reopened = await MemoryStorage.create(dir);
		const stats = reopened.getStats();
		assert.equal(stats.totalThreads, 1, "Data should be persisted and readable after close");
		reopened.close();
	});
});

describe("MemoryStorage concurrent job operations", () => {
	let dir: string;

	afterEach(() => {
		if (dir) {
			rmSync(dir, { recursive: true, force: true });
		}
	});

	it("claimStage1Jobs correctly claims pending jobs", async () => {
		dir = makeTmpDir();
		const storage = await MemoryStorage.create(dir);

		// Insert threads (which creates pending jobs)
		storage.upsertThreads([
			{ threadId: "t1", filePath: "/a.txt", fileSize: 100, fileMtime: 1000, cwd: "/proj" },
			{ threadId: "t2", filePath: "/b.txt", fileSize: 200, fileMtime: 2000, cwd: "/proj" },
			{ threadId: "t3", filePath: "/c.txt", fileSize: 300, fileMtime: 3000, cwd: "/proj" },
		]);

		// Claim 2 jobs
		const claimed = storage.claimStage1Jobs("worker-1", 2, 300);
		assert.equal(claimed.length, 2, "Should claim exactly 2 jobs");
		assert.ok(claimed[0].ownershipToken, "Claimed jobs should have ownership token");
		assert.ok(claimed[1].ownershipToken, "Claimed jobs should have ownership token");

		// Try to claim more - should get the remaining 1 pending job
		const claimed2 = storage.claimStage1Jobs("worker-2", 5, 300);
		assert.equal(claimed2.length, 1, "One pending job should still be available");

		// Now all should be claimed - try again, should get none
		const claimed3 = storage.claimStage1Jobs("worker-3", 5, 300);
		assert.equal(claimed3.length, 0, "No more pending jobs should be available");

		storage.close();
	});

	it("completeStage1Job stores output and marks thread done", async () => {
		dir = makeTmpDir();
		const storage = await MemoryStorage.create(dir);

		storage.upsertThreads([
			{ threadId: "t1", filePath: "/a.txt", fileSize: 100, fileMtime: 1000, cwd: "/proj" },
		]);

		// Claim and complete
		const claimed = storage.claimStage1Jobs("worker-1", 1, 300);
		assert.equal(claimed.length, 1);

		const output = JSON.stringify([
			{ category: "architecture", content: "Uses Fastify", confidence: 0.9 },
		]);
		storage.completeStage1Job("t1", output);

		// Verify thread is done
		const thread = storage.getThread("t1");
		assert.ok(thread, "Thread should exist");
		assert.equal(thread.status, "done", "Thread should be marked done");

		// Verify output stored
		const outputs = storage.getStage1Outputs();
		assert.equal(outputs.length, 1, "Should have one output");
		assert.equal(outputs[0].threadId, "t1");
		assert.equal(outputs[0].extractionJson, output);

		storage.close();
	});

	it("failStage1Job marks thread as error", async () => {
		dir = makeTmpDir();
		const storage = await MemoryStorage.create(dir);

		storage.upsertThreads([
			{ threadId: "t1", filePath: "/a.txt", fileSize: 100, fileMtime: 1000, cwd: "/proj" },
		]);

		// Claim and fail
		storage.claimStage1Jobs("worker-1", 1, 300);
		storage.failStage1Job("t1", "LLM timeout");

		const thread = storage.getThread("t1");
		assert.ok(thread, "Thread should exist");
		assert.equal(thread.status, "error", "Thread should be marked error");
		assert.equal(thread.error_message, "LLM timeout", "Thread should have error message");

		storage.close();
	});

	it("getStage1OutputsForCwd filters by cwd", async () => {
		dir = makeTmpDir();
		const storage = await MemoryStorage.create(dir);

		// Threads from different cwds
		storage.upsertThreads([
			{ threadId: "t1", filePath: "/a.txt", fileSize: 100, fileMtime: 1000, cwd: "/proj-a" },
			{ threadId: "t2", filePath: "/b.txt", fileSize: 200, fileMtime: 2000, cwd: "/proj-b" },
		]);

		// Complete both
		const claimed = storage.claimStage1Jobs("worker-1", 2, 300);
		assert.equal(claimed.length, 2);

		storage.completeStage1Job("t1", '{"memories": []}');
		storage.completeStage1Job("t2", '{"memories": ["test"]}');

		// Filter by cwd
		const outputsA = storage.getStage1OutputsForCwd("/proj-a");
		assert.equal(outputsA.length, 1, "Should have one output for proj-a");
		assert.equal(outputsA[0].threadId, "t1");

		const outputsB = storage.getStage1OutputsForCwd("/proj-b");
		assert.equal(outputsB.length, 1, "Should have one output for proj-b");
		assert.equal(outputsB[0].threadId, "t2");

		storage.close();
	});

	it("clearAll removes all data", async () => {
		dir = makeTmpDir();
		const storage = await MemoryStorage.create(dir);

		storage.upsertThreads([
			{ threadId: "t1", filePath: "/a.txt", fileSize: 100, fileMtime: 1000, cwd: "/proj" },
			{ threadId: "t2", filePath: "/b.txt", fileSize: 200, fileMtime: 2000, cwd: "/proj" },
		]);

		const claimed = storage.claimStage1Jobs("worker-1", 1, 300);
		storage.completeStage1Job("t1", '{"memories": []}');

		storage.clearAll();

		const stats = storage.getStats();
		assert.equal(stats.totalThreads, 0, "All threads should be cleared");
		assert.equal(stats.totalStage1Outputs, 0, "All outputs should be cleared");

		storage.close();
	});

	it("clearForCwd removes only data for specified cwd", async () => {
		dir = makeTmpDir();
		const storage = await MemoryStorage.create(dir);

		storage.upsertThreads([
			{ threadId: "t1", filePath: "/a.txt", fileSize: 100, fileMtime: 1000, cwd: "/proj-a" },
			{ threadId: "t2", filePath: "/b.txt", fileSize: 200, fileMtime: 2000, cwd: "/proj-b" },
		]);

		const claimed = storage.claimStage1Jobs("worker-1", 2, 300);
		storage.completeStage1Job("t1", '{"memories": []}');
		storage.completeStage1Job("t2", '{"memories": []}');

		storage.clearForCwd("/proj-a");

		const stats = storage.getStats();
		assert.equal(stats.totalThreads, 1, "Only proj-b thread should remain");
		assert.equal(stats.doneThreads, 1, "Only proj-b should be done");

		const outputs = storage.getStage1Outputs();
		assert.equal(outputs.length, 1, "Only proj-b output should remain");
		assert.equal(outputs[0].threadId, "t2");

		storage.close();
	});

	it("resetAllForCwd resets threads to pending and creates new jobs", async () => {
		dir = makeTmpDir();
		const storage = await MemoryStorage.create(dir);

		storage.upsertThreads([
			{ threadId: "t1", filePath: "/a.txt", fileSize: 100, fileMtime: 1000, cwd: "/proj-a" },
			{ threadId: "t2", filePath: "/b.txt", fileSize: 200, fileMtime: 2000, cwd: "/proj-b" },
		]);

		// Complete t1
		const claimed = storage.claimStage1Jobs("worker-1", 1, 300);
		storage.completeStage1Job("t1", '{"memories": []}');

		// Reset proj-a
		storage.resetAllForCwd("/proj-a");

		const t1 = storage.getThread("t1");
		assert.equal(t1?.status, "pending", "t1 should be reset to pending");

		const t2 = storage.getThread("t2");
		assert.equal(t2?.status, "pending", "t2 should remain pending (from different cwd)");

		const stats = storage.getStats();
		assert.ok(stats.pendingStage1Jobs > 0, "New pending jobs should be created for reset threads");

		storage.close();
	});

	it("phase 2 job claim requires stage1 outputs", async () => {
		dir = makeTmpDir();
		const storage = await MemoryStorage.create(dir);

		// No outputs - should fail
		const result1 = storage.tryClaimGlobalPhase2Job("worker-1", 600);
		assert.equal(result1, null, "Should not claim phase2 without outputs");

		// Add output
		storage.upsertThreads([
			{ threadId: "t1", filePath: "/a.txt", fileSize: 100, fileMtime: 1000, cwd: "/proj" },
		]);
		const claimed = storage.claimStage1Jobs("worker-1", 1, 300);
		storage.completeStage1Job("t1", '{"memories": []}');

		// Now should succeed
		const result2 = storage.tryClaimGlobalPhase2Job("worker-1", 600);
		assert.ok(result2, "Should claim phase2 with outputs available");
		assert.ok(result2.jobId, "Should have job ID");
		assert.ok(result2.ownershipToken, "Should have ownership token");

		storage.close();
	});

	it("upsertThreads skips unchanged threads", async () => {
		dir = makeTmpDir();
		const storage = await MemoryStorage.create(dir);

		// First insert
		const result1 = storage.upsertThreads([
			{ threadId: "t1", filePath: "/a.txt", fileSize: 100, fileMtime: 1000, cwd: "/proj" },
		]);
		assert.equal(result1.inserted, 1);
		assert.equal(result1.skipped, 0);

		// Same data - should skip
		const result2 = storage.upsertThreads([
			{ threadId: "t1", filePath: "/a.txt", fileSize: 100, fileMtime: 1000, cwd: "/proj" },
		]);
		assert.equal(result2.inserted, 0);
		assert.equal(result2.skipped, 1);

		// Changed file size - should update
		const result3 = storage.upsertThreads([
			{ threadId: "t1", filePath: "/a.txt", fileSize: 150, fileMtime: 1000, cwd: "/proj" },
		]);
		assert.equal(result3.inserted, 0);
		assert.equal(result3.updated, 1);

		storage.close();
	});
});
