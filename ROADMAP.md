# ROADMAP

## M002: Markdown Storage Backend

**Goal:** Add configurable storage backend — SQLite (default) or 100% Markdown files. Enable `storage_backend: markdown` in PREFERENCES.md to run GSD-2 without any `.db` files.

- [ ] 1. Abstract persistence layer — StorageBackend interface with SQLiteStorage and MarkdownStorage
- [ ] 2. Rewrite gsd-db.ts — CRUD operations in JSON/MD instead of SQL
- [ ] 3. Rewrite unit-ownership.ts — file locking instead of SQLite
- [ ] 4. Rewrite memory/storage.ts — JSON files instead of sql.js
- [ ] 5. Rewrite all db-tools.ts — operations on .md files
- [ ] 6. Rewrite workflow-tool-executors.ts — fallback to .md when DB unavailable
- [ ] 7. Add PREFERENCES.md config — storage_backend: sqlite | markdown
