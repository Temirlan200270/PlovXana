Status: Normative

# 📄 **Technical Specification: Restaurant OS (SaaS-Ready, Production)**

**Project Name:** Restaurant OS
**Version:** 1.1.0 (Production Ready)
**Type:** Multi-tenant SaaS Platform
**Architecture Style:** Modular Monolith → scalable to microservices

---

# 🧠 1. EXECUTIVE SUMMARY

Restaurant OS — это:

> **AI-powered SaaS платформа для ресторанов**
> с сайтами, заказами, автоматизацией и аналитикой

---

## 🔺 Системные зоны

### 1. Public Portal (B2C)

* меню
* заказ
* AI ассистент

---

### 2. Admin Engine (B2B)

* управление меню
* live-заказы
* аналитика

---

### 3. Integration Layer

* Telegram
* Meta (WhatsApp)
* Payments

---

---

# 🎯 2. CORE GOALS

| Цель          | Метрика           |
| ------------- | ----------------- |
| Meta Approval | ✅                 |
| Performance   | Lighthouse ≥ 90   |
| UX            | Conversion-driven |
| SaaS          | Multi-tenant      |

---

---

# 🏗 3. SYSTEM ARCHITECTURE

## 📐 High-Level

```id="sysarch"
Client (Next.js)
   ↓
BFF Layer (Next API / Server Actions)
   ↓
Domain Services
   ↓
PostgreSQL (Supabase)
   ↓
External Services
```

---

## 🧩 Layers

### 1. Presentation Layer

* React components
* Server Components + Client Components

---

### 2. BFF (Backend For Frontend)

* API routes
* Server Actions

---

### 3. Domain Layer (ВАЖНО)

* menu.service.ts
* order.service.ts
* ai.service.ts

👉 Никакой бизнес-логики в UI

---

### 4. Data Layer

* Supabase client
* SQL + RLS

---

---

# 🏛 4. DATABASE ARCHITECTURE (FULL)

---

## 🏢 tenants

```sql id="t1"
id uuid PK
slug text UNIQUE
name text
settings jsonb
is_active boolean
created_at timestamp
```

---

## 🍽 categories

```sql id="t2"
id uuid PK
tenant_id uuid FK
name text
sort_order int
```

---

## 🍔 menu_items

```sql id="t3"
id uuid PK
tenant_id uuid FK
category_id uuid FK
name text
description text
price numeric
image_url text
is_available boolean
is_popular boolean
attributes jsonb
created_at timestamp
```

---

# 🔥 MODIFIERS (CRITICAL)

---

## modifier_groups

```sql id="t4"
id uuid PK
tenant_id uuid
name text
selection_type text
required boolean
```

---

## modifiers

```sql id="t5"
id uuid PK
group_id uuid
name text
price_delta numeric
```

---

## menu_item_modifier_groups

```sql id="t6"
id uuid PK
menu_item_id uuid
modifier_group_id uuid
```

---

---

## 📦 orders

```sql id="t7"
id uuid PK
tenant_id uuid
status text
customer_data jsonb
total_amount numeric
created_at timestamp
```

---

## 📦 order_items

```sql id="t8"
id uuid PK
order_id uuid
menu_item_id uuid
quantity int
price numeric
modifiers_selected jsonb
```

---

# ⚡ INDEXES (IMPORTANT)

```sql id="idx"
CREATE INDEX idx_menu_items_tenant ON menu_items(tenant_id);
CREATE INDEX idx_orders_tenant ON orders(tenant_id);
```

---

# 🔐 RLS

```sql id="rls"
USING (tenant_id = auth.uid())
```

---

---

# 🔌 5. API DESIGN

---

## 📡 Menu API

### GET /api/menu

```json id="api1"
{
  "categories": [],
  "items": []
}
```

---

## 📡 Orders API

### POST /api/orders

```json id="api2"
{
  "items": [],
  "customer": {}
}
```

---

## 📡 Admin API

* CRUD menu
* upload images

---

---

# 🔄 6. REAL-TIME SYSTEM

---

## 📡 Supabase Realtime

```ts id="rt"
channel("orders")
→ INSERT → UI update + sound
```

---

## UX требования

* мгновенный апдейт
* звук
* без refresh

---

---

# 🖼 7. IMAGE PIPELINE

---

## Flow

1. upload (admin)
2. processing:

   * resize
   * WebP
   * compress
3. CDN delivery

---

## ❗ REQUIREMENTS

* max size ≤ 300KB
* blur placeholder
* responsive images

---

---

# 🤖 8. AI LAYER

---

## Архитектура

```id="ai"
User → AI → Menu Context → Response
```

---

## RAG

* передаём меню
* фильтрация
* structured prompt

---

## Примеры

* рекомендации
* аллергены
* подбор заказа

---

---

# 🔗 9. INTEGRATIONS

---

## Telegram

```id="tg"
Order → webhook → message
```

---

## Meta (WhatsApp)

* шаблоны сообщений
* статус заказа

---

## Payments

```ts id="pay"
interface PaymentProvider {}
```

---

---

# 🌍 10. SEO

---

## JSON-LD

* Restaurant
* Menu

---

## Meta tags

* OG
* Twitter

---

---

# 🛡 11. SECURITY

---

## MUST

* RLS
* input validation (Zod)
* XSS protection

---

---

# ⚡ 12. PERFORMANCE

---

## MUST

* SSR / ISR
* lazy loading
* skeleton UI
* caching (React Query)

---

---

# 🧱 13. FRONTEND STRUCTURE

```bash
/src
  /app
  /components
  /lib
  /services
  /store
```

---

---

# 🎨 14. DESIGN CONSTRAINTS

---

## Colors

* dark
* gold accent

---

## Typography

* Playfair
* Inter

---

---

# 🚀 15. ROADMAP

---

## Phase 1

* setup
* DB

---

## Phase 2

* menu

---

## Phase 3

* admin

---

## Phase 4

* orders

---

## Phase 5

* AI

---

## Phase 6

* production polish

---

# 💰 16. SAAS MODEL

---

## Multi-tenancy

* shared DB
* isolation

---

## Billing

* subscription

---

---

# 🧠 17. FINAL ENGINEERING NOTES

---

## ❗ Anti-patterns

* бизнес-логика в UI
* отсутствие RLS
* отсутствие modifiers

---

## ✅ Best practices

* modular architecture
* typed APIs
* reusable components