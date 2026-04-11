#!/bin/bash
#
# Script de instalação rápida do Qwen Code Provider no GSD
# Usage: ./scripts/install-qwen-provider.sh

set -e

echo "═══════════════════════════════════════════════════════════"
echo "  Qwen Code Provider - Instalação"
echo "═══════════════════════════════════════════════════════════"
echo

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "package.json" ] || [ ! -d "packages/pi-ai" ]; then
    echo -e "${RED}✗ Erro: Execute este script do diretório raiz do projeto gsd-2${NC}"
    exit 1
fi

echo "📦 Passo 1: Build do pacote pi-ai..."
npm run build:pi-ai
echo -e "${GREEN}✓ Build completo${NC}"
echo

echo "🔧 Passo 2: Verificar instalação do GSD..."
if command -v gsd &> /dev/null; then
    echo -e "${GREEN}✓ GSD encontrado: $(gsd --version)${NC}"
else
    echo -e "${YELLOW}⚠ GSD não encontrado. Instalando...${NC}"
    npm install -g .
    echo -e "${GREEN}✓ GSD instalado${NC}"
fi
echo

echo "📋 Passo 3: Configurar models.json..."
mkdir -p ~/.gsd/agent

if [ -f ~/.gsd/agent/models.json ]; then
    echo -e "${YELLOW}⚠ models.json já existe. Fazendo backup...${NC}"
    cp ~/.gsd/agent/models.json ~/.gsd/agent/models.json.backup.$(date +%Y%m%d_%H%M%S)
fi

cat > ~/.gsd/agent/models.json << 'EOF'
{
  "models": [
    {
      "id": "qwen3.6-plus",
      "name": "Qwen 3.6 Plus",
      "provider": "qwen-code",
      "api": "qwen-code",
      "description": "Qwen3-Coder via Qwen Code CLI",
      "capabilities": {
        "streaming": true,
        "toolCalling": true,
        "vision": true,
        "reasoning": true
      },
      "contextWindow": 128000,
      "pricing": {
        "input": 0.0,
        "output": 0.0
      },
      "defaultOptions": {
        "temperature": 0.7,
        "maxTokens": 8192
      }
    },
    {
      "id": "qwen3.5-plus",
      "name": "Qwen 3.5 Plus",
      "provider": "qwen-code",
      "api": "qwen-code",
      "description": "Qwen3.5-Coder via Qwen Code CLI",
      "capabilities": {
        "streaming": true,
        "toolCalling": true,
        "vision": true,
        "reasoning": true
      },
      "contextWindow": 128000,
      "pricing": {
        "input": 0.0,
        "output": 0.0
      },
      "defaultOptions": {
        "temperature": 0.7,
        "maxTokens": 8192
      }
    }
  ]
}
EOF

echo -e "${GREEN}✓ models.json configurado${NC}"
echo

echo "🔍 Passo 4: Verificar qwen CLI..."
if command -v qwen &> /dev/null; then
    echo -e "${GREEN}✓ Qwen CLI encontrado: $(qwen --version 2>/dev/null || echo 'version unknown')${NC}"
else
    echo -e "${YELLOW}⚠ Qwen CLI não encontrado. Instalando...${NC}"
    npm install -g @qwen-code/qwen-code
    echo -e "${GREEN}✓ Qwen CLI instalado${NC}"
fi
echo

echo "🔐 Passo 5: Verificar autenticação..."
if [ -f ~/.qwen/settings.json ]; then
    echo -e "${GREEN}✓ Credenciais do qwen encontradas${NC}"
else
    echo -e "${YELLOW}⚠ Credenciais não encontradas.${NC}"
    echo "  Execute 'qwen' e depois '/auth' para autenticar"
fi
echo

echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}  ✓ Instalação completa!${NC}"
echo "═══════════════════════════════════════════════════════════"
echo
echo "Para usar:"
echo "  1. gsd"
echo "  2. /model qwen3.6-plus"
echo "  3. /gsd"
echo
echo "Para testar:"
echo "  npm test -- src/tests/integration/qwen-code-provider.test.ts"
echo
