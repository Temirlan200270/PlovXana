#!/usr/bin/env bash
set -e
HOST="http://178.104.163.216"
echo "=== HTTP status via public Nginx ($HOST) ==="
for url in / /default/menu /privacy; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "${HOST}${url}")
  echo "${code}  ${HOST}${url}"
done
echo
echo "=== <title> from / ==="
curl -s "${HOST}/" | grep -oE '<title>[^<]+</title>' | head -n 1
echo "=== <title> from /default/menu ==="
curl -s "${HOST}/default/menu" | grep -oE '<title>[^<]+</title>' | head -n 1
echo "=== first menu category tabs ==="
curl -s "${HOST}/default/menu" | grep -oE 'tab-cat-[a-z0-9-]+' | sort -u | head -n 10
echo "=== first dish heading ==="
curl -s "${HOST}/default/menu" | grep -oE '<h3[^>]*>[^<]+</h3>' | head -n 5
