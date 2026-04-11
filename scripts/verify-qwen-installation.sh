#!/bin/bash
# Script completo para verificar instalação do Qwen Code provider

echo "═══════════════════════════════════════════════════════════"
echo "  Verificação da Instalação Qwen Code Provider"
echo "═══════════════════════════════════════════════════════════"
echo

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# 1. Verificar build
echo "1️⃣  Verificando build do provider..."
if [ -f "packages/pi-ai/dist/providers/qwen-code.js" ]; then
    echo -e "${GREEN}✓${NC} Provider compilado"
else
    echo -e "${RED}✗${NC} Provider não compilado"
    echo "   Execute: npm run build:pi-ai"
    ERRORS=$((ERRORS+1))
fi

# 2. Verificar registro
echo
echo "2️⃣  Verificando registro no register-builtins..."
if grep -q "qwen-code" packages/pi-ai/dist/providers/register-builtins.js 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Provider registrado"
else
    echo -e "${RED}✗${NC} Provider não registrado"
    ERRORS=$((ERRORS+1))
fi

# 3. Verificar instalação global
echo
echo "3️⃣  Verificando instalação global..."
if command -v gsd &> /dev/null; then
    echo -e "${GREEN}✓${NC} GSD instalado: $(gsd --version 2>/dev/null || echo 'unknown')"
else
    echo -e "${RED}✗${NC} GSD não encontrado no PATH"
    ERRORS=$((ERRORS+1))
fi

# 4. Verificar provider no global
echo
echo "4️⃣  Verificando provider na instalação global..."
GLOBAL_PATH=$(npm root -g)/gsd-pi
if [ -f "$GLOBAL_PATH/packages/pi-ai/dist/providers/qwen-code.js" ]; then
    echo -e "${GREEN}✓${NC} Provider no global install"
else
    echo -e "${YELLOW}⚠${NC} Provider pode estar desatualizado no global"
    echo "   Execute: npm install -g --force ."
fi

# 5. Verificar models.json
echo
echo "5️⃣  Verificando models.json..."
if [ -f ~/.gsd/agent/models.json ]; then
    if grep -q '"providers"' ~/.gsd/agent/models.json 2>/dev/null; then
        echo -e "${GREEN}✓${NC} models.json tem seção 'providers'"
    else
        echo -e "${RED}✗${NC} models.json FALTANDO seção 'providers'"
        echo "   Execute: ./scripts/fix-qwen-models.sh"
        ERRORS=$((ERRORS+1))
    fi
    
    if grep -q "qwen3.6-plus" ~/.gsd/agent/models.json 2>/dev/null; then
        echo -e "${GREEN}✓${NC} qwen3.6-plus configurado"
    else
        echo -e "${RED}✗${NC} qwen3.6-plus não encontrado"
        ERRORS=$((ERRORS+1))
    fi
else
    echo -e "${RED}✗${NC} models.json não existe"
    echo "   Execute: ./scripts/fix-qwen-models.sh"
    ERRORS=$((ERRORS+1))
fi

# 6. Verificar qwen CLI
echo
echo "6️⃣  Verificando Qwen CLI..."
if command -v qwen &> /dev/null; then
    echo -e "${GREEN}✓${NC} Qwen CLI instalado"
else
    echo -e "${YELLOW}⚠${NC} Qwen CLI não encontrado"
    echo "   Execute: npm install -g @qwen-code/qwen-code"
fi

echo
echo "═══════════════════════════════════════════════════════════"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Tudo OK! O provider deve aparecer no GSD.${NC}"
    echo
    echo "Para usar:"
    echo "  gsd"
    echo "  /model"
    echo "  # Selecione qwen3.6-plus"
else
    echo -e "${RED}❌ Encontrados $ERRORS problema(s).${NC}"
    echo
    echo "Correções sugeridas:"
    if [ ! -f "packages/pi-ai/dist/providers/qwen-code.js" ]; then
        echo "  npm run build:pi-ai"
    fi
    if ! grep -q '"providers"' ~/.gsd/agent/models.json 2>/dev/null; then
        echo "  ./scripts/fix-qwen-models.sh"
    fi
fi
echo "═══════════════════════════════════════════════════════════"
