#!/bin/bash
# Quick setup for VPN access - Run with: sudo bash scripts/vpn-access/quick-setup.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_IP=$(hostname -I | awk '{print $1}')
VPN_DOMAIN="gsd.atius-srv-1"

echo "🚀 Quick VPN Setup for GSD"
echo "=========================="
echo ""
echo "This will:"
echo "  1. Install and configure nginx"
echo "  2. Add $VPN_DOMAIN as allowed origin"
echo "  3. Restart services"
echo ""
echo "Your server IP is: $SERVER_IP"
echo "Add this to your Windows hosts file:"
echo "  $SERVER_IP  $VPN_DOMAIN"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Aborted"
  exit 1
fi

# Run full setup
bash "$SCRIPT_DIR/setup-vpn-access.sh"

echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo ""
echo "📝 Next steps:"
echo "  1. On your Windows PC, add to C:\\Windows\\System32\\drivers\\etc\\hosts:"
echo "     $SERVER_IP  $VPN_DOMAIN"
echo ""
echo "  2. Connect to VPN"
echo ""
echo "  3. Access: http://$VPN_DOMAIN"
echo ""
