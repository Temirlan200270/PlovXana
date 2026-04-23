#!/usr/bin/env bash
cd /home/deploy/plovxana
echo "=== /public contents ==="
find public -maxdepth 2 -type d
echo
echo "=== total files in public/photo ==="
ls public/photo 2>/dev/null | wc -l
echo
echo "=== first 5 photo files ==="
ls public/photo 2>/dev/null | head -n 5
echo
echo "=== sample image_url values from HTML of /default/menu ==="
curl -s http://127.0.0.1:3000/default/menu \
  | grep -oE 'src="[^"]*"' \
  | grep -viE '\.js|_next/static/chunks|/manifest|/favicon' \
  | head -n 20
echo
echo "=== probe public dir via Nginx ==="
FIRST=$(ls public/photo 2>/dev/null | head -n 1)
if [ -n "$FIRST" ]; then
  echo "first file: $FIRST"
  curl -sI "http://178.104.163.216/photo/$FIRST" | head -n 6
fi
echo
echo "=== nginx /_next/ cache header probe ==="
SAMPLE=$(curl -s http://127.0.0.1:3000/default/menu \
  | grep -oE '/_next/static/[^"]+\.js' | head -n 1)
echo "sample: $SAMPLE"
[ -n "$SAMPLE" ] && curl -sI "http://178.104.163.216$SAMPLE" | head -n 8
echo
echo "=== TTFB from localhost (node direct) ==="
curl -o /dev/null -s -w 'time_connect=%{time_connect} time_starttransfer=%{time_starttransfer} size=%{size_download} bytes\n' http://127.0.0.1:3000/default/menu
echo "=== TTFB via Nginx public ==="
curl -o /dev/null -s -w 'time_connect=%{time_connect} time_starttransfer=%{time_starttransfer} size=%{size_download} bytes\n' http://178.104.163.216/default/menu
