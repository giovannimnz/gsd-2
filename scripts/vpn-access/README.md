# Acesso VPN ao GSD Web Interface

Este guia explica como acessar o GSD Web Interface via VPN usando o domínio `gsd.atius-srv-1`.

## 📋 Pré-requisitos

1. **VPN Configurada** - Seu cliente VPN deve estar conectado ao servidor
2. **nginx instalado** - O script de configuração instala automaticamente
3. **Acesso root/sudo** - Necessário para configurar nginx

## 🚀 Configuração Automática (Recomendado)

Execute o script de configuração no servidor:

```bash
sudo bash /home/ubuntu/GitHub/forks/gsd-2/scripts/vpn-access/setup-vpn-access.sh
```

O script irá:
- ✅ Instalar nginx (se necessário)
- ✅ Configurar reverse proxy para `gsd.atius-srv-1`
- ✅ Adicionar domínio VPN às origens permitidas do GSD
- ✅ Reiniciar o PM2 com as novas configurações

## 🔧 Configuração Manual

### 1. Configurar nginx

```bash
# Copiar configuração
sudo cp /home/ubuntu/GitHub/forks/gsd-2/scripts/vpn-access/nginx-gsd-vpn.conf /etc/nginx/sites-available/gsd-vpn.conf

# Habilitar site
sudo ln -s /etc/nginx/sites-available/gsd-vpn.conf /etc/nginx/sites-enabled/gsd-vpn.conf

# Testar configuração
sudo nginx -t

# Recarregar nginx
sudo systemctl reload nginx
```

### 2. Atualizar origens permitidas do GSD

O arquivo `/home/ubuntu/.gsd/pm2/start-gsd-web.sh` deve conter:

```bash
export GSD_WEB_ALLOWED_ORIGINS="${GSD_WEB_ALLOWED_ORIGINS:-https://gsd.atius.com.br,http://gsd.atius-srv-1}"
```

Reinicie o PM2:

```bash
pm2 restart gsd-web
```

## 💻 Configuração do Cliente Windows

### Adicionar entrada no arquivo hosts

1. Abra o **Bloco de Notas** como **Administrador**
2. Abra o arquivo: `C:\Windows\System32\drivers\etc\hosts`
3. Adicione a linha:

```
<IP_VPN_DO_SERVIDOR>  gsd.atius-srv-1
```

Substitua `<IP_VPN_DO_SERVIDOR>` pelo IP do servidor na VPN (ex: `10.8.0.1`).

4. Salve o arquivo

### Verificar conexão

```cmd
ping gsd.atius-srv-1
```

## 🌐 Acessando o GSD

Após a configuração:

1. **Conecte-se à VPN**
2. **Abra o navegador** e acesse:
   ```
   http://gsd.atius-srv-1
   ```

O GSD Web Interface deve carregar normalmente!

## 🔒 HTTPS (Opcional)

Para acesso HTTPS na VPN:

1. Edite `/etc/nginx/sites-available/gsd-vpn.conf`
2. Descomente o bloco `server` HTTPS
3. Gere um certificado auto-assinado:

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/gsd-atius-srv-1.key \
  -out /etc/ssl/certs/gsd-atius-srv-1.pem
```

4. Recarregue o nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

5. Acesse: `https://gsd.atius-srv-1`

⚠️ **Nota:** Navegadores avisarão sobre certificado auto-assinado. Aceite o risco para uso interno.

## 🐛 Troubleshooting

### Problema: "Forbidden: origin mismatch"

**Solução:** Verifique se o domínio VPN está nas origens permitidas:

```bash
cat /home/ubuntu/.gsd/pm2/start-gsd-web.sh | grep GSD_WEB_ALLOWED_ORIGINS
```

Deve incluir `http://gsd.atius-srv-1`.

### Problema: nginx não responde

**Solução:**

```bash
# Verificar status
sudo systemctl status nginx

# Verificar logs
sudo tail -f /var/log/nginx/error.log

# Testar configuração
sudo nginx -t
```

### Problema: PM2 não reiniciou

**Solução:**

```bash
pm2 restart gsd-web
sleep 5
pm2 logs gsd-web --lines 10
```

### Problema: Não consigo acessar via VPN

**Verificações:**

1. ✅ VPN está conectada?
2. ✅ Arquivo hosts do Windows está configurado corretamente?
3. ✅ Firewall permite tráfego na porta 80 (e 443 se HTTPS)?
4. ✅ nginx está rodando? (`sudo systemctl status nginx`)

## 📊 Verificar Configuração

```bash
# Ver nginx
sudo nginx -t
curl -I http://gsd.atius-srv-1

# Ver PM2
pm2 describe gsd-web

# Ver origens permitidas
grep GSD_WEB_ALLOWED_ORIGINS /home/ubuntu/.gsd/pm2/start-gsd-web.sh
```

## 🔗 Links Relacionados

- Documentação GSD Web: `/home/ubuntu/GitHub/forks/gsd-2/docs/user-docs/web-interface.md`
- Configuração PM2: `/home/ubuntu/GitHub/forks/gsd-2/scripts/pm2/`
- Proxy CORS: `/home/ubuntu/GitHub/forks/gsd-2/web/proxy.ts`
