#!/usr/bin/env bash
# Wrapper script para update robusto - pode ser chamado de qualquer lugar

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Executar o script de update robusto
exec "$PROJECT_ROOT/update-robust.sh" "$@"