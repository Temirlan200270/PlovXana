# Domain setup: `plovxanapvl.com` (VPS + Nginx + Let's Encrypt)

Audience: техлид, DevOps  
Purpose: подключить домен к текущему VPS и включить HTTPS так, чтобы последующие деплои не ломали конфиг.

## Контекст проекта

- Прод: VPS `178.104.163.216`
- Nginx-конфиг берётся из репо: `deploy/nginx/plovxana.conf`
- Деплой (`deploy/deploy.sh`) синхронизирует Nginx-конфиг на VPS в `/etc/nginx/sites-available/plovxana`

**Важно:** если `certbot` изменит конфиг только на сервере, следующий деплой перезапишет его из git. Поэтому финальный HTTPS-vhost должен жить в `deploy/nginx/plovxana.conf`.

## 1) DNS (Cloudflare)

В Cloudflare → **DNS** выставить записи и отключить проксирование (серые облака = **DNS only**) на время выпуска сертификата:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | `178.104.163.216` | DNS only |
| A | `www` | `178.104.163.216` | DNS only |

Проверка (любой публичный резолвер):

```bash
nslookup plovxanapvl.com 1.1.1.1
nslookup www.plovxanapvl.com 1.1.1.1
```

Ожидаемо: оба домена резолвятся в `178.104.163.216`.

## 2) HTTP vhost (до HTTPS)

В репо зафиксировать `server_name` под домен и сохранить ответы по IP для health-check GitHub Actions:

- `deploy/nginx/plovxana.conf`: отдельный `server` на `80 default_server` для IP/`_`, и отдельный `server` на `80` для домена (редирект на HTTPS).

Деплой применит конфиг автоматически.

## 3) Сертификат Let's Encrypt (certbot)

На VPS (под `deploy`, через `ssh plovxana`):

```bash
sudo apt-get update -y
sudo apt-get install -y certbot python3-certbot-nginx
```

Выпуск и автоконфигурация Nginx:

```bash
sudo certbot --nginx \
  -d plovxanapvl.com -d www.plovxanapvl.com \
  --agree-tos -m temirlan200270@gmail.com \
  --redirect --no-eff-email
```

Проверка таймера и dry-run обновления:

```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

## 4) Зафиксировать HTTPS в git

После успешного certbot **свести** итоговый конфиг в `deploy/nginx/plovxana.conf`:

- `80`:
  - IP/`default_server` → прокси на Next (для health-check по IP)
  - `plovxanapvl.com`/`www` → 301 на `https://plovxanapvl.com`
- `443`:
  - `www` → 301 на apex
  - apex → прокси на Next + `ssl_certificate` из `/etc/letsencrypt/live/plovxanapvl.com/*`
  - HSTS (после стабилизации)
  - (опционально) OCSP stapling

После коммита/пуша деплой должен пройти `nginx -t` и `systemctl reload nginx`.

## 5) NEXT_PUBLIC_SITE_URL (каноникал/OG)

На VPS в `~/plovxana/.env.production`:

```bash
NEXT_PUBLIC_SITE_URL=https://plovxanapvl.com
```

Применить:

```bash
pm2 reload plovxana --update-env || pm2 restart plovxana --update-env
```

## 6) Проверки

```bash
curl -I https://plovxanapvl.com/
curl -I http://plovxanapvl.com/
curl -I https://www.plovxanapvl.com/
curl -I http://178.104.163.216/default/menu
```

Ожидаемо:

- `https://plovxanapvl.com/` → 200
- `http://plovxanapvl.com/` → 301 → https apex
- `https://www.plovxanapvl.com/` → 301 → https apex
- IP health-check остаётся 200

