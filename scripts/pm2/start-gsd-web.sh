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
export HOSTNAME=127.0.0.1
export PORT=1027
export GSD_WEB_DAEMON_MODE=1
export GSD_WEB_PACKAGE_ROOT="$PACKAGE_ROOT"
export GSD_WEB_ALLOWED_ORIGINS="${GSD_WEB_ALLOWED_ORIGINS:-https://gsd.atius.com.br}"
export GSD_VERSION="$($NODE_BIN -p "require('$PACKAGE_ROOT/package.json').version")"

cd "$STANDALONE_DIR"
mkdir -p /home/ubuntu/.gsd 2>/dev/null || true
printf '%s\n' "$$" > /home/ubuntu/.gsd/web-server.pid
printf 'GSD version: v%s\n' "$GSD_VERSION"
exec "$NODE_BIN" server.js
