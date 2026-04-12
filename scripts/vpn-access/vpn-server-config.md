# Configuração VPN e DNS - Servidor atius-srv-2

## ✅ Configurado em: 11/04/2026

### 📋 Serviços Configurados

#### 1. **DNS VPN (dnsmasq)**
- **Status:** ✅ Ativo e rodando
- **Interface:** wg0 (10.1.1.2)
- **Config:** `/etc/dnsmasq.d/vpn-hosts.conf` + `/etc/dnsmasq.d/vpn-dns.conf`

**Registros DNS:**
```
gsd.atius-srv-1     → 10.1.1.1
atius-srv-1         → 10.1.1.1
atius-srv-2         → 10.1.1.2
horistic-srv-1      → 10.1.1.3
giovanni-pc         → 10.1.1.4
giovanni-s23        → 10.1.1.5
atius-mt5-1-lnx     → 10.1.1.6
```

#### 2. **GSD Web Interface (VPN)**
- **URL:** `https://gsd.atius-srv-1`
- **Proxy:** Apache → `10.1.1.1:1027`
- **SSL:** Auto-assinado (precisa Let's Encrypt para produção)
- **Config:** `/etc/apache2/sites-available/gsd.atius-srv-1.conf`
- **Status:** ✅ Respondendo (HTTP 307)

#### 3. **VPN noVNC**
- **URL:** `https://vpn.atius.com.br`
- **Proxy:** Apache → `127.0.0.1:6080` (websockify/noVNC)
- **SSL:** Let's Encrypt ✅
- **Config:** `/etc/apache2/sites-available/vpn.atius.com.br.conf`
- **Status:** ✅ Respondendo (HTTP 307)

### 🔧 Comandos de Gerenciamento

```bash
# Restart dnsmasq (DNS)
sudo systemctl restart dnsmasq
sudo systemctl status dnsmasq

# Restart Apache (web proxy)
sudo systemctl reload apache2
sudo apache2ctl configtest

# Restart WireGuard
sudo systemctl restart wg-quick@wg0
sudo wg show

# Ver logs
sudo tail -f /var/log/apache2/gsd-vpn-error.log
sudo tail -f /var/log/apache2/vpn-error.log
sudo journalctl -u dnsmasq -f
```

### 📝 Configuração de Clientes VPN

Para que os clientes VPN usem o DNS interno, adicione na configuração do WireGuard:

```ini
[Interface]
DNS = 10.1.1.2
```

Ou manualmente no arquivo hosts do cliente:

**Windows:** `C:\Windows\System32\drivers\etc\hosts`
**Linux/Mac:** `/etc/hosts`

```
10.1.1.1  gsd.atius-srv-1
10.1.1.1  atius-srv-1
10.1.1.2  atius-srv-2
```

### 🔒 Certificado SSL

O certificado atual para `gsd.atius-srv-1` é **auto-assinado**.

Para obter um certificado Let's Encrypt válido:

```bash
# No servidor atius-srv-2
sudo certbot certonly --apache -d gsd.atius-srv-1
sudo systemctl reload apache2
```

**Nota:** O domínio `gsd.atius-srv-1` precisa estar apontando para o IP público do servidor para o desafio do Let's Encrypt funcionar.

### 🌐 Acesso

#### Da sua máquina Windows (via VPN):

1. **Conecte à VPN WireGuard**
2. **Acesse o GSD:**
   ```
   https://gsd.atius-srv-1
   ```
   (Aceite o aviso de certificado auto-assinado)

3. **Acesse o noVNC (desktop remoto):**
   ```
   https://vpn.atius.com.br
   ```

### 🐛 Troubleshooting

#### GSD não acessa via VPN:
```bash
# Verifique se está conectado à VPN
ping 10.1.1.1

# Verifique DNS
nslookup gsd.atius-srv-1 10.1.1.2

# Verifique Apache
ssh ubuntu@atius-srv-2
sudo apache2ctl -S | grep gsd
sudo tail -f /var/log/apache2/gsd-vpn-error.log
```

#### vpn.atius.com.br não funciona:
```bash
# Verifique websockify
ssh ubuntu@atius-srv-2
sudo systemctl status websockify
sudo ss -tlnp | grep 6080

# Verifique Apache
sudo apache2ctl -S | grep vpn
sudo tail -f /var/log/apache2/vpn-error.log
```

#### DNS não resolve:
```bash
# Verifique dnsmasq
ssh ubuntu@atius-srv-2
sudo systemctl status dnsmasq
sudo cat /etc/dnsmasq.d/vpn-hosts.conf

# Teste DNS
dig @10.1.1.2 gsd.atius-srv-1
```

### 📁 Arquivos de Configuração

```
/etc/dnsmasq.d/
├── vpn-hosts.conf          # Registros DNS VPN
└── vpn-dns.conf            # Config interface DNS

/etc/apache2/sites-available/
├── gsd.atius-srv-1.conf    # GSD Web Interface
├── vpn.atius.com.br.conf   # VPN noVNC
├── remote-vnc.conf
└── mail.atius.com.br.conf

/etc/apache2/sites-enabled/
├── gsd.atius-srv-1.conf    → ../sites-available/gsd.atius-srv-1.conf
├── vpn.atius.com.br.conf   → ../sites-available/vpn.atius.com.br.conf
├── remote-vnc.conf
└── mail.atius.com.br.conf

/etc/letsencrypt/live/
├── gsd.atius-srv-1/        # Auto-assinado
├── vpn.atius.com.br/       # Let's Encrypt ✅
└── remote.atius-srv-2.atius.com.br/  # Let's Encrypt ✅
```

### 🔄 Histórico de Alterações

- **11/04/2026 23:15** - Configurado dnsmasq DNS VPN
- **11/04/2026 23:15** - Criado VirtualHost Apache para GSD VPN
- **11/04/2026 23:15** - Corrigido vpn.atius.com.br (apontava para Next.js inexistente, agora usa noVNC)
- **11/04/2026 23:15** - Gerado certificado SSL auto-assinado para gsd.atius-srv-1
