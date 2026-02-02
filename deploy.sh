#!/bin/bash
set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Deploying updates ==="

# Pull latest code
echo "Pulling latest changes..."
cd "$REPO_DIR"
git pull

# Deploy wedding
if [ -d "$REPO_DIR/wedding" ] && [ -d "/var/www/wedding" ]; then
    echo "Updating wedding site..."
    sudo cp "$REPO_DIR/wedding/index.html" /var/www/wedding/
    sudo cp "$REPO_DIR/wedding/styles.css" /var/www/wedding/
    sudo cp "$REPO_DIR/wedding/script.js" /var/www/wedding/
    sudo cp -r "$REPO_DIR/wedding/love" /var/www/wedding/
fi

# Deploy portfolio
if [ -d "$REPO_DIR/portfolio" ] && [ -d "/var/www/portfolio" ]; then
    echo "Updating portfolio site..."
    sudo cp "$REPO_DIR/portfolio/index.html" /var/www/portfolio/
    sudo cp "$REPO_DIR/portfolio/styles.css" /var/www/portfolio/
    sudo cp "$REPO_DIR/portfolio/script.js" /var/www/portfolio/
fi

echo "Done!"
