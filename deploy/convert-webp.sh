#!/usr/bin/env bash
set -euo pipefail

if ! command -v cwebp >/dev/null 2>&1; then
  echo "installing webp tools..."
  sudo apt-get install -y webp >/dev/null 2>&1
fi

cd /home/deploy/plovxana/public/photo
for f in *.jpg; do
  out="${f%.jpg}.webp"
  if [ ! -f "$out" ] || [ "$f" -nt "$out" ]; then
    cwebp -q 82 -m 6 "$f" -o "$out" 2>/dev/null
    echo "converted $f -> $out"
  else
    echo "up-to-date: $out"
  fi
done

echo
echo "--- before/after sizes ---"
for f in *.jpg; do
  jpg=$(stat -c%s "$f")
  w="${f%.jpg}.webp"
  if [ -f "$w" ]; then
    webp=$(stat -c%s "$w")
    pct=$(awk "BEGIN { printf \"%.0f\", 100 - ($webp*100/$jpg) }")
    printf "  %-24s  %6d KB -> %6d KB  (-%s%%)\n" "${f%.jpg}" $((jpg/1024)) $((webp/1024)) "$pct"
  fi
done
