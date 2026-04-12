# Script de Diagnóstico VPN GSD
# Execute no PowerShell do seu PC Windows (com VPN conectada)

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  Diagnóstico VPN - GSD Access" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar conexão VPN
Write-Host "1. Verificando conexão VPN..." -ForegroundColor Yellow
$wgStatus = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "10.1.1.*" }
if ($wgStatus) {
    Write-Host "   ✅ VPN conectada - IP: $($wgStatus.IPAddress)" -ForegroundColor Green
} else {
    Write-Host "   ❌ VPN NÃO conectada ou IP não configurado" -ForegroundColor Red
    Write-Host "      Conecte à VPN WireGuard primeiro!" -ForegroundColor Red
}

# 2. Testar ping para servidor DNS
Write-Host ""
Write-Host "2. Testando ping para servidor DNS (10.1.1.2)..." -ForegroundColor Yellow
$pingDNS = Test-Connection -ComputerName 10.1.1.2 -Count 2 -Quiet
if ($pingDNS) {
    Write-Host "   ✅ Servidor DNS acessível" -ForegroundColor Green
} else {
    Write-Host "   ❌ Servidor DNS (10.1.1.2) NÃO responde" -ForegroundColor Red
    Write-Host "      Verifique se a VPN está conectada corretamente" -ForegroundColor Red
}

# 3. Testar ping para atius-srv-1
Write-Host ""
Write-Host "3. Testando ping para atius-srv-1 (10.1.1.1)..." -ForegroundColor Yellow
$pingGSD = Test-Connection -ComputerName 10.1.1.1 -Count 2 -Quiet
if ($pingGSD) {
    Write-Host "   ✅ atius-srv-1 acessível" -ForegroundColor Green
} else {
    Write-Host "   ❌ atius-srv-1 (10.1.1.1) NÃO responde" -ForegroundColor Red
}

# 4. Testar resolução DNS
Write-Host ""
Write-Host "4. Testando resolução DNS via 10.1.1.2..." -ForegroundColor Yellow
try {
    $dnsResult = Resolve-DnsName -Name "gsd.atius-srv-1" -Server "10.1.1.2" -ErrorAction Stop
    Write-Host "   ✅ DNS funcionando!" -ForegroundColor Green
    Write-Host "      gsd.atius-srv-1 → $($dnsResult.IPAddress)" -ForegroundColor White
} catch {
    Write-Host "   ❌ DNS NÃO está funcionando" -ForegroundColor Red
    Write-Host "      Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Soluções possíveis:" -ForegroundColor Yellow
    Write-Host "   a) Adicione manualmente no arquivo hosts:" -ForegroundColor White
    Write-Host "      C:\Windows\System32\drivers\etc\hosts" -ForegroundColor White
    Write-Host "      Adicione: 10.1.1.1  gsd.atius-srv-1" -ForegroundColor Green
}

# 5. Testar acesso HTTP
Write-Host ""
Write-Host "5. Testando acesso HTTP ao GSD..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://gsd.atius-srv-1" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "   ✅ GSD respondendo - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 307 -or $_.Exception.Message -like "*redirect*") {
        Write-Host "   ✅ GSD respondendo (redirect para login)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ GSD NÃO está acessível" -ForegroundColor Red
        Write-Host "      Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 6. Testar acesso via IP direto
Write-Host ""
Write-Host "6. Testando acesso via IP (http://10.1.1.1:1027)..." -ForegroundColor Yellow
try {
    $responseIP = Invoke-WebRequest -Uri "http://10.1.1.1:1027" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "   ✅ Acesso direto funcionando" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️ Acesso direto não disponível (pode ser normal)" -ForegroundColor Yellow
}

# 7. Verificar configuração DNS do adaptador VPN
Write-Host ""
Write-Host "7. Configuração DNS do adaptador VPN..." -ForegroundColor Yellow
$vpnAdapter = Get-NetAdapter | Where-Object { $_.InterfaceDescription -like "*WireGuard*" -or $_.InterfaceDescription -like "*Wintun*" }
if ($vpnAdapter) {
    $dnsConfig = Get-DnsClientServerAddress -InterfaceIndex $vpnAdapter.ifIndex
    Write-Host "   Adaptador: $($vpnAdapter.Name)" -ForegroundColor White
    Write-Host "   DNS configurados: $($dnsConfig.ServerAddresses -join ', ')" -ForegroundColor White
    
    if ($dnsConfig.ServerAddresses -contains "10.1.1.2") {
        Write-Host "   ✅ Servidor DNS 10.1.1.2 está configurado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ Servidor DNS 10.1.1.2 NÃO está na lista" -ForegroundColor Yellow
        Write-Host "   Para adicionar:" -ForegroundColor Yellow
        Write-Host "   Set-DnsClientServerAddress -InterfaceIndex $($vpnAdapter.ifIndex) -ServerAddresses ('10.1.1.2')" -ForegroundColor White
    }
} else {
    Write-Host "   ⚠️ Adaptador VPN não encontrado" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  Resumo" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

if ($pingDNS -and $pingGSD) {
    Write-Host "✅ VPN está funcionando corretamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Se o site não abre no navegador:" -ForegroundColor Yellow
    Write-Host "  1. Tente: https://gsd.atius-srv-1" -ForegroundColor White
    Write-Host "  2. Aceite o aviso de certificado (é seguro)" -ForegroundColor White
    Write-Host "  3. Se ainda não funcionar, adicione ao hosts:" -ForegroundColor White
    Write-Host "     10.1.1.1  gsd.atius-srv-1" -ForegroundColor Green
} else {
    Write-Host "❌ Problema detectado na conexão VPN" -ForegroundColor Red
    Write-Host "  Verifique:" -ForegroundColor Yellow
    Write-Host "  1. VPN WireGuard está conectada?" -ForegroundColor White
    Write-Host "  2. Configuração do cliente está correta?" -ForegroundColor White
    Write-Host "  3. Firewall permite tráfego VPN?" -ForegroundColor White
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
