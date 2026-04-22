#!/usr/bin/env bash
#
# release.sh - Full automated release for gsd-2 fork
#
# Flow: version-bump → commit → tag → push → CI handles GitHub Release + npm publish
#
# Usage:
#   ./scripts/release.sh              # full release
#   ./scripts/release.sh --dry-run    # show what would happen
#   ./scripts/release.sh --npm-only   # skip git operations, npm publish only
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

DRY_RUN=false
NPM_ONLY=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    --npm-only) NPM_ONLY=true; shift ;;
    -h|--help)
      echo "Usage: $0 [--dry-run] [--npm-only]"
      echo ""
      echo "Options:"
      echo "  --dry-run    Show what would be done without making changes"
      echo "  --npm-only   Skip git operations, npm publish only"
      echo "  -h, --help   Show this help message"
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

cd "$REPO_ROOT"

echo "=== GSD-2 Release ==="
echo "Dry run:   $DRY_RUN"
echo "npm only:  $NPM_ONLY"
echo ""

# Step 1: Version bump
echo "[1/4] Bumping version..."
if [[ "$DRY_RUN" == true ]]; then
  node scripts/version-bump.mjs --check
else
  node scripts/version-bump.mjs
  NEW_VERSION="$(node -p "require('./package.json').version")"
  echo "Version bumped to: $NEW_VERSION"
fi

if [[ "$NPM_ONLY" == true ]]; then
  echo ""
  echo "[2/2] Publishing to npm..."
  if [[ "$DRY_RUN" == true ]]; then
    echo "  (skipped - dry run)"
  else
    npm publish --access public
  fi
  echo ""
  echo "=== Release complete! ==="
  exit 0
fi

# Step 2: Commit version bump
echo "[2/4] Committing version bump..."
if [[ "$DRY_RUN" == true ]]; then
  echo "  (skipped - dry run)"
else
  git add package.json
  NEW_VERSION="$(node -p "require('./package.json').version")"
  git commit -m "chore: bump version to $NEW_VERSION"
  echo "Committed."
fi

# Step 3: Create and push tag
echo "[3/4] Creating git tag..."
if [[ "$DRY_RUN" == true ]]; then
  echo "  (skipped - dry run)"
else
  NEW_VERSION="$(node -p "require('./package.json').version")"
  TAG="v${NEW_VERSION}"
  
  # Check if tag exists
  if git tag -l "$TAG" | grep -q "$TAG"; then
    echo "Tag $TAG already exists!"
    exit 1
  fi
  
  git tag -a "$TAG" -m "Release $NEW_VERSION"
  echo "Tag created: $TAG"
fi

# Step 4: Push to origin
echo "[4/4] Pushing to origin..."
if [[ "$DRY_RUN" == true ]]; then
  echo "  (skipped - dry run)"
else
  git push origin main
  NEW_VERSION="$(node -p "require('./package.json').version")"
  TAG="v${NEW_VERSION}"
  git push origin "$TAG"
  echo "Pushed main and $TAG to origin."
fi

echo ""
echo "=== Release initiated! ==="
echo ""
if [[ "$DRY_RUN" == true ]]; then
  echo "(Dry run - no changes were made)"
  echo ""
  echo "To execute for real, run: $0"
else
  NEW_VERSION="$(node -p "require('./package.json').version")"
  echo "Git push complete. GitHub Actions will now:"
  echo "  1. Create GitHub Release for v${NEW_VERSION}"
  echo "  2. Publish to npm (requires NPM_TOKEN secret)"
  echo ""
  echo "Monitor at: https://github.com/giovannimnz/gsd-2/actions"
fi
