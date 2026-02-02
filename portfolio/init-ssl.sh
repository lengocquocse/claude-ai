#!/bin/bash
set -e

DOMAIN="portfolio.dante-le.io.vn"
EMAIL="dante@dante-le.io.vn"
SITE_DIR="/var/www/portfolio"
CERTBOT_WEBROOT="/var/www/certbot"

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
sudo cp "$(dirname "$0")/index.html" "$SITE_DIR/"
sudo cp "$(dirname "$0")/styles.css" "$SITE_DIR/"
sudo cp "$(dirname "$0")/script.js" "$SITE_DIR/"

# Copy nginx config
echo "Setting up nginx config..."
sudo cp "$(dirname "$0")/nginx/default.conf" /etc/nginx/sites-available/portfolio
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio

# Create certbot webroot
sudo mkdir -p "$CERTBOT_WEBROOT"

# Test nginx config and reload
echo "Reloading nginx..."
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

# Reload nginx with SSL enabled
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
