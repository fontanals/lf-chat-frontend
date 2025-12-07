#!/bin/sh

set -e

DOMAIN="lfchat.lucasfontana.dev"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"

echo "Checking for SSL certificates..."

if [ ! -f "$CERT_PATH/fullchain.pem" ]; then
    echo "No SSL certificates found. Creating self-signed certificates..."

    mkdir -p "$CERT_PATH"

    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout "$CERT_PATH/privkey.pem" \
        -out "$CERT_PATH/fullchain.pem" \
        -subj "/CN=$DOMAIN"

    echo "✅ Dummy certificates created"
    echo "⚠️  Run './scripts/setup_ssl.sh' to get real SSL certificates from Let's Encrypt"
else
    echo "✅ SSL certificates found"
fi

echo "Starting Nginx..."

exec nginx -g 'daemon off;'