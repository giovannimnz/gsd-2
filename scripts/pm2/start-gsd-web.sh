#!/usr/bin/env bash
set -Eeuo pipefail

# Auto-detect Node.js binary
NODE_BIN=$(which node)
PACKAGE_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
STANDALONE_DIR="$PACKAGE_ROOT/dist/web/standalone"

# Verify standalone directory exists
if [ ! -d "$STANDALONE_DIR" ]; then
  echo "ERROR: Standalone directory not found: $STANDALONE_DIR"
  echo "Please run 'npm run build' first."
  exit 1
fi

# Load .env.local if exists (for login credentials and project path)
if [ -f "$PACKAGE_ROOT/.env.local" ]; then
  set -a
  source "$PACKAGE_ROOT/.env.local"
  set +a
fi

export NODE_ENV=production
export HOSTNAME="${GSD_WEB_HOST:-localhost}"
export PORT="${GSD_WEB_PORT:-34000}"
export GSD_WEB_PORT="${PORT:-34000}"
export GSD_WEB_HOST="${HOSTNAME:-localhost}"
export GSD_WEB_DAEMON_MODE=1
export GSD_WEB_PACKAGE_ROOT="$PACKAGE_ROOT"
export GSD_WEB_ALLOWED_ORIGINS="${GSD_WEB_ALLOWED_ORIGINS:-http://localhost:34000}"
export GSD_VERSION="$($NODE_BIN -p "require('$PACKAGE_ROOT/package.json').version")"

# Note: Session token auto-generation removed to ensure login screen appears.
# Login screen will be shown when credentials are configured, requiring proper authentication.
# This prevents unauthorized access even when GSD_WEB_LOGIN_PASSWORD is set.

cd "$STANDALONE_DIR"
mkdir -p "$HOME/.gsd" 2>/dev/null || true
printf '%s\n' "$$" > "$HOME/.gsd/web-server.pid"
printf 'GSD version: v%s\n' "$GSD_VERSION"
exec "$NODE_BIN" server.js
