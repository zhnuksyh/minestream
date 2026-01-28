#!/bin/bash
# Start MineStream backend with HTTPS for network access

cd "$(dirname "$0")/.."

echo "Starting MineStream API with HTTPS..."
echo "Access from: https://$(hostname -I | awk '{print $1}'):8000"

uvicorn app.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --ssl-keyfile certs/key.pem \
    --ssl-certfile certs/cert.pem \
    --reload
