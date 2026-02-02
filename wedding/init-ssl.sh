#!/bin/bash
set -e

DOMAIN="wedding.dante-le.io.vn"
EMAIL="dante@dante-le.io.vn"
SITE_DIR="/var/www/wedding"
CERTBOT_WEBROOT="/var/www/certbot"

echo "=== Nginx + SSL Setup for $DOMAIN ==="

# Install nginx and certbot if not present
echo "Installing nginx and certbot..."
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# Copy site files
echo "Copying site files to $SITE_DIR..."
sudo mkdir -p "$SITE_DIR"
sudo cp -r "$(dirname "$0")/index.html" "$SITE_DIR/"
sudo cp -r "$(dirname "$0")/styles.css" "$SITE_DIR/"
sudo cp -r "$(dirname "$0")/script.js" "$SITE_DIR/"
sudo cp -r "$(dirname "$0")/love" "$SITE_DIR/"

# Copy nginx configs
echo "Setting up nginx config..."
sudo cp "$(dirname "$0")/nginx/nginx.conf" /etc/nginx/nginx.conf
sudo cp "$(dirname "$0")/nginx/default.conf" /etc/nginx/sites-available/wedding
sudo ln -sf /etc/nginx/sites-available/wedding /etc/nginx/sites-enabled/wedding
sudo rm -f /etc/nginx/sites-enabled/default

# Create certbot webroot
sudo mkdir -p "$CERTBOT_WEBROOT"

# Test nginx config and start with HTTP only (for ACME challenge)
echo "Starting nginx (HTTP only for certificate request)..."
sudo nginx -t
sudo systemctl restart nginx

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

# Set up auto-renewal cron
echo "Setting up certificate auto-renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo ""
echo "=== Done! ==="
echo "Your site is live at https://$DOMAIN"
echo "SSL certificates will auto-renew via certbot.timer"
