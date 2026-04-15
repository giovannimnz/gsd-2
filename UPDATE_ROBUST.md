# Update Robusto Automático

Script de atualização automática que lida com merges, conflitos e stashes sem intervenção manual.

## Uso

```bash
# Executar update robusto
npm run update:robust

# Ou diretamente
bash update-robust.sh
```

## Funcionalidades

### 1. **Stash Automático**
- Detecta mudanças locais não commitadas
- Faz stash automaticamente antes do update
- Restaura o stash após a conclusão

### 2. **Merge Automático**
- Faz fetch do upstream automaticamente
- Detecta se há novos commits
- Executa merge com tratamento automático de conflitos

### 3. **Resolução de Conflitos**
- Resolve automaticamente conflitos em arquivos de lock (package-lock.json, yarn.lock)
- Usa a versão do upstream para arquivos de dependências
- Aborta o merge se houver conflitos não resolvidos

### 4. **Build Automático**
- Executa `npm install` após o merge
- Executa `npm run build` para compilar
- Reinicia o PM2 se o serviço gsd-web estiver rodando

## Fluxo de Execução

1. Verifica branch atual
2. Faz stash se houver mudanças locais
3. Fetch do upstream
4. Verifica se há novos commits
5. Executa merge com resolução automática de conflitos
6. Restaura o stash
7. Instala dependências
8. Executa build
9. Reinicia PM2 (se aplicável)
10. Mostra status final

## Tratamento de Erros

- **Stash falha**: Aborta e não continua
- **Fetch falha**: Restaura stash e aborta
- **Merge falha**: Tenta resolver conflitos automaticamente
- **Build falha**: Mostra erro mas mantém as mudanças
- **Restauração de stash falha**: Alerta o usuário para verificar manualmente

## Diferenças do Update Original

| Feature | update.sh | update-robust.sh |
|---------|-----------|------------------|
| Stash automático | ❌ Manual | ✅ Automático |
| Resolução de conflitos | ❌ Aborta | ✅ Automática (parcial) |
| Intervenção manual | ✅ Necessária | ❌ Não necessária |
| Commit/Push | ❌ Não faz | ❌ Não faz |
| Reinício PM2 | ✅ Manual | ✅ Automático |

## Segurança

- Nunca faz commit ou push para o repositório remoto
- Restaura stash mesmo se ocorrer erro durante o update
- Aborta merge se conflitos não puderem ser resolvidos
- Não sobrescreve mudanças locais não commitadas

## Logs

O script gera logs detalhados com timestamps:

```
[2026-04-15 10:30:15] Branch atual: main
[2026-04-15 10:30:16] Detectadas mudanças locais não commitadas. Fazendo stash...
✅ [2026-04-15 10:30:16] Stash criado: auto-stash-before-update-1649999416
```

## Requisitos

- Git configurado com upstream remote
- Node.js >= 20.0.0
- npm instalado
- PM2 (opcional, para reinício automático)

## Troubleshooting

### Stash não restaurado
```bash
git stash list
git stash pop
```

### Merge abortado
```bash
git status
git merge --abort  # se necessário
```

### Conflitos não resolvidos
```bash
git diff --name-only --diff-filter=U
# Resolver manualmente e depois:
git add .
git merge --continue
```