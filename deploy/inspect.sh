#!/usr/bin/env bash
echo "=== whoami ==="
whoami
echo
echo "=== project path ==="
readlink -f ~/plovxana
echo
echo "=== owner of ~/plovxana ==="
ls -ld ~/plovxana
echo
echo "=== pm2 list ==="
pm2 list
echo
echo "=== pm2 systemd unit ==="
systemctl list-units --type=service --no-legend 2>/dev/null | grep -i pm2 || echo "no pm2 service"
echo
echo "=== node and npm ==="
node -v
npm -v
echo
echo "=== git remote & branch ==="
cd ~/plovxana && git remote -v && git branch --show-current
echo
echo "=== sudo without password? ==="
sudo -n true 2>&1 && echo "yes" || echo "no (password required)"
