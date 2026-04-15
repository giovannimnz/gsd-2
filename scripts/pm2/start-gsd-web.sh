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

export NODE_ENV=production
export HOSTNAME=localhost
export PORT=34000
export GSD_WEB_DAEMON_MODE=1
export GSD_WEB_PACKAGE_ROOT="$PACKAGE_ROOT"
export GSD_WEB_ALLOWED_ORIGINS="${GSD_WEB_ALLOWED_ORIGINS:-https://gsd.atius.com.br}"
export GSD_VERSION="$($NODE_BIN -p "require('$PACKAGE_ROOT/package.json').version")"

# Avoid "Server login misconfigured" when login password is set without session token.
if [ -n "${GSD_WEB_LOGIN_PASSWORD:-}" ] && [ -z "${GSD_WEB_LOGIN_SESSION_TOKEN:-}" ]; then
  export GSD_WEB_LOGIN_SESSION_TOKEN="$(printf '%s' "${GSD_WEB_LOGIN_PASSWORD}:${HOSTNAME}:${PORT}" | sha256sum | awk '{print $1}')"
fi

cd "$STANDALONE_DIR"
mkdir -p /home/ubuntu/.gsd 2>/dev/null || true
printf '%s\n' "$$" > /home/ubuntu/.gsd/web-server.pid
printf 'GSD version: v%s\n' "$GSD_VERSION"
exec "$NODE_BIN" server.js
