# Fork Sync Workflow (Upstream → Fork → Custom Branch)

Use this when you maintain a personal fork of `gsd-2` and want to keep pulling upstream updates **without losing your own development branch**.

## What this solves

Typical local setup:

- `upstream` → `https://github.com/gsd-build/gsd-2.git`
- `origin` → your fork
- local `main` tracks upstream
- local custom branch (example: `custom/meu-trabalho`) carries your changes

This workflow automates:

1. `fetch` from `upstream` (and `origin`)
2. sync local `main` from `upstream/main`
3. replay your custom branch on top of updated `main`
4. optional automatic merge of custom branch back into base branch
5. optional push to your fork
6. optional rebuild (important if your global `gsd` points to your local fork build)

---

## Script

File:

- `scripts/sync-fork-upstream.js`

NPM shortcuts:

- `npm run update` *(default command, auto-merge + build; if no custom branch is provided/inferred, it syncs only `main` and continues)*
- `npm run fork:sync` *(auto-merge, sem build)*
- `npm run fork:sync:build` *(auto-merge + build)*
- `npm run fork:sync:no-merge`
- `npm run fork:sync:no-merge:build`

---

## One-time remote setup

```bash
git remote -v
```

Expected remotes:

```bash
git remote add upstream https://github.com/gsd-build/gsd-2.git
# origin should already point to your fork
```

---

## Recommended usage

### 1) Preview first (dry run)

```bash
npm run update -- --custom-branch custom/meu-trabalho --dry-run
```

### 2) Execute sync + auto-merge + push + rebuild

```bash
npm run update -- --custom-branch custom/meu-trabalho --push
```

This will:

- rebase `main` on `upstream/main` (default base mode)
- rebase `custom/meu-trabalho` on `main` (default custom mode)
- if all steps succeed, merge `custom/meu-trabalho` back into `main`
- push both branches to `origin`
- run `npm run build`

---

## Common options

```bash
--custom-branch <name>   # branch to keep your custom work
--base-branch <name>     # default: main
--upstream <name>        # default: upstream
--origin <name>          # default: origin
--base-mode rebase|merge # default: rebase
--custom-mode rebase|merge
--auto-merge             # if sync succeeds, merge custom branch into base
--push-main              # push base branch
--push-custom            # push custom branch
--push                   # push both
--build                  # run npm run build at end
--dry-run                # print commands only
--allow-dirty            # bypass clean-tree check (not recommended)
--no-restore-branch      # keep HEAD on last touched branch
```

---

## Safety behavior

- Requires git repository.
- Fails if `upstream` remote is missing.
- Fails on dirty working tree by default (prevents accidental rebases with local edits).
- With `--allow-dirty`, rebase mode uses git `--autostash` for tracked changes.
- Uses `--force-with-lease` for pushing custom branch when rebased.
- If `--auto-merge` is set but no custom branch exists (provided or inferred), the script logs and continues with base sync only.
- Auto-merge only runs after all prior steps pass; if merge has conflicts, the script stops immediately.

---

## Notes for linked local installs

If your global CLI is symlinked to this local repo build (for example via `npm link`), keep in mind:

- `gsd` executes this repo's `dist/loader.js`
- after upstream sync, run with `--build` (or run `npm run build` manually)

So your runtime matches updated source.
