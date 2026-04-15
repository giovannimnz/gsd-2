# GSD-2 — Instalação e Atualização

## 🚀 Primeira Instalação

Após clonar o repositório, execute:

```bash
npm run install:gsd
```

Este comando irá:
1. ✅ Instalar dependências (`npm install`)
2. 🔐 Perguntar login/senha para o frontend web (interativo)
3. 🔨 Fazer build do projeto
4. ⚙️ Configurar PM2 (process manager)
5. 🚀 Iniciar o serviço web

### O que será configurado:

| Configuração | Descrição |
|--------------|-----------|
| `GSD_WEB_LOGIN_USERNAME` | Usuário para login no frontend (padrão: admin) |
| `GSD_WEB_LOGIN_PASSWORD` | Senha para acesso ao web interface |
| PM2 | Process manager (usa scripts do próprio git clone) |
| Porta | 34000 (http://localhost:34000) |

### 📁 Onde fica tudo:

**TUDO fica dentro do Git Clone:**

```
📁 gsd-2/                    ← Pasta do git clone
├── 📁 node_modules/         ← Dependências
├── 📁 dist/                 ← Build
├── 📁 packages/             ← Código fonte
├── 📁 scripts/pm2/          ← Scripts PM2 (usados diretamente)
├── .env.local               ← Config de login (não commitado)
└── ...
```

**NADA é criado fora da pasta do git clone!**
- ❌ Sem `~/.gsd/`
- ❌ Sem alterações em `.zshrc` ou `.bashrc`
- ✅ Tudo auto-contido na pasta do projeto

---

## 🔄 Atualização

Para atualizar o GSD-2 após um `git pull`:

```bash
npm run update
```

Ou diretamente:

```bash
bash update.sh
```

Este comando irá:
1. ⬇️ Buscar atualizações do upstream
2. 🔀 Fazer merge das mudanças
3. 📦 Instalar novas dependências
4. 🔨 Fazer build
5. 🔄 Sincronizar scripts PM2 (se houver mudanças)
6. 🚀 Reiniciar o serviço

---

## 🖥️ Comandos do PM2

Após a instalação, gerencie o serviço com:

```bash
# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs gsd-web

# Reiniciar
pm2 restart gsd-web

# Parar
pm2 stop gsd-web

# Iniciar
pm2 start gsd-web
```

---

## 🔧 Configuração Manual (se necessário)

Se precisar alterar as configurações depois:

### Alterar login/senha:

```bash
# Edite o arquivo .env.local na pasta do git clone
nano .env.local

# Ou delete e reconfigure
rm .env.local
npm run install:gsd

# Reinicie o PM2
pm2 restart gsd-web
```

### Alterar porta ou hostname:

Edite os arquivos no git clone:
- `scripts/pm2/ecosystem.config.js`
- `scripts/pm2/start-gsd-web.sh`

Depois reinicie:
```bash
pm2 restart gsd-web
```

---

## 🐛 Troubleshooting

### "Porta em uso"
```bash
# Verifique o que está usando a porta 34000
lsof -i :34000

# Ou altere a porta nos scripts PM2 (dentro do git clone)
nano scripts/pm2/ecosystem.config.js
```

### "PM2 não encontrado"
```bash
# Instale globalmente
npm install -g pm2
```

### "Build falha"
```bash
# Limpe e reinstale (tudo dentro do git clone)
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🗑️ Desinstalação Completa

Como **tudo fica no git clone**, basta:

```bash
# Parar o serviço
pm2 delete gsd-web

# Deletar a pasta
rm -rf /caminho/do/gsd-2

# (Opcional) Limpar PM2
pm2 save
```

**Pronto!** Não sobrou nada no sistema 😊

---

## 📁 Arquivos Importantes (tudo no git clone)

| Arquivo | Descrição |
|---------|-----------|
| `scripts/first-install.mjs` | Script de primeira instalação |
| `update.sh` | Script de atualização |
| `scripts/pm2/ecosystem.config.js` | Config do PM2 |
| `scripts/pm2/start-gsd-web.sh` | Script de inicialização |
| `.env.local` | Credenciais de login (não commitado) |
| `~/.gsd/pm2/` | Cópia local dos scripts PM2 |
