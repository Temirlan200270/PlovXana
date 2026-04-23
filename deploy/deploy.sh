#!/usr/bin/env bash
# Деплой PlovХана на VPS из main.
# Запускается GitHub Actions по SSH под юзером `deploy`.
# Idempotent: можно дёргать сколько угодно.
set -euo pipefail

APP_DIR="${APP_DIR:-/home/deploy/plovxana}"
APP_NAME="${APP_NAME:-plovxana}"
BRANCH="${BRANCH:-main}"

cd "$APP_DIR"

echo "==> [1/5] git fetch --prune"
git fetch --prune origin

echo "==> [2/5] reset to origin/$BRANCH"
git reset --hard "origin/$BRANCH"

echo "==> [3/5] npm ci (clean install, dev deps included for build)"
# Next нужен @types/* и tailwind на этапе build, поэтому ставим всё.
npm ci --no-audit --no-fund

echo "==> [4/5] next build"
rm -rf .next
npm run build

echo "==> [5/5] pm2 reload (zero-downtime if cluster, else restart)"
# reload пытается без даунтайма; если процесс не поддерживает — fallback на restart.
pm2 reload "$APP_NAME" --update-env || pm2 restart "$APP_NAME" --update-env
pm2 save

echo "==> done: $(date -Is)"
pm2 describe "$APP_NAME" | grep -E "status|uptime|restart" || true
