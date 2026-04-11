#!/usr/bin/env bash
set -euo pipefail

SCRIPT_PATH="$(readlink -f "${BASH_SOURCE[0]}" 2>/dev/null || echo "${BASH_SOURCE[0]}")"
ROOT_DIR="$(cd "$(dirname "$SCRIPT_PATH")/.." && pwd)"
PID_FILE="$ROOT_DIR/.iflow/gsd-watch.pid"
LOG_FILE="$ROOT_DIR/.iflow/gsd-watch.log"

if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "$PID" ]] && kill -0 "$PID" 2>/dev/null; then
    echo "Watcher já está rodando (PID: $PID)"
    exit 0
  else
    rm -f "$PID_FILE"
  fi
fi

echo "Iniciando GSD watcher..."
nohup node "$ROOT_DIR/scripts/gsd-watch-sync.mjs" > "$LOG_FILE" 2>&1 &
PID=$!
echo $PID > "$PID_FILE"
sleep 1

if kill -0 "$PID" 2>/dev/null; then
  echo "Watcher iniciado (PID: $PID)"
  echo "Log: $LOG_FILE"
else
  echo "Erro: watcher falhou ao iniciar"
  rm -f "$PID_FILE"
  exit 1
fi
