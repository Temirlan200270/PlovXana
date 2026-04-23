#!/usr/bin/env bash
set -e
URL="http://178.104.163.216"
PAGE="/default/menu"

echo "=== Menu page — gzip vs brotli ==="
SIZE_PLAIN=$(curl -s "${URL}${PAGE}" | wc -c)
SIZE_GZ=$(curl -s -H 'Accept-Encoding: gzip' "${URL}${PAGE}" | wc -c)
SIZE_BR=$(curl -s -H 'Accept-Encoding: br' "${URL}${PAGE}" | wc -c)
printf "  plain : %6d bytes\n" $SIZE_PLAIN
printf "  gzip  : %6d bytes (%d%%)\n" $SIZE_GZ $((SIZE_GZ*100/SIZE_PLAIN))
printf "  brotli: %6d bytes (%d%%)\n" $SIZE_BR $((SIZE_BR*100/SIZE_PLAIN))

echo
echo "=== Negotiated encodings ==="
echo -n "  gzip request   → Content-Encoding: "
curl -sI -H 'Accept-Encoding: gzip' "${URL}${PAGE}" | grep -i content-encoding | tr -d '\r'
echo -n "  brotli request → Content-Encoding: "
curl -sI -H 'Accept-Encoding: br' "${URL}${PAGE}" | grep -i content-encoding | tr -d '\r'

echo
echo "=== JS bundle: sample chunk ==="
SAMPLE=$(curl -s "${URL}${PAGE}" | grep -oE '/_next/static/chunks/[^"]+\.js' | sort -u | head -n 1)
if [ -n "$SAMPLE" ]; then
  echo "sample: $SAMPLE"
  P=$(curl -s "${URL}${SAMPLE}" | wc -c)
  G=$(curl -s -H 'Accept-Encoding: gzip' "${URL}${SAMPLE}" | wc -c)
  B=$(curl -s -H 'Accept-Encoding: br' "${URL}${SAMPLE}" | wc -c)
  printf "  plain : %6d bytes\n" $P
  printf "  gzip  : %6d bytes (%d%%)\n" $G $((G*100/P))
  printf "  brotli: %6d bytes (%d%%)\n" $B $((B*100/P))
fi
