#!/bin/bash
set -e

DOMAIN="portfolio.dante-le.io.vn"
EMAIL="dante@dante-le.io.vn"
SITE_DIR="/var/www/portfolio"
CERTBOT_WEBROOT="/var/www/certbot"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Nginx + SSL Setup for $DOMAIN ==="

# Install nginx and certbot if not present
if ! command -v nginx &> /dev/null || ! command -v certbot &> /dev/null; then
    echo "Installing nginx and certbot..."
    sudo apt update
    sudo apt install -y nginx certbot python3-certbot-nginx
fi

# Copy site files
echo "Copying site files to $SITE_DIR..."
sudo mkdir -p "$SITE_DIR"
sudo cp "$SCRIPT_DIR/index.html" "$SITE_DIR/"
sudo cp "$SCRIPT_DIR/styles.css" "$SITE_DIR/"
sudo cp "$SCRIPT_DIR/script.js" "$SITE_DIR/"

# Create certbot webroot
sudo mkdir -p "$CERTBOT_WEBROOT"

# Install temporary HTTP-only config (no SSL references)
echo "Setting up temporary HTTP-only config..."
sudo tee /etc/nginx/sites-available/portfolio > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name portfolio.dante-le.io.vn;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        root /var/www/portfolio;
        index index.html;
    }
}
EOF
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio

echo "Reloading nginx (HTTP only for certificate request)..."
sudo nginx -t
sudo systemctl reload nginx

# Request SSL certificate
echo "Requesting SSL certificate from Let's Encrypt..."
sudo certbot certonly \
    --webroot \
    --webroot-path="$CERTBOT_WEBROOT" \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN"

# Now install the full config with SSL
echo "Installing full config with SSL..."
sudo cp "$SCRIPT_DIR/nginx/default.conf" /etc/nginx/sites-available/portfolio

echo "Reloading nginx with SSL..."
sudo nginx -t
sudo systemctl reload nginx

# Ensure auto-renewal is enabled
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo ""
echo "=== Done! ==="
echo "Your site is live at https://$DOMAIN"
echo "SSL certificates will auto-renew via certbot.timer"
