#!/usr/bin/env bash
set -euo pipefail

GSd_DIR="/home/ubuntu/GitHub/forks/gsd-2"
cd "$GSd_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  gsd-pi — Atualização Automática"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Verificar branch atual
CURRENT_BRANCH=$(git branch --show-current)
echo "📌 Branch atual: $CURRENT_BRANCH"
echo ""

# 2. Salvar lista de arquivos modificados localmente (antes do merge)
MODIFIED_BEFORE=$(git diff --name-only HEAD upstream/"$CURRENT_BRANCH" 2>/dev/null || true)

# 3. Fetch do upstream
echo "⬇️  Buscando atualizações do upstream..."
git fetch upstream
echo ""

# 4. Verificar se há novidades
LOCAL=$(git rev-parse @"{0}")
REMOTE=$(git rev-parse "@{upstream}" 2>/dev/null || echo "$LOCAL")
BASE=$(git merge-base @"@{0}" "@{upstream}" 2>/dev/null || echo "$LOCAL")

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "✅ Já está na versão mais recente!"
    echo ""
    gsd --version
    exit 0
fi

echo "🔄 Novos commits detectados — atualizando..."
echo ""

# 5. Tentar merge (com tratamento de conflitos)
if git merge upstream/"$CURRENT_BRANCH" --no-edit 2>&1; then
    echo ""
    echo "✅ Merge concluído com sucesso!"
else
    echo ""
    echo "⚠️  Conflitos detectados durante o merge!"
    echo "    Resolva os conflitos manualmente e depois execute:"
    echo "    git add -A && git commit"
    echo ""
    CONFLICTED=$(git diff --name-only --diff-filter=U 2>/dev/null || true)
    if [ -n "$CONFLICTED" ]; then
        echo "📁 Arquivos com conflito:"
        echo "$CONFLICTED" | sed 's/^/    /'
    fi
    exit 1
fi

# 6. Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install 2>&1 | tail -5
echo ""

# 7. Build
echo "🔨 Fazendo build..."
npm run build 2>&1 | tail -10
echo ""

# 7b. Corrigir caminho do pm2 start-gsd-web.sh
PM2_START_SCRIPT="/home/ubuntu/.gsd/pm2/start-gsd-web.sh"
if [ -f "$PM2_START_SCRIPT" ]; then
    echo "🔧 Atualizando caminho do pm2 start-gsd-web.sh..."
    sed -i "s|PACKAGE_ROOT=.*|PACKAGE_ROOT=/home/ubuntu/GitHub/forks/gsd-2|" "$PM2_START_SCRIPT"
fi
echo ""

# 8. Restart do pm2 gsd-web
echo "🔄 Reiniciando pm2 gsd-web..."
if pm2 describe gsd-web >/dev/null 2>&1; then
    PM2_STATUS=$(pm2 jlist 2>/dev/null | python3 -c "import sys,json; procs=json.load(sys.stdin); gsd=[p for p in procs if p['name']=='gsd-web'][0]; print(gsd['pm2_env']['status'])" 2>/dev/null || echo "unknown")
    if [ "$PM2_STATUS" = "stopped" ]; then
        echo "  ⏸️  gsd-web está parado — iniciando..."
        pm2 start gsd-web 2>&1
    else
        echo "  🔄 gsd-web está rodando — restartando..."
        pm2 restart gsd-web 2>&1
    fi
    echo ""
    # Aguardar e mostrar status
    sleep 2
    pm2 describe gsd-web 2>/dev/null | grep -E "status|restart|uptime" | head -3
else
    echo "  ⚠️  Processo gsd-web não encontrado no pm2 — pulando."
fi
echo ""

# 9. Verificar versão
NEW_VERSION=$(gsd --version 2>/dev/null || echo "desconhecida")
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Atualização concluída!"
echo "  📌 Versão: $NEW_VERSION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
