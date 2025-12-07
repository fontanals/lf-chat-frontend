#!/bin/bash

set -e

COMPOSE_FILE="docker-compose.prod.yml"

echo "$(date): Checking SSL certificate renewal..."

docker compose -f $COMPOSE_FILE run --rm certbot renew

NGINX_CONTAINER=$(docker compose -f $COMPOSE_FILE ps -q app)

if [ -n "$NGINX_CONTAINER" ]; then
    docker exec "$NGINX_CONTAINER" nginx -s reload
    echo "$(date): Nginx reloaded successfully"
else
    echo "$(date): Warning - Nginx container not running"
    exit 1
fi

echo "$(date): Certificate renewal check completed"