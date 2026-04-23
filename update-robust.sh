#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
cd "$PROJECT_ROOT"

# Garantir que o remote upstream existe e aponta para o repo correto
UPSTREAM_URL="https://github.com/gsd-build/gsd-2.git"
if git remote get-url upstream &>/dev/null; then
    CURRENT_URL="$(git remote get-url upstream)"
    if [[ "$CURRENT_URL" != "$UPSTREAM_URL" ]]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Atualizando URL do upstream remote..." >&2
        git remote set-url upstream "$UPSTREAM_URL"
    fi
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Criando upstream remote: $UPSTREAM_URL..." >&2
    git remote add upstream "$UPSTREAM_URL"
fi
git fetch upstream --prune &>/dev/null || true

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

# Função para verificar se há mudanças locais
has_local_changes() {
    if ! git diff --quiet HEAD --; then
        return 0
    fi
    return 1
}

# Função para fazer stash automaticamente
# Só imprime o nome na stdout — todo log vai para stderr
auto_stash() {
    if has_local_changes; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Detectadas mudanças locais não commitadas. Fazendo stash..." >&2
        STASH_NAME="auto-stash-before-update-$(date +%s)"
        if git stash push -m "$STASH_NAME" >/dev/null 2>&1; then
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Stash criado: $STASH_NAME" >&2
            echo "$STASH_NAME"
            return 0
        else
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ ERRO: Falha ao criar stash" >&2
            return 1
        fi
    fi
    echo ""
    return 0
}

# Função para restaurar stash
restore_stash() {
    local stash_name="$1"
    if [ -n "$stash_name" ]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Restaurando stash: $stash_name" >&2
        if git stash pop >/dev/null 2>&1; then
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Stash restaurado com sucesso" >&2
            return 0
        else
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️ AVISO: Falha ao restaurar stash automaticamente. Conflitos podem ter ocorrido." >&2
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️ Verifique manualmente com: git stash list e git stash pop" >&2
            return 1
        fi
    fi
    return 0
}

# Função para resolver conflitos de merge automaticamente (quando possível)
resolve_merge_conflicts() {
    local conflicted_files
    conflicted_files=$(git diff --name-only --diff-filter=U 2>/dev/null || true)

    if [ -z "$conflicted_files" ]; then
        return 0
    fi

    warn "Conflitos detectados nos seguintes arquivos:"
    echo "$conflicted_files" | while read -r file; do
        warn "  - $file"
    done

    # Para arquivos de lock (package-lock.json, yarn.lock, etc.), usar a versão do upstream
    echo "$conflicted_files" | while read -r file; do
        if [[ "$file" == *"lock.json" ]] || [[ "$file" == *"yarn.lock" ]] || [[ "$file" == *"package-lock.json" ]]; then
            log "Usando versão do upstream para: $file"
            git checkout --theirs "$file" 2>/dev/null || true
            git add "$file" 2>/dev/null || true
        fi
    done

    # Verificar se ainda há conflitos
    if git diff --name-only --diff-filter=U | grep -q .; then
        error "Conflitos não resolvidos automaticamente. Abortando."
        git merge --abort 2>/dev/null || true
        return 1
    fi

    # Completar o merge se todos os conflitos foram resolvidos
    if git diff --cached --quiet; then
        log "Nenhuma mudança para commitar após resolução de conflitos"
    else
        log "Completando merge após resolução automática de conflitos..."
        git commit --no-edit 2>/dev/null || true
    fi

    return 0
}

# Função para reiniciar PM2
restart_pm2() {
    if command -v pm2 >/dev/null 2>&1 && pm2 describe gsd-web >/dev/null 2>&1; then
        log "Reiniciando PM2 gsd-web..."
        PM2_STATUS=$(pm2 jlist 2>/dev/null | python3 -c "import sys,json; procs=json.load(sys.stdin); gsd=[p for p in procs if p['name']=='gsd-web'][0]; print(gsd['pm2_env']['status'])" 2>/dev/null || echo "unknown")

        if [ "$PM2_STATUS" = "stopped" ]; then
            pm2 start gsd-web >/dev/null 2>&1
            log "gsd-web iniciado"
        else
            pm2 restart gsd-web >/dev/null 2>&1
            log "gsd-web reiniciado"
        fi

        sleep 2
    fi
}

# Função para mostrar status final
show_final_status() {
    log ""
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "  Status Final"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Versão
    if command -v gsd >/dev/null 2>&1; then
        VERSION=$(gsd --version 2>/dev/null || echo "desconhecida")
        log "Versão: $VERSION"
    fi

    # Status PM2
    if command -v pm2 >/dev/null 2>&1 && pm2 describe gsd-web >/dev/null 2>&1; then
        PM2_STATUS=$(pm2 jlist 2>/dev/null | python3 -c "import sys,json; procs=json.load(sys.stdin); gsd=[p for p in procs if p['name']=='gsd-web'][0]; print(gsd['pm2_env']['status'])" 2>/dev/null || echo "unknown")
        log "PM2 gsd-web: $PM2_STATUS"
    fi

    # Status git
    if has_local_changes; then
        warn "Existem mudanças locais não commitadas"
    else
        log "Git: clean"
    fi

    log ""
    log "🌐 Acesse: http://localhost:34000"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Função principal de update
main() {
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "  gsd-pi — Atualização Robusta Automática"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log ""

    # 1. Verificar branch atual
    CURRENT_BRANCH=$(git branch --show-current)
    log "Branch atual: $CURRENT_BRANCH"

    # 2. Fazer stash se houver mudanças locais
    STASH_NAME=$(auto_stash)
    if [ $? -ne 0 ]; then
        error "Falha ao fazer stash das mudanças locais"
        exit 1
    fi

    # 3. Fetch do upstream
    log "Buscando atualizações do upstream..."
    if ! git fetch upstream >/dev/null 2>&1; then
        error "Falha ao fazer fetch do upstream"
        restore_stash "$STASH_NAME"
        exit 1
    fi
    success "Fetch concluído"

    # 4. Verificar se há novidades
    LOCAL=$(git rev-parse @ 2>/dev/null || echo "HEAD")
    REMOTE=$(git rev-parse "@" 2>/dev/null || echo "$LOCAL")
    BASE=$(git merge-base @ "@{upstream}" 2>/dev/null || echo "$LOCAL")

    if [ "$LOCAL" = "$REMOTE" ]; then
        log "Já está na versão mais recente"
        restore_stash "$STASH_NAME"
        show_final_status
        exit 0
    fi

    log "Novos commits detectados — atualizando..."

    # 5. Tentar merge com tratamento automático de conflitos
    log "Executando merge do upstream/$CURRENT_BRANCH..."
    if git merge "upstream/$CURRENT_BRANCH" --no-edit 2>&1; then
        success "Merge concluído com sucesso"
    else
        warn "Conflitos detectados durante o merge - tentando resolver automaticamente..."
        if ! resolve_merge_conflicts; then
            error "Não foi possível resolver os conflitos automaticamente"
            restore_stash "$STASH_NAME"
            exit 1
        fi
        success "Conflitos resolvidos automaticamente"
    fi

    # 6. Restaurar stash
    if ! restore_stash "$STASH_NAME"; then
        warn "Falha ao restaurar stash. Verifique manualmente."
    fi

    # 7. Instalar dependências
    log "Instalando dependências..."
    if npm install 2>&1 | tail -10; then
        success "Dependências instaladas"
    else
        error "Falha ao instalar dependências"
        exit 1
    fi

    # 8. Build
    log "Executando build..."
    if npm run build 2>&1 | tail -20; then
        success "Build concluído"
    else
        error "Falha no build"
        exit 1
    fi

    # 9. Reiniciar PM2 se estiver rodando
    restart_pm2

    # 10. Mostrar status final
    show_final_status

    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "  ✅ Atualização robusta concluída!"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Capturar sinais de interrupção para garantir que o stash seja restaurado
trap 'error "Script interrompido"; restore_stash "$STASH_NAME"; exit 1' INT TERM

# Executar main
main "$@"
