#!/usr/bin/env bash
#
# sync-fork.sh - Automatically sync this fork with the upstream repository
# Usage: ./scripts/sync-fork.sh [--strategy ours|theirs] [--dry-run]
#
set -euo pipefail

# Resolve repo root: script dir + parent
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

UPSTREAM_URL="${UPSTREAM_URL:-https://github.com/gsd-build/gsd-2.git}"
UPSTREAM_NAME="upstream"
BRANCH="${SYNC_BRANCH:-main}"
STRATEGY="${SYNC_STRATEGY:-theirs}"  # theirs = prefer upstream, ours = prefer fork
DRY_RUN=false
LOCAL_ONLY=false  # local sync only — no commit/push/release (for client machines)

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --strategy) STRATEGY="$2"; shift 2 ;;
    --strategy=*) STRATEGY="${1#*=}"; shift ;;
    --dry-run) DRY_RUN=true; shift ;;
    --local-only) LOCAL_ONLY=true; shift ;;
    --branch) BRANCH="$2"; shift 2 ;;
    --branch=*) BRANCH="${1#*=}"; shift ;;
    -h|--help)
      echo "Usage: $0 [--strategy ours|theirs] [--branch <branch>] [--dry-run] [--local-only]"
      echo ""
      echo "Options:"
      echo "  --strategy    Conflict resolution: 'theirs' (prefer upstream, default) or 'ours' (prefer fork)"
      echo "  --branch      Branch to sync (default: main)"
      echo "  --dry-run     Show what would be done without making changes"
      echo "  --local-only  Local sync only — merge upstream, NO commit/push/release (for client machines)"
      echo ""
      echo "Options:"
      echo "  --strategy   Conflict resolution: 'theirs' (prefer upstream, default) or 'ours' (prefer fork)"
      echo "  --branch     Branch to sync (default: main)"
      echo "  --dry-run    Show what would be done without making changes"
      echo "  -h, --help   Show this help message"
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

cd "$REPO_ROOT"

if [[ "$LOCAL_ONLY" == true ]]; then
    echo "=== GSD-2 Fork Sync (LOCAL ONLY — sem commit/push) ==="
else
    echo "=== GSD-2 Fork Sync (DEV) ==="
fi
echo "Upstream:  $UPSTREAM_URL"
echo "Branch:    $BRANCH"
echo "Strategy:  $STRATEGY (conflict resolution)"
echo "Dry run:   $DRY_RUN"
echo "Local only: $LOCAL_ONLY"
echo ""

# ── Step 1: Add / update upstream remote ────────────────────────────────
if ! git remote | grep -q "^${UPSTREAM_NAME}$"; then
  echo "[1/8] Adding upstream remote: $UPSTREAM_NAME -> $UPSTREAM_URL"
  [[ "$DRY_RUN" == true ]] || git remote add "$UPSTREAM_NAME" "$UPSTREAM_URL"
else
  CURRENT_URL="$(git remote get-url "$UPSTREAM_NAME")"
  echo "[1/8] Upstream remote already exists: $UPSTREAM_NAME -> $CURRENT_URL"
  [[ "$DRY_RUN" == true ]] || git remote set-url "$UPSTREAM_NAME" "$UPSTREAM_URL"
fi

# ── Step 2: Fetch upstream ──────────────────────────────────────────────
echo "[2/8] Fetching from upstream..."
[[ "$DRY_RUN" == true ]] && echo "  (skipped - dry run)" || git fetch "$UPSTREAM_NAME" --prune

# ── Step 3: Checkout target branch ─────────────────────────────────────
CURRENT_BRANCH="$(git branch --show-current)"
if [[ "$CURRENT_BRANCH" != "$BRANCH" ]]; then
  echo "[3/8] Switching to branch: $BRANCH (currently on: $CURRENT_BRANCH)"
  [[ "$DRY_RUN" == true ]] && echo "  (skipped - dry run)" || git checkout "$BRANCH"
else
  echo "[3/8] Already on branch: $BRANCH"
fi

# ── Step 4: Pull latest from origin ─────────────────────────────────────
echo "[4/8] Pulling latest from origin (skipped in local-only mode)..."
if [[ "$DRY_RUN" == true ]]; then
  echo "  (skipped - dry run)"
else
  # Check for local changes and stash if needed
  if ! git diff --quiet HEAD -- ':!.gsd/' 2>/dev/null; then
    STASH_NAME="auto-stash-before-sync-$(date +%s)"
    echo "  Local changes detected, stashing as \"$STASH_NAME\"..."
    git stash push -m "$STASH_NAME" -- ':!.gsd/' 2>/dev/null || git stash push -m "$STASH_NAME" 2>/dev/null
    STASHED=true
  fi
  git pull origin "$BRANCH" --no-rebase || {
    echo "ERROR: Failed to pull from origin. Resolve conflicts first."
    [[ "${STASHED:-false}" == true ]] && git stash pop 2>/dev/null || true
    exit 1
  }
  if [[ "${STASHED:-false}" == true ]]; then
    echo "  Restoring stashed changes..."
    git stash pop 2>/dev/null || echo "  WARNING: Could not restore stash automatically"
  fi
fi

# ── Step 5: Merge from upstream ─────────────────────────────────────────
echo "[5/8] Merging upstream/$BRANCH into $BRANCH..."
if [[ "$DRY_RUN" == true ]]; then
  echo "  (skipped - dry run)"
else
  MERGE_OUTPUT="$(git merge "$UPSTREAM_NAME/$BRANCH" --no-edit -X "$STRATEGY" 2>&1)" || {
    echo ""
    echo "WARNING: Merge had conflicts. Resolving automatically..."
    # Auto-resolve delete/modify conflicts by keeping ours (fork version)
    for file in $(git diff --name-only --diff-filter=UD 2>/dev/null); do
      echo "  Keeping fork version of: $file"
      git checkout --ours "$file" 2>/dev/null || git rm "$file" 2>/dev/null
      git add "$file" 2>/dev/null || true
    done
    # Also handle package.json conflicts - keep our fork version
    if git diff --name-only --diff-filter=U 2>/dev/null | grep -q "^package.json$"; then
      echo "  Keeping fork package.json..."
      git checkout --ours package.json 2>/dev/null
      git add package.json 2>/dev/null || true
    fi
    if git diff --name-only --diff-filter=U 2>/dev/null | grep -q "^package-lock.json$"; then
      echo "  Keeping fork package-lock.json..."
      git checkout --ours package-lock.json 2>/dev/null
      git add package-lock.json 2>/dev/null || true
    fi
    if ! git diff --name-only --diff-filter=U 2>/dev/null | grep -q .; then
      echo "  All conflicts auto-resolved. Completing merge..."
      git commit --no-edit 2>/dev/null || {
        echo "ERROR: Could not complete merge commit"
        exit 1
      }
    else
      REMAINING=$(git diff --name-only --diff-filter=U | tr '\n' ' ')
      echo "WARNING: Remaining conflicts: $REMAINING"
      echo "Please resolve manually: git add <files> && git merge --continue"
      exit 1
    fi
  }
  echo "  $MERGE_OUTPUT"
fi

# ── Step 6: Restore fork-specific customizations ─────────────────────────
echo ""
echo "[6/8] Restoring fork customizations..."
if [[ "$DRY_RUN" == true ]]; then
  echo "  (skipped - dry run)"
else
  # ── Protected path 1: scripts/vpn-access/ ──────────────────────────
  if [[ -d "scripts/vpn-access" ]]; then
    echo "  Checking scripts/vpn-access/..."
    if git ls-files --error-unmatch "scripts/vpn-access/" &>/dev/null; then
      echo "  OK: scripts/vpn-access/ is tracked"
    else
      echo "  WARNING: scripts/vpn-access/ was deleted by merge! Restoring from git..."
      git checkout HEAD -- "scripts/vpn-access/" 2>/dev/null || echo "  Could not restore — not in our history"
    fi
  fi

  # ── Protected path 2: scripts/pm2/ ─────────────────────────────────
  if [[ -d "scripts/pm2" ]]; then
    echo "  Checking scripts/pm2/..."
    if git ls-files --error-unmatch "scripts/pm2/" &>/dev/null; then
      echo "  OK: scripts/pm2/ is tracked"
    else
      echo "  WARNING: scripts/pm2/ was deleted by merge! Restoring from git..."
      git checkout HEAD -- "scripts/pm2/" 2>/dev/null || echo "  Could not restore — not in our history"
    fi
  fi

  # ── Protected path 3: web/proxy.ts ─────────────────────────────────
  if [[ -f "web/proxy.ts" ]]; then
    echo "  Checking web/proxy.ts..."
    if git ls-files --error-unmatch "web/proxy.ts" &>/dev/null; then
      echo "  OK: web/proxy.ts is tracked"
    else
      echo "  WARNING: web/proxy.ts was deleted by merge! Restoring from git..."
      git checkout HEAD -- "web/proxy.ts" 2>/dev/null || echo "  Could not restore — not in our history"
    fi
  fi

  # ── Protected path 4: custom skills/ ───────────────────────────────
  if [[ -d "skills" ]]; then
    echo "  Checking skills/..."
    if git ls-files --error-unmatch "skills/" &>/dev/null; then
      echo "  OK: skills/ is tracked"
    else
      echo "  WARNING: skills/ was deleted by merge! Restoring from git..."
      git checkout HEAD -- "skills/" 2>/dev/null || echo "  Could not restore — not in our history"
    fi
  fi

  # ── Protected path 5: .gsd/ dir (local state, should never sync) ──
  if [[ -d ".gsd" ]]; then
    echo "  .gsd/ is protected and will not be touched"
  fi

  # ── Commit restored overrides if anything changed ───────────────────
  if git diff --cached --quiet 2>/dev/null; then
    echo "  All fork customizations intact, no changes needed."
  else
    echo "  Committing restored fork customizations..."
    git commit -m "chore: restore fork customizations after upstream merge" 2>/dev/null || true
  fi
fi

# ── Step 7: Bump fork version ──────────────────────────────────────────
echo "[7/8] Bumping fork version..."
if [[ "$DRY_RUN" == true ]]; then
  echo "  (skipped - dry run)"
else
  if command -v node &> /dev/null; then
    NODE_CMD="node"
  else
    echo "  WARNING: node not found, skipping version bump"
    NODE_CMD=""
  fi
  if [[ -n "$NODE_CMD" ]]; then
    CURRENT_VERSION="$(node -p "require('./package.json').version" 2>/dev/null || echo "unknown")"
    echo "  Current version: $CURRENT_VERSION"
    $NODE_CMD scripts/version-bump.mjs 2>&1 || echo "  WARNING: version bump failed"
    NEW_VERSION="$(node -p "require('./package.json').version" 2>/dev/null || echo "unknown")"
    if [[ "$NEW_VERSION" != "$CURRENT_VERSION" ]]; then
      echo "  Version bumped: $CURRENT_VERSION -> $NEW_VERSION"
      git add package.json
      git commit -m "chore: bump version to $NEW_VERSION after upstream sync" 2>/dev/null || true
    else
      echo "  Version unchanged, no bump needed"
    fi
  fi
fi

# ── Step 8: Push to origin ─────────────────────────────────────────────
echo "[8/8] Pushing to origin..."
if [[ "$DRY_RUN" == true ]]; then
  echo "  (skipped - dry run)"
else
  # Check if there's anything to push
  BEHIND="$(git rev-list --count "origin/$BRANCH..HEAD" 2>/dev/null || echo "0")"
  if [[ "$BEHIND" -eq 0 ]]; then
    echo "  Already up to date, nothing to push."
  else
    echo "  Pushing $BEHIND commit(s) to origin/$BRANCH..."
    git push origin "$BRANCH"
  fi
fi

if [[ "$LOCAL_ONLY" == true ]]; then
    echo ""
    echo "=== Sync local completo (sem commit/push) ==="
    echo "Máquina CLIENTE — mudanças mantidas localmente."
    echo "Para fazer release, use a máquina DEV: npm run release"
else
    echo ""
    echo "=== Sync completo! ==="
fi
if [[ "$DRY_RUN" == true ]]; then
  echo "(Dry run - no changes were made)"
fi
