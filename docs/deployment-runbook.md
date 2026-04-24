# Deployment runbook (Vercel + Supabase)

Status: Operational  
Audience: техлид, DevOps, владелец релиза  
Purpose: минимальные шаги выката и проверки гостевого заказа (service role + RLS по миграциям).

Связано с: [testing-strategy.md](testing-strategy.md), [security-spec.md](security-spec.md), [change-checklist.md](change-checklist.md).

Локально без Supabase: [README.md](../README.md) (раздел «Локальный запуск»).
Домен + HTTPS на VPS: [domain-setup.md](domain-setup.md).

---

## Step 1. База данных (Supabase)

1. Подключить проект Supabase (или создать).
2. Применить миграции из `supabase/migrations/` — через [Supabase CLI](https://supabase.com/docs/guides/cli) (`supabase db push` / linked project) либо вручную в **SQL Editor** в порядке имён файлов (от старых к новым).
3. Убедиться, что задействованы в том числе политики для заказов и `audit_logs` (см. `20260420_*`, `20260421_*`), для KDS — `20260422_0007_realtime_orders.sql` (публикация `orders` в `supabase_realtime`), для стоп-листа меню и Realtime на каталоге — `20260424_0008_menu_realtime.sql` (`menu_items` + RLS staff UPDATE), для `tenants.telegram_chat_id` — `20260425_tenant_telegram.sql`.

Без актуальных миграций гостевой INSERT в `orders` может не соответствовать ожиданиям RLS и кода.

---

## Step 2. Переменные окружения (Vercel)

В настройках проекта Vercel (Production / Preview — по политике команды) задать:

| Переменная | Где видна | Обязательность |
|------------|-----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Клиент + сервер | Да |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Клиент + сервер | Да |
| `SUPABASE_SERVICE_ROLE_KEY` | **Только сервер** (не включать в `NEXT_PUBLIC_*`) | Да для оформления гостевых заказов |
| `NEXT_PUBLIC_SITE_URL` | Обычно публичный URL сайта | Да для корректных canonical/OG |
| `NEXT_PUBLIC_DEFAULT_TENANT_SLUG` | Опционально | Пилот, см. `lib/tenant/getTenant.ts` |
| `TELEGRAM_BOT_TOKEN` | Только сервер | Опционально: уведомления о новых заказах (`lib/integrations/telegram.ts`) |
| `TELEGRAM_CHAT_ID` | Только сервер | Опционально: fallback chat, если в `tenants.telegram_chat_id` пусто (после миграции `20260425_tenant_telegram.sql`) |

Секрет service role и токен Telegram хранить только в Vercel Environment Variables с областью **Server**.

Входящие WhatsApp и AI-оркестрация **не настраиваются в этом проекте** — см. [integration-boundaries.md](integration-boundaries.md).

---

## Step 3. Проверка после деплоя

1. Открыть публичный сайт, `/` и `/[slug]/menu` (для пилота — `/plovxana/menu`).
2. Оформить **тестовый гостевой заказ** (корзина → отправка). Убедиться, что заказ создаётся без ошибки «не задан SERVICE ROLE».
3. Опционально: в Supabase Table Editor проверить строку в `orders` / `audit_logs` (если миграция аудита применена).

Локально или в CI со включённым секретом можно прогнать:

```bash
set SMOKE_REQUIRE_SERVICE_ROLE=1
npm run test:smoke
```

(На Windows PowerShell: `$env:SMOKE_REQUIRE_SERVICE_ROLE=1; npm run test:smoke`.)

При отсутствии `SUPABASE_SERVICE_ROLE_KEY` скрипт завершится с сообщением `MISSING_SERVICE_ROLE_KEY`. Стандартный `npm run test:smoke` **без** этой переменной секрет не требует — так устроен локальный и типичный CI без Supabase-секретов.

---

## RC1: операционная верификация (строки `partial` в compliance-checklist)

Цель: перед продуктовым RC1 закрыть **проверяемые** факты для миграций, уведомлений и ручных сценариев из чеклиста — без требования «идеального» BI/RBAC.

### Миграции Supabase (обязательный порядок)

Уже перечислены в Step 1; для RC1 явно убедитесь, что на целевом проекте применены как минимум:

| Файл | Зачем |
|------|--------|
| `20260420_0005_orders_rls_service_writes.sql` | RLS для заказов + гостевой путь через service role |
| `20260421_0006_audit_logs.sql` | Таблица `audit_logs` (если используете аудит оформления) |
| `20260422_0007_realtime_orders.sql` | Realtime publication для KDS (`orders`) |
| `20260424_0008_menu_realtime.sql` | Стоп-лист + Realtime на `menu_items` |
| `20260425_tenant_telegram.sql` | Колонка `tenants.telegram_chat_id` |

После `db push` или ручного прогона SQL: в Dashboard → Database → проверить, что таблицы/политики соответствуют ожиданиям кода (см. [security-spec.md](security-spec.md)).

### Env: Telegram

1. Задать `TELEGRAM_BOT_TOKEN` (Server) и либо `TELEGRAM_CHAT_ID`, либо заполнить `tenants.telegram_chat_id` для пилота (после миграции `20260425_*`).
2. Оформить тестовый заказ с сайта → в чате должно появиться сообщение (сбой Telegram **не** должен ломать ответ гостю; смотрите server logs).

### Ручные проверки по зонам

| Зона | Действие | Ожидание |
|------|-----------|----------|
| **Гостевой заказ + RLS** | Корзина → оформление на `/[slug]/menu` | Заказ в `orders`, нет ошибки service role; при необходимости строка в `audit_logs` |
| **Стоп-лист** | Staff: `/admin/menu-editor` → снять позицию с продажи | Позиция исчезает/помечена на публичном меню; без полного перезапуска — см. Realtime + `router.refresh` |
| **KDS** | Открыть `/admin/live-orders`, параллельно оформить заказ | Карточка заказа появляется без перезагрузки (Realtime) |
| **Canonical / OG** | В Vercel задать `NEXT_PUBLIC_SITE_URL` = точный публичный origin (Production и отдельно Preview, если нужен корректный OG на превью) | В `<head>` главной и меню `link[rel=canonical]` указывает на тот же host; unit: `tests/seo-canonical.test.ts` |

**Preview:** для веток Vercel задайте `NEXT_PUBLIC_SITE_URL` на URL preview-деплоя (или осознанно оставьте production URL — тогда canonical на превью будет «продовым»; это компромисс, зафиксируйте политику команды).

---

## Примечания

- Полный индекс документов: [documentation-map.md](documentation-map.md).
- Карта кода и границы слоёв: [CODEBASE.md](CODEBASE.md).
