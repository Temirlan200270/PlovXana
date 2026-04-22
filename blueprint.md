# 🏗️ **Ultimate Blueprint: Restaurant OS (Production-Grade SaaS)**

---

# 📍 Текущий сайт / пилотный тенант

Канонические данные первого заведения (пилот). Публичный контент, JSON-LD, футер и контекст для AI должны совпадать с этим блоком.

## Реквизиты и контакты

* **Название (бренд):** PLOVXAHA
* **Slug (URL, мультитенант):** `plovxana` — публичные пути вида `/plovxana/menu`, `/plovxana/order`
* **Адрес:** ТЦ Saida Plaza, проспект Нурсултана Назарбаева, 60/5, 1 этаж, г. Павлодар
* **Режим работы:** пн — вс, 11:00–24:00
* **Бронь столов:** +7 777 400 77 28 (E.164: `+77774007728`)
* **Доставка:** +7 707 400 77 28 (E.164: `+77074007728`)
* **Особенности:** заведение халяльное; есть доставка
* **Казаны с пловом открываются:** 12:00 • 16:00 • 19:00
* **Instagram:** [https://www.instagram.com/plovxana.pvl/](https://www.instagram.com/plovxana.pvl/)

### Для schema.org (структура адреса)

* **streetAddress:** проспект Нурсултана Назарбаева, 60/5, ТЦ Saida Plaza, 1 этаж
* **addressLocality:** Павлодар
* **addressCountry:** KZ

## Использование в продукте

* Футер, «Контакты», «Как добраться» — брать данные только из этого раздела
* Шаблон `Restaurant` JSON-LD (§4.A): подставлять `name`, адрес, телефоны, часы и ссылки отсюда
* AI-ассистент: часы, два номера (бронь / доставка), халяль, расписание казанов
* Email на домене для Meta и юридических страниц: **TBD** после выбора домена

---

# 🛠 1. TECHNOLOGY STACK (ENGINE)

## 🎯 Frontend

* Next.js 14+ (App Router)
* TypeScript
* Tailwind CSS + shadcn/ui (Radix UI)
* Framer Motion (animations)

---

## ⚙️ State Management

* TanStack Query → серверное состояние (меню, заказы)
* Zustand → клиентское состояние (корзина)

---

## 🧠 Backend / BFF

* Next.js API Routes (основной слой)
* (опционально) FastAPI → если выносишь heavy logic

---

## 🗄 Database / Backend-as-a-Service

* Supabase:

  * PostgreSQL
  * Auth
  * Realtime (WebSockets)
  * Storage (или Cloudinary)

---

## 🖼 Image Pipeline

* [Cloudinary](https://cloudinary.com?utm_source=chatgpt.com) (рекомендуется)
* или Supabase Storage + transformation proxy

---

## 📡 Integrations

* Telegram Bot API (webhooks)
* Meta (WhatsApp Cloud API)
* Email → [Resend](https://resend.com?utm_source=chatgpt.com)

---

## 🤖 AI Layer

* OpenAI (GPT-4o mini)
* или Anthropic Claude 3.5
* через Vercel AI SDK

---

## 🚀 Infra

* Vercel (deploy + edge)
* Custom domain (обязательно)

---

# 🏛 2. DATABASE SCHEMA (SaaS READY)

## 🔑 Core правило

👉 **каждая таблица содержит `restaurant_id`**

---

## 🏢 restaurants

```sql
id (uuid)
name
slug
logo_url
theme_config (jsonb)
settings (jsonb)
created_at
```

---

## 🍽 categories

```sql
id
restaurant_id
name
sort_order
```

---

## 🍔 menu_items

```sql
id
restaurant_id
category_id
name
description
price
image_url
is_available
is_popular
tags (text[])
created_at
```

---

# 🔥 МОДИФИКАТОРЫ (Production Critical)

## modifier_groups

```sql
id
restaurant_id
name
selection_type (single | multiple)
required (boolean)
```

---

## modifiers

```sql
id
group_id
name
price_delta
```

---

## menu_item_modifier_groups

```sql
id
menu_item_id
modifier_group_id
```

---

# 📦 Orders

## orders

```sql
id
restaurant_id
status (pending, cooking, ready, completed)
total_price
customer_info (jsonb)
created_at
```

---

## order_items

```sql
id
order_id
menu_item_id
quantity
price
modifiers_selected (jsonb)
```

---

# 🔐 RLS (ОБЯЗАТЕЛЬНО)

```sql
CREATE POLICY "isolate restaurant data"
ON menu_items
FOR ALL
USING (restaurant_id = auth.uid());
```

---

# 🧩 3. PROJECT STRUCTURE

```text
/app
  /(public)
    /[slug]
      /menu
      /order

  /(admin)
    /dashboard
    /menu-manager
    /orders

/components
  /ui
  /features
  /layout
  /ai

/lib
  /supabase
  /seo
  /utils

/services
  telegram.service.ts
  meta.service.ts
  payment.service.ts
```

---

# 💎 4. SENIOR FEATURES (СКРЫТЫЙ УРОВЕНЬ)

---

## 🌍 A. SEO + LOCAL BUSINESS

### JSON-LD (обязательно)

```tsx
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "...",
  "address": {...},
  "servesCuisine": "...",
}
```

👉 **Канонические значения для пилота:** поля вроде `name`, `address`, `telephone`, часы работы и URL соцсетей заполнять из раздела **«Текущий сайт / пилотный тенант»** в начале документа; полный JSON здесь не дублировать.

---

## 📸 Dynamic OG Images

* через `@vercel/og`
* шаринг меню → красиво выглядит

---

## ⚡ B. PERFORMANCE

### Must-have:

* next/image + blur placeholder
* lazy loading
* streaming (React Suspense)

---

## Skeleton UI

👉 вместо спиннера

---

## ⚡ C. REALTIME

* Supabase Realtime
* WebSockets

```ts
onInsert(order) → UI update + sound
```

---

# 🔗 5. INTEGRATIONS

---

## 📩 Telegram Bot

Flow:

```
Order → API → Telegram webhook → Owner notification
```

---

## 💬 WhatsApp (Meta API)

* шаблоны сообщений
* статус заказа

---

## 💳 Payments (HOOK)

```ts
interface PaymentProvider {
  createPayment(order): Promise<string>;
}
```

---

# 🛡️ 6. META VERIFICATION (CRITICAL)

---

## 📋 Checklist

### 1. Legal

* /privacy-policy
* /terms-of-service
* cookie banner

---

### 2. Contacts

* адрес и телефоны в E.164 — см. раздел **«Текущий сайт / пилотный тенант»** (начало документа)
* email на домене — **TBD** после выбора домена

---

### 3. Business data

* совпадает с документами

---

### 4. Tracking

* Facebook Pixel
* Conversions API

---

# 🧠 7. AI AGENT (DIFFERENTIATOR)

---

## 🧩 Архитектура

```
User → AI → Menu context → Response
```

---

## RAG

* передаём меню в prompt
* фильтрация по категориям

---

## Возможности

* рекомендации
* аллергены
* подбор заказа

---

# 🧱 8. UX / PRODUCT LAYER

---

## ❗ ОБЯЗАТЕЛЬНО

### Error Boundary

* graceful fallback

---

### Skeleton Loading

* perceived performance

---

### PWA

* installable app

---

### Accessibility

* aria-labels
* keyboard nav

---

# 🖼 9. IMAGE PIPELINE

---

## Flow

1. Upload (admin)
2. Cloudinary:

   * resize
   * compress
   * WebP
3. CDN delivery
4. blur placeholder

---

# 🏢 10. MULTI-TENANCY

---

## Подход

* shared DB
* restaurant_id isolation

---

## Альтернатива (будущее)

* subdomain:

  * cafeA.domain.com
  * cafeB.domain.com

---

# 🚀 11. ROADMAP (REALISTIC)

---

## 🟢 Phase 1 — Foundation (5–7 дней)

* Next.js setup
* Supabase
* UI Kit
* Layout

---

## 🟢 Phase 2 — Menu (5–7 дней)

* API
* Menu UI
* категории
* modifiers

---

## 🟡 Phase 3 — Admin (7–10 дней)

* CRUD
* upload images
* dashboard

---

## 🟡 Phase 4 — Orders (5–7 дней)

* cart
* order flow
* Telegram

---

## 🔵 Phase 5 — AI (5–10 дней)

* chatbot
* recommendations

---

## 🔥 Phase 6 — Production (5–7 дней)

* SEO
* Meta verification
* performance

---

# ❌ 12. ЧТО СОЗНАТЕЛЬНО НЕ ДЕЛАЕМ

* склад
* бухгалтерия
* ERP
* сложная аналитика

👉 это V2+

---

# 💰 13. SAAS STRATEGY

---

## 💸 Монетизация

* подписка ($20–50)
* доп. интеграции

---

## 📦 Value

* сайт + заказы
* AI агент
* автоматизация
