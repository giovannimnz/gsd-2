/**
 * Migration: Convert legacy agent.db (SQLite via sql.js) to JSON file storage.
 *
 * This is a one-shot migration. Run it once before removing sql.js dependency.
 *
 * Usage:
 *   npx tsx packages/pi-coding-agent/src/resources/extensions/memory/migrate-from-sqlite.ts [path-to-agent.db]
 *
 * If no path is provided, defaults to ~/.gsd/agent.db
 */

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

interface JobRow {
	id: string;
	phase: string;
	thread_id: string | null;
	status: string;
	worker_id: string | null;
	ownership_token: string | null;
	lease_expires_at: string | null;
	error_message: string | null;
	created_at: string;
	updated_at: string;
}

interface ThreadRow {
	thread_id: string;
	file_path: string;
	file_size: number;
	file_mtime: number;
	cwd: string;
	status: string;
	error_message: string | null;
	created_at: string;
	updated_at: string;
}

interface Stage1Row {
	thread_id: string;
	extraction_json: string;
	created_at: string;
}

/**
 * Atomic write: write to temp file, then rename.
 */
function atomicWrite(filePath: string, content: string): void {
	const tempPath = join(tmpdir(), `gsd-migrate-${randomUUID()}.tmp`);
	writeFileSync(tempPath, content, "utf-8");
	renameSync(tempPath, filePath);
}

async function migrate(dbPath: string): Promise<void> {
	if (!existsSync(dbPath)) {
		console.log(`No agent.db found at ${dbPath}. Nothing to migrate.`);
		return;
	}

	console.log(`Migrating SQLite database: ${dbPath}`);

	// Dynamically import sql.js only for migration
	const initSqlJs = (await import("sql.js")).default;
	const SQL = await initSqlJs();
	const buffer = readFileSync(dbPath);
	const db = new SQL.Database(buffer);

	// Determine output directory (same parent as agent.db, but as "memory" dir)
	const parentDir = dirname(dbPath);
	const memoryDir = join(parentDir, "memory");

	// Ensure directories exist
	mkdirSync(join(memoryDir, "jobs"), { recursive: true });
	mkdirSync(join(memoryDir, "threads"), { recursive: true });
	mkdirSync(join(memoryDir, "stage1"), { recursive: true });

	let threadCount = 0;
	let jobCount = 0;
	let stage1Count = 0;

	// Migrate threads
	try {
		const stmt = db.prepare("SELECT * FROM threads");
		while (stmt.step()) {
			const row = stmt.getAsObject() as Record<string, unknown>;
			const thread: ThreadRow = {
				thread_id: (row.thread_id as string) ?? "",
				file_path: (row.file_path as string) ?? "",
				file_size: Number(row.file_size ?? 0),
				file_mtime: Number(row.file_mtime ?? 0),
				cwd: (row.cwd as string) ?? "",
				status: (row.status as string) ?? "pending",
				error_message: (row.error_message as string) ?? null,
				created_at: (row.created_at as string) ?? new Date().toISOString(),
				updated_at: (row.updated_at as string) ?? new Date().toISOString(),
			};
			const filePath = join(memoryDir, "threads", `${thread.thread_id}.json`);
			atomicWrite(filePath, JSON.stringify(thread, null, 2));
			threadCount++;
		}
		stmt.free();
	} catch (err) {
		console.log(`No threads table or read error: ${err instanceof Error ? err.message : err}`);
	}

	// Migrate jobs
	try {
		const stmt = db.prepare("SELECT * FROM jobs");
		while (stmt.step()) {
			const row = stmt.getAsObject() as Record<string, unknown>;
			const job: JobRow = {
				id: (row.id as string) ?? randomUUID(),
				phase: (row.phase as string) ?? "stage1",
				thread_id: (row.thread_id as string) ?? null,
				status: (row.status as string) ?? "pending",
				worker_id: (row.worker_id as string) ?? null,
				ownership_token: (row.ownership_token as string) ?? null,
				lease_expires_at: (row.lease_expires_at as string) ?? null,
				error_message: (row.error_message as string) ?? null,
				created_at: (row.created_at as string) ?? new Date().toISOString(),
				updated_at: (row.updated_at as string) ?? new Date().toISOString(),
			};
			const filePath = join(memoryDir, "jobs", `${job.id}.json`);
			atomicWrite(filePath, JSON.stringify(job, null, 2));
			jobCount++;
		}
		stmt.free();
	} catch (err) {
		console.log(`No jobs table or read error: ${err instanceof Error ? err.message : err}`);
	}

	// Migrate stage1_outputs
	try {
		const stmt = db.prepare("SELECT * FROM stage1_outputs");
		while (stmt.step()) {
			const row = stmt.getAsObject() as Record<string, unknown>;
			const output: Stage1Row = {
				thread_id: (row.thread_id as string) ?? "",
				extraction_json: (row.extraction_json as string) ?? "",
				created_at: (row.created_at as string) ?? new Date().toISOString(),
			};
			const filePath = join(memoryDir, "stage1", `${output.thread_id}.json`);
			atomicWrite(filePath, JSON.stringify(output, null, 2));
			stage1Count++;
		}
		stmt.free();
	} catch (err) {
		console.log(`No stage1_outputs table or read error: ${err instanceof Error ? err.message : err}`);
	}

	db.close();

	console.log(`Migration complete:`);
	console.log(`  Threads: ${threadCount}`);
	console.log(`  Jobs: ${jobCount}`);
	console.log(`  Stage 1 outputs: ${stage1Count}`);
	console.log(`  Output directory: ${memoryDir}`);

	// Rename old database to .migrated backup
	const backupPath = `${dbPath}.migrated`;
	if (!existsSync(backupPath)) {
		renameSync(dbPath, backupPath);
		console.log(`  Old database renamed to: ${backupPath}`);
	} else {
		console.log(`  Backup already exists at: ${backupPath}`);
		console.log(`  You can manually delete ${dbPath} if migration succeeded.`);
	}
}

// CLI entry point
const dbPath = process.argv[2] || join(process.env.HOME || "/tmp", ".gsd", "agent.db");
migrate(dbPath).catch((err) => {
	console.error(`Migration failed: ${err instanceof Error ? err.message : err}`);
	process.exit(1);
});
