#!/usr/bin/env bash
set -euo pipefail

SCRIPT_PATH="$(readlink -f "${BASH_SOURCE[0]}" 2>/dev/null || echo "${BASH_SOURCE[0]}")"
ROOT_DIR="$(cd "$(dirname "$SCRIPT_PATH")/.." && pwd)"
PID_FILE="$ROOT_DIR/.iflow/gsd-watch.pid"

if [[ ! -f "$PID_FILE" ]]; then
  echo "Watcher não está rodando"
  exit 0
fi

PID="$(cat "$PID_FILE" 2>/dev/null || true)"
if [[ -z "$PID" ]]; then
  echo "PID file vazio, removendo..."
  rm -f "$PID_FILE"
  exit 0
fi

if kill -0 "$PID" 2>/dev/null; then
  echo "Parando watcher (PID: $PID)..."
  kill "$PID" 2>/dev/null || true
  sleep 1
  if kill -0 "$PID" 2>/dev/null; then
    echo "Forçando parada..."
    kill -9 "$PID" 2>/dev/null || true
  fi
  echo "Watcher parado"
else
  echo "Watcher não está rodando"
fi

rm -f "$PID_FILE"
