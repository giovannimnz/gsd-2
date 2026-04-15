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
if npm run build 2>&1 | tail -20; then
    echo ""
    echo "✅ Build concluído com sucesso!"
else
    echo ""
    echo "❌ Build falhou!"
    echo "   Verifique os erros acima e tente novamente."
    exit 1
fi
echo ""

# 7b. Verificar scripts PM2 (usados direto do git clone)
PM2_DIR="$GSd_DIR/scripts/pm2"
if [ -d "$PM2_DIR" ]; then
    echo "🔧 Verificando scripts PM2..."
    
    # Tornar script executável
    chmod +x "$PM2_DIR/start-gsd-web.sh" 2>/dev/null || true
    
    echo "  ✅ PM2 usa scripts do git clone (nada copiado para fora)"
else
    echo "ℹ️  Scripts PM2 não encontrados"
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

# 9. Verificar versão e status final
echo ""
echo "🔍 Verificando status..."
echo ""

# Verificar se gsd está disponível
if command -v gsd >/dev/null 2>&1; then
    NEW_VERSION=$(gsd --version 2>/dev/null || echo "desconhecida")
else
    NEW_VERSION="não instalado globalmente"
fi

# Verificar status do PM2
PM2_STATUS_INFO=""
if command -v pm2 >/dev/null 2>&1; then
    if pm2 describe gsd-web >/dev/null 2>&1; then
        PM2_STATUS=$(pm2 jlist 2>/dev/null | python3 -c "import sys,json; procs=json.load(sys.stdin); gsd=[p for p in procs if p['name']=='gsd-web'][0]; print(gsd['pm2_env']['status'])" 2>/dev/null || echo "unknown")
        PM2_STATUS_INFO="gsd-web: $PM2_STATUS"
    else
        PM2_STATUS_INFO="gsd-web: não configurado"
    fi
else
    PM2_STATUS_INFO="PM2 não instalado"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Atualização concluída!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📌 Versão: $NEW_VERSION"
echo "🖥️  PM2: $PM2_STATUS_INFO"
echo ""
echo "🌐 Acesse: http://localhost:34000"
echo ""
echo "💡 Comandos úteis:"
echo "   pm2 status           # Ver status do serviço"
echo "   pm2 logs gsd-web     # Ver logs"
echo "   npm run update       # Atualizar novamente"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
