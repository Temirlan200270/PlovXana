#!/usr/bin/env bash
URL="http://178.104.163.216/default/menu"

echo "=== menu HTML size ==="
echo -n "uncompressed: "; curl -s "$URL" | wc -c
echo -n "gzip:         "; curl -s -H 'Accept-Encoding: gzip' "$URL" --compressed | wc -c

echo
echo "=== response headers (gzip request) ==="
curl -sI -H 'Accept-Encoding: gzip' "$URL" | sed -n '1,12p'

echo
echo "=== number of <h3 in menu (≈ dish count) ==="
curl -s "$URL" | grep -oc '<h3 '

echo
echo "=== number of <img src= in menu ==="
curl -s "$URL" | grep -oE '<img[^>]+src=' | wc -l

echo
echo "=== largest public/photo files ==="
ls -lhS /home/deploy/plovxana/public/photo/*.jpg 2>/dev/null | head -n 5

echo
echo "=== total JS bundle size on menu page ==="
curl -s "$URL" \
  | grep -oE '/_next/static/[^"]+\.js' \
  | sort -u \
  | while read -r p; do
      size=$(curl -s "http://178.104.163.216$p" | wc -c)
      echo "  $size  $p"
    done | awk '{s+=$1; print} END {print "  ---- total bytes: " s}'
