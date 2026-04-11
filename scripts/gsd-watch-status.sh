#!/usr/bin/env bash
set -euo pipefail

SCRIPT_PATH="$(readlink -f "${BASH_SOURCE[0]}" 2>/dev/null || echo "${BASH_SOURCE[0]}")"
ROOT_DIR="$(cd "$(dirname "$SCRIPT_PATH")/.." && pwd)"
PID_FILE="$ROOT_DIR/.iflow/gsd-watch.pid"
LOG_FILE="$ROOT_DIR/.iflow/gsd-watch.log"

if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "$PID" ]] && kill -0 "$PID" 2>/dev/null; then
    echo "Status: Watcher rodando (PID: $PID)"
    if [[ -f "$LOG_FILE" ]]; then
      echo ""
      echo "Últimas 5 linhas do log:"
      tail -n 5 "$LOG_FILE"
    fi
  else
    echo "Status: Watcher parado (PID file stale)"
  fi
else
  echo "Status: Watcher parado"
fi

if [[ -f "$ROOT_DIR/.iflow/gsd-bridge-manifest.json" ]]; then
  echo ""
  echo "Manifesto do bridge:"
  cat "$ROOT_DIR/.iflow/gsd-bridge-manifest.json"
fi
