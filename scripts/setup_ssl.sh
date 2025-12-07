#!/bin/bash

set -e 

DOMAIN="lfchat.lucasfontana.dev"
EMAIL="lucasfontanasv@gmail.com"
COMPOSE_FILE="docker-compose.prod.yml"
CURRENT_DIR=$(pwd)
RENEWAL_SCRIPT="$CURRENT_DIR/scripts/renew_ssl.sh"

echo "Removing self-signed dummy certificates..."
rm -rf ./certbot/conf/live/$DOMAIN
rm -rf ./certbot/conf/archive/$DOMAIN
rm -rf ./certbot/conf/renewal/$DOMAIN.conf

echo "Requesting SSL certificate from Let's Encrypt..."
docker compose -f $COMPOSE_FILE run --rm certbot \
    certonly --webroot \
    --webroot-path=/var/www/certbot \
    -d "$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --force-renewal

if [ $? -eq 0 ]; then
    echo "✅ SSL certificate obtained successfully!"
else
    echo "❌ Failed to obtain SSL certificate"
    exit 1
fi

NGINX_CONTAINER=$(docker compose -f $COMPOSE_FILE ps -q app)

if [ -n "$NGINX_CONTAINER" ]; then
    docker exec "$NGINX_CONTAINER" nginx -s reload
    echo "✅ Nginx reloaded successfully"
else
    echo "⚠️ Nginx container not running"
fi

chmod +x "$RENEWAL_SCRIPT"

CRON_JOB="0 3 * * * cd $CURRENT_DIR && ./scripts/renew_ssl.sh >> $HOME/certbot-renewal.log 2>&1"

if crontab -l 2>/dev/null | grep -q "renew_ssl.sh"; then
    echo "✅ Cron job already exists"
else
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "✅ Cron job added (runs daily at 3 AM)"
fi
