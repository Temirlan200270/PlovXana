#!/usr/bin/env bash
# Деплой PlovХана на VPS из main.
# Запускается GitHub Actions по SSH под юзером `deploy`.
# Idempotent: можно дёргать сколько угодно.
set -euo pipefail

APP_DIR="${APP_DIR:-/home/deploy/plovxana}"
APP_NAME="${APP_NAME:-plovxana}"
BRANCH="${BRANCH:-main}"
NGINX_SRC="$APP_DIR/deploy/nginx/plovxana.conf"
NGINX_DST="/etc/nginx/sites-available/plovxana"

cd "$APP_DIR"

echo "==> [1/6] git fetch --prune"
git fetch --prune origin

echo "==> [2/6] reset to origin/$BRANCH"
git reset --hard "origin/$BRANCH"

echo "==> [3/6] npm ci (clean install, dev deps included for build)"
npm ci --no-audit --no-fund

echo "==> [4/6] next build"
rm -rf .next
npm run build

echo "==> [5/6] nginx config sync (if changed)"
if [ -f "$NGINX_SRC" ]; then
  if ! sudo cmp -s "$NGINX_SRC" "$NGINX_DST" 2>/dev/null; then
    echo "    nginx config changed → applying"
    sudo cp "$NGINX_SRC" "$NGINX_DST"
    if sudo nginx -t 2>&1; then
      sudo systemctl reload nginx
      echo "    nginx reloaded"
    else
      echo "    nginx -t failed, rolling back config"
      # Не оставляем сломанный конфиг: возвращаем предыдущую версию из git
      sudo git -C "$APP_DIR" show "HEAD@{1}:deploy/nginx/plovxana.conf" > /tmp/plovxana-nginx-rollback 2>/dev/null && \
        sudo cp /tmp/plovxana-nginx-rollback "$NGINX_DST" || true
      exit 1
    fi
  else
    echo "    nginx config unchanged — skipping"
  fi
fi

echo "==> [6/6] pm2 reload (zero-downtime if cluster, else restart)"
pm2 reload "$APP_NAME" --update-env || pm2 restart "$APP_NAME" --update-env
pm2 save

echo "==> done: $(date -Is)"
pm2 describe "$APP_NAME" | grep -E "status|uptime|restart" || true
