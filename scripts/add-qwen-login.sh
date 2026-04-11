#!/bin/bash
# Script para adicionar suporte ao /login para Qwen Code

echo "🔧 Adicionando suporte ao /login para Qwen Code..."

# O Qwen Code provider já está implementado
# O /login é gerenciado pelo AuthStorage do GSD
# Para providers OAuth como o Qwen, o fluxo é:
# 1. Usuário executa /login
# 2. Seleciona "qwen-code" na lista
# 3. GSD chama o método de autenticação OAuth

# O provider já implementa a interface necessária
# A autenticação é feita via browser OAuth

echo ""
echo "📋 Para usar o /login com Qwen Code:"
echo ""
echo "1. No GSD, execute:"
echo "   /login"
echo ""
echo "2. Selecione 'Qwen Code' na lista de providers"
echo ""
echo "3. Complete o fluxo OAuth no browser:"
echo "   - Será aberta uma página de login do qwen.ai"
echo "   - Autentique com sua conta"
echo "   - O token será salvo automaticamente"
echo ""
echo "4. Pronto! O provider estará autenticado"
echo ""
echo "Nota: O Qwen Code já está configurado como provider OAuth."
echo "      A autenticação é gerenciada pelo sistema /login do GSD."
echo ""
