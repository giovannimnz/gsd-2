#!/usr/bin/env bash
#
# update.sh — Sincronização local (MÁQUINA CLIENTE)
#
# Faz merge do upstream, protege customizações, mantém mudanças locais.
# NÃO faz commit, push ou release — isso é função da máquina DEV.
#
# Uso:
#   bash update.sh               # sincroniza e mantém tudo local
#   bash update.sh --dry-run     # preview sem fazer mudanças
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
cd "$PROJECT_ROOT"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2
}
error() {
    echo "❌ [$(date '+%Y-%m-%d %H:%M:%S')] ERRO: $*" >&2
}
warn() {
    echo "⚠️  [$(date '+%Y-%m-%d %H:%M:%S')] AVISO: $*" >&2
}
success() {
    echo "✅ [$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2
}

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
fi

# ── Garantir que o remote upstream existe ──────────────────────────────
UPSTREAM_URL="https://github.com/gsd-build/gsd-2.git"
UPSTREAM_NAME="upstream"
BRANCH="$(git branch --show-current)"

if git remote get-url "$UPSTREAM_NAME" &>/dev/null; then
    CURRENT_URL="$(git remote get-url "$UPSTREAM_NAME")"
    if [[ "$CURRENT_URL" != "$UPSTREAM_URL" ]]; then
        log "Atualizando URL do upstream remote..."
        git remote set-url "$UPSTREAM_NAME" "$UPSTREAM_URL"
    fi
else
    log "Criando upstream remote: $UPSTREAM_URL..."
    git remote add "$UPSTREAM_NAME" "$UPSTREAM_URL"
fi

if [[ "$DRY_RUN" == true ]]; then
    log "DRY RUN — apenas preview"
fi

echo ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "  gsd-2 — Sincronização Local (CLIENTE)"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log ""
log "Branch: $BRANCH"
log "Upstream: $UPSTREAM_URL"
[[ "$DRY_RUN" == true ]] && log "(DRY RUN ativo — sem mudanças)"
log ""

# ── Step 1: Fetch upstream ───────────────────────────────────────────
log "[1/4] Buscando atualizações do upstream..."
[[ "$DRY_RUN" == true ]] && log "  (dry-run: pulado)" || {
    git fetch "$UPSTREAM_NAME" --prune >/dev/null 2>&1 || {
        error "Falha ao buscar upstream"
        exit 1
    }
}
success "Fetch concluído"

# ── Step 2: Verificar se há novidades ───────────────────────────────
log "[2/4] Verificando commits novos..."
LOCAL_SHA="$(git rev-parse HEAD 2>/dev/null || echo "")"
UPSTREAM_SHA="$(git rev-parse "$UPSTREAM_NAME/$BRANCH" 2>/dev/null || echo "")"

if [[ -z "$UPSTREAM_SHA" ]]; then
    warn "Não foi possível ler upstream/$BRANCH — continuando mesmo assim"
elif [[ "$LOCAL_SHA" == "$UPSTREAM_SHA" ]]; then
    log "Já está na versão mais recente do upstream"
    echo ""
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "  ✅ Nada a fazer — upstream atualizado"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 0
else
    COUNT=$(git log --oneline HEAD.."$UPSTREAM_NAME/$BRANCH" 2>/dev/null | wc -l)
    log "Upstream tem $COUNT commit(s) novo(s)"
fi

# ── Step 3: Merge do upstream com resolução automática ─────────────────
log "[3/4] Mergeando upstream/$BRANCH → local..."
[[ "$DRY_RUN" == true ]] && log "  (dry-run: pulado)" || {
    MERGE_RESULT="$(git merge "$UPSTREAM_NAME/$BRANCH" --no-edit -X theirs 2>&1)" || {

        # Houve conflitos — tentar resolver automaticamente
        warn "Conflitos detectados — resolvendo automaticamente..."

        # Para lock files, usar a versão do upstream
        for file in $(git diff --name-only --diff-filter=U 2>/dev/null || true); do
            if [[ "$file" == *"lock.json" ]] || [[ "$file" == *"package-lock.json" ]]; then
                log "  lock file: usando versão upstream para $file"
                git checkout --theirs "$file" 2>/dev/null || true
                git add "$file" 2>/dev/null || true
            fi
        done

        # Se ainda há conflitos, aborta
        if git diff --name-only --diff-filter=U 2>/dev/null | grep -q .; then
            REMAINING=$(git diff --name-only --diff-filter=U | tr '\n' ' ')
            error "Conflitos não resolvidos: $REMAINING"
            git merge --abort 2>/dev/null || true
            exit 1
        fi

        # Completar merge
        git commit --no-edit 2>/dev/null || true
        success "Conflitos resolvidos e merge completo"
    }

    # Se merge foi automático (sem conflitos)
    if [[ -z "$MERGE_RESULT" ]] || echo "$MERGE_RESULT" | grep -qi "already up to date\|Merge made\|já está"; then
        success "Merge concluído"
    fi
}

# ── Step 4: Proteger customizações do fork ───────────────────────────
log "[4/4] Verificando customizações do fork..."

PROTECTED_OK=true

check_protected() {
    local path="$1"
    local desc="$2"
    if [[ -e "$path" ]]; then
        if git ls-files --error-unmatch "$path" &>/dev/null; then
            log "  OK: $desc ($path)"
        else
            log "  Restaurando: $desc (deletado pelo merge)"
            git checkout HEAD -- "$path" 2>/dev/null || {
                warn "  Não foi possível restaurar $path"
                PROTECTED_OK=false
            }
        fi
    fi
}

check_protected "scripts/vpn-access"   "vpn-access scripts"
check_protected "scripts/pm2"         "PM2 ecosystem configs"
check_protected "web/proxy.ts"         "web proxy"
check_protected "skills"               "custom skills"
[[ -d ".gsd" ]] && log "  OK: .gsd/ (protegido — nunca sincronizado)"

# Restaurar qualquer stash pendente
if git stash list 2>/dev/null | grep -q .; then
    log "Restaurando stash local..."
    git stash pop 2>/dev/null || warn "Stash não pôde ser restaurado automaticamente"
fi

echo ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "  ✅ Sincronização local concluída"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log ""
log "Próximos passos:"
log "  1. Revise as mudanças: git diff HEAD~1"
log "  2. Para fazer release (DEV machine): npm run release"
log "  3. Para CI/CD: o workflow GitHub Actions faz commit + push + release"
log ""
