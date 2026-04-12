#!/bin/bash
# Setup VPN access for GSD Web Interface
# Usage: sudo bash scripts/vpn-access/setup-vpn-access.sh

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Setting up VPN access for GSD Web Interface${NC}"
echo "=================================================="

# Configuration
VPN_DOMAIN="gsd.atius-srv-1"
GSD_PORT="1027"
NGINX_CONF="scripts/vpn-access/nginx-gsd-vpn.conf"
NGINX_SITES="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}⚠ Please run as root (use sudo)${NC}"
  exit 1
fi

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
  echo -e "${YELLOW}📦 nginx not found. Installing...${NC}"
  apt-get update -qq
  apt-get install -y nginx
  systemctl enable nginx
  systemctl start nginx
fi

echo -e "${GREEN}✅ nginx is installed${NC}"

# Copy nginx config
echo "📝 Configuring nginx for ${VPN_DOMAIN}..."
if [ -f "$NGINX_CONF" ]; then
  cp "$NGINX_CONF" "$NGINX_SITES/gsd-vpn.conf"
  
  # Enable site
  if [ -L "$NGINX_ENABLED/gsd-vpn.conf" ]; then
    rm "$NGINX_ENABLED/gsd-vpn.conf"
  fi
  ln -s "$NGINX_SITES/gsd-vpn.conf" "$NGINX_ENABLED/gsd-vpn.conf"
  
  echo -e "${GREEN}✅ nginx site configured${NC}"
else
  echo -e "${RED}❌ nginx config not found at $NGINX_CONF${NC}"
  exit 1
fi

# Test nginx config
echo "🔍 Testing nginx configuration..."
if nginx -t 2>&1 | grep -q "syntax is ok"; then
  echo -e "${GREEN}✅ nginx config is valid${NC}"
else
  echo -e "${RED}❌ nginx config test failed${NC}"
  nginx -t
  exit 1
fi

# Reload nginx
echo "🔄 Reloading nginx..."
systemctl reload nginx
echo -e "${GREEN}✅ nginx reloaded${NC}"

# Update PM2 to allow VPN origin
echo "🔑 Adding VPN origin to GSD allowed origins..."
PM2_SCRIPT="/home/ubuntu/.gsd/pm2/start-gsd-web.sh"

if [ -f "$PM2_SCRIPT" ]; then
  # Check if VPN origin is already added
  if grep -q "$VPN_DOMAIN" "$PM2_SCRIPT"; then
    echo -e "${GREEN}✅ VPN origin already in PM2 config${NC}"
  else
    # Add VPN origin to allowed origins
    sed -i "s|export GSD_WEB_ALLOWED_ORIGINS=\"\${GSD_WEB_ALLOWED_ORIGINS:-https://gsd.atius.com.br}\"|export GSD_WEB_ALLOWED_ORIGINS=\"\${GSD_WEB_ALLOWED_ORIGINS:-https://gsd.atius.com.br,http://$VPN_DOMAIN}\"|" "$PM2_SCRIPT"
    echo -e "${GREEN}✅ VPN origin added to PM2 config${NC}"
    
    # Restart PM2
    echo "🔄 Restarting PM2 gsd-web process..."
    su - ubuntu -c "pm2 restart gsd-web"
    sleep 5
    echo -e "${GREEN}✅ PM2 restarted${NC}"
  fi
else
  echo -e "${YELLOW}⚠ PM2 script not found at $PM2_SCRIPT${NC}"
  echo "You'll need to manually set GSD_WEB_ALLOWED_ORIGINS to include: http://$VPN_DOMAIN"
fi

# Summary
echo ""
echo "=================================================="
echo -e "${GREEN}✅ VPN Access Setup Complete!${NC}"
echo ""
echo "📍 Access GSD from VPN at:"
echo "   http://$VPN_DOMAIN"
echo ""
echo "📝 Configuration:"
echo "   - Domain: $VPN_DOMAIN"
echo "   - Port: $GSD_PORT"
echo "   - nginx: configured and running"
echo "   - GSD allowed origins: updated"
echo ""
echo "⚠️  IMPORTANT:"
echo "   1. Make sure your VPN routes traffic to this server"
echo "   2. Add '$VPN_DOMAIN' to your Windows hosts file pointing to the VPN IP"
echo "   3. Windows hosts file: C:\\Windows\\System32\\drivers\\etc\\hosts"
echo "   4. Add line: <VPN_SERVER_IP> $VPN_DOMAIN"
echo ""
echo "🔐 For HTTPS (optional):"
echo "   - Uncomment the HTTPS block in /etc/nginx/sites-available/gsd-vpn.conf"
echo "   - Generate a self-signed cert or use Let's Encrypt"
echo ""
