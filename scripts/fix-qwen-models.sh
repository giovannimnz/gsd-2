#!/bin/bash
# Script para corrigir models.json com a seção providers necessária

set -e

echo "🔧 Corrigindo models.json para Qwen Code provider..."

# Verificar diretório
mkdir -p ~/.gsd/agent

# Criar backup se existe
if [ -f ~/.gsd/agent/models.json ]; then
    cp ~/.gsd/agent/models.json ~/.gsd/agent/models.json.backup.$(date +%Y%m%d_%H%M%S)
    echo "📦 Backup criado"
fi

# Criar models.json correto
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
  ],
  "providers": {
    "qwen-code": {
      "baseUrl": "",
      "api": "qwen-code",
      "apiKey": "not-needed",
      "models": [
        { "id": "qwen3.6-plus" },
        { "id": "qwen3.5-plus" }
      ]
    }
  }
}
EOF

echo "✅ models.json corrigido!"
echo ""
echo "📝 Para aplicar as mudanças:"
echo "   1. Saia do GSD (se estiver rodando)"
echo "   2. Execute: gsd"
echo "   3. Execute: /model"
echo "   4. Verifique se 'qwen3.6-plus' aparece na lista"
echo ""
