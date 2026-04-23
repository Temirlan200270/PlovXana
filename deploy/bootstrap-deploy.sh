#!/usr/bin/env bash
# Подготовка VPS под GitHub Actions auto-deploy.
# Запускать ОДИН РАЗ под юзером `deploy` на VPS.
set -euo pipefail

KEY="$HOME/.ssh/gh-actions-deploy"

echo "=== 1. SSH key for GitHub Actions ==="
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
if [ ! -f "$KEY" ]; then
  ssh-keygen -t ed25519 -N "" -C "github-actions-plovxana" -f "$KEY"
else
  echo "key already exists at $KEY — skip generation"
fi

PUB="$(cat "${KEY}.pub")"
AUTH="$HOME/.ssh/authorized_keys"
touch "$AUTH"
chmod 600 "$AUTH"
if ! grep -qF "$PUB" "$AUTH"; then
  echo "$PUB" >> "$AUTH"
  echo "public key appended to authorized_keys"
else
  echo "public key already in authorized_keys"
fi

echo
echo "=== 2. PM2 systemd autostart ==="
if ! systemctl list-unit-files | grep -q "^pm2-deploy\.service"; then
  STARTUP_CMD="$(pm2 startup systemd -u deploy --hp /home/deploy 2>&1 | grep -E '^sudo' | tail -n 1 || true)"
  if [ -n "$STARTUP_CMD" ]; then
    echo "running: $STARTUP_CMD"
    eval "$STARTUP_CMD"
  else
    echo "could not derive pm2 startup command, run manually: pm2 startup"
  fi
else
  echo "pm2-deploy.service already installed"
fi
pm2 save

echo
echo "=== 3. Verify systemd unit ==="
systemctl is-enabled pm2-deploy 2>/dev/null || echo "warning: pm2-deploy not enabled"
systemctl is-active pm2-deploy 2>/dev/null || echo "warning: pm2-deploy not active"

echo
echo "============================================================"
echo "  COPY THE PRIVATE KEY BELOW INTO GitHub Secret VPS_SSH_KEY"
echo "  (everything between BEGIN and END lines, inclusive)"
echo "============================================================"
echo
cat "$KEY"
echo
echo "============================================================"
echo "  Other secrets to add in GitHub:"
echo "    VPS_HOST = 178.104.163.216"
echo "    VPS_USER = deploy"
echo "    VPS_PATH = /home/deploy/plovxana"
echo "============================================================"
