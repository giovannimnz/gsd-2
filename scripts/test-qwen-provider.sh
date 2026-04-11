#!/bin/bash
#
# Script de teste rápido do Qwen Code Provider
# Usage: ./scripts/test-qwen-provider.sh

set -e

echo "═══════════════════════════════════════════════════════════"
echo "  Qwen Code Provider - Teste Rápido"
echo "═══════════════════════════════════════════════════════════"
echo

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test 1: Verificar build
echo "Teste 1: Verificando build..."
if [ -f "packages/pi-ai/dist/providers/qwen-code.js" ]; then
    echo -e "${GREEN}✓ Arquivo compilado existe${NC}"
else
    echo -e "${RED}✗ Build não encontrado. Execute: npm run build:pi-ai${NC}"
    exit 1
fi
echo

# Test 2: Verificar models.json
echo "Teste 2: Verificando models.json..."
if [ -f ~/.gsd/agent/models.json ]; then
    if grep -q "qwen3.6-plus" ~/.gsd/agent/models.json; then
        echo -e "${GREEN}✓ Modelo qwen3.6-plus configurado${NC}"
    else
        echo -e "${RED}✗ Modelo qwen3.6-plus não encontrado em models.json${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ models.json não encontrado${NC}"
    exit 1
fi
echo

# Test 3: Verificar qwen CLI
echo "Teste 3: Verificando qwen CLI..."
if command -v qwen &> /dev/null; then
    echo -e "${GREEN}✓ Qwen CLI instalado${NC}"
else
    echo -e "${RED}✗ Qwen CLI não encontrado. Instale: npm install -g @qwen-code/qwen-code${NC}"
    exit 1
fi
echo

# Test 4: Verificar credenciais
echo "Teste 4: Verificando credenciais..."
if [ -f ~/.qwen/settings.json ] || [ -n "$DASHSCOPE_API_KEY" ]; then
    echo -e "${GREEN}✓ Credenciais disponíveis${NC}"
else
    echo -e "${YELLOW}⚠ Credenciais não encontradas. Execute 'qwen' e '/auth' para autenticar${NC}"
fi
echo

# Test 5: Teste de execução (se possível)
echo "Teste 5: Teste de execução simples..."
if command -v qwen &> /dev/null; then
    echo "  Executando: qwen -p 'Say hello' --yolo"
    timeout 30 qwen -p "Say hello" --yolo > /tmp/qwen-test-output.txt 2>&1 && {
        echo -e "${GREEN}✓ Qwen CLI respondeu${NC}"
        echo "  Output: $(head -c 50 /tmp/qwen-test-output.txt)..."
    } || {
        echo -e "${YELLOW}⚠ Qwen CLI não respondeu (pode ser problema de auth)${NC}"
    }
else
    echo -e "${YELLOW}⚠ Pulando teste de execução${NC}"
fi
echo

echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}  ✓ Testes básicos completos!${NC}"
echo "═══════════════════════════════════════════════════════════"
echo
echo "Para testes completos:"
echo "  npm test -- src/tests/integration/qwen-code-provider.test.ts"
echo
echo "Para usar o provider:"
echo "  gsd"
echo "  /model qwen3.6-plus"
echo
