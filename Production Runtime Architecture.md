Status: Normative (runtime-рельсы) + Conceptual (runtime theme через CSS vars — roadmap)

> **Heritage note (v1):** разделы про middleware / tenant resolution / data-flow / cache / realtime остаются валидными и отражают фактический код. Раздел про **runtime theme через CSS-переменные `--primary: ...`** (§ Theme Runtime) — это **vision для v2** multi-brand темизации. В v1 Heritage Edition палитра PLOVXAHA (`umber/gold/ember/cream`) зашита в `tailwind.config.ts`, а параметры атмосферы по секциям — в `config/atmosphere.ts`. Per-tenant override через CSS-переменные активируется, когда в платформу зайдёт второй ресторан (см. `docs/compliance-checklist.md §10`).

# 🚀 Restaurant OS — Production Runtime Architecture (v1.0)

## 🧠 Главная идея

Ты должен думать не “страницами”, а **потоком запроса**:

> Request → Tenant Resolution → Auth → Policy → Data → Cache → UI → Realtime updates

---

# 🌐 1. Global System Overview

```
                 ┌────────────────────────────┐
User Request →   │  Edge (Vercel Middleware)  │
                 └────────────┬───────────────┘
                              ↓
                 ┌────────────────────────────┐
                 │ Tenant Resolution Layer    │  ← domain/subdomain
                 └────────────┬───────────────┘
                              ↓
                 ┌────────────────────────────┐
                 │ Auth Layer (Supabase Auth) │
                 └────────────┬───────────────┘
                              ↓
                 ┌────────────────────────────┐
                 │ RBAC / Policy Layer        │
                 └────────────┬───────────────┘
                              ↓
                 ┌────────────────────────────┐
                 │ Data Access Layer (RLS DB) │
                 └────────────┬───────────────┘
                              ↓
                 ┌────────────────────────────┐
                 │ Cache Layer (Edge + ISR)   │
                 └────────────┬───────────────┘
                              ↓
                 ┌────────────────────────────┐
                 │ UI Layer (Server/Client)   │
                 └────────────┬───────────────┘
                              ↓
                 ┌────────────────────────────┐
                 │ Realtime Layer (WS)        │
                 └────────────────────────────┘
```

---

# 🧭 2. Request Lifecycle (самое важное)

## 📌 Step 1 — Edge Entry (Vercel Middleware)

```ts id="rt1"
host: plovhana.restaurantos.com
```

### Делает:

* extracts tenant slug
* injects headers
* blocks invalid tenants (early fail)

```ts id="rt2"
x-tenant-id: "plovhana"
x-region: "eu-west"
```

---

## 📌 Step 2 — Tenant Context Bootstrap

Server получает:

```ts id="rt3"
const tenant = await getTenantFromHeader()
```

### Это:

* theme
* settings
* currency
* feature flags

👉 Это **ключ всей системы**

---

## 📌 Step 3 — Auth Layer (Supabase)

Разделяем:

| Type  | Access            |
| ----- | ----------------- |
| guest | menu only         |
| user  | orders            |
| staff | kitchen dashboard |
| admin | full control      |

---

## 📌 Step 4 — RBAC Policy Engine

```ts id="rt4"
can(user, "update_menu")
can(user, "view_orders")
```

👉 НЕ в UI
👉 НЕ в frontend logic
👉 ONLY server-side

---

## 📌 Step 5 — Data Access Layer (Supabase RLS)

🔥 это твой **real security wall**

```sql id="rt5"
USING (tenant_id = auth.jwt()->>'tenant_id')
```

👉 даже если frontend сломается — данные не утекут

---

## 📌 Step 6 — Cache Strategy Layer (очень важно)

### 3 типа данных:

---

### 🟢 STATIC (ISR)

* menu
* categories
* restaurant info

```ts id="rt6"
revalidate = 60
```

---

### 🟡 SEMI-DYNAMIC (Edge Cache)

* theme
* tenant config

```ts id="rt7"
cache: "force-cache"
```

---

### 🔴 REALTIME (NO CACHE)

* orders
* kitchen updates

```ts id="rt8"
cache: "no-store"
```

---

# ⚡ 3. Data Flow (Menu Page example)

```
User opens /menu
        ↓
Middleware resolves tenant
        ↓
Server fetch:
  getMenu(tenant_id)
        ↓
Check cache (ISR)
        ↓
If stale → Supabase query
        ↓
Apply tenant theme
        ↓
Render Server Component
        ↓
Hydrate Client (cart + UI)
```

---

# 🔥 4. Realtime Architecture (Orders system)

```
Customer → creates order
        ↓
Supabase insert
        ↓
Trigger:
  - Realtime channel
  - Telegram webhook
        ↓
Kitchen Dashboard updates instantly
        ↓
Sound notification + UI animation
```

👉 latency target: **<200ms**

---

# 🎨 5. Theme Runtime Injection (VERY IMPORTANT)

## Flow:

```
Tenant DB
   ↓
theme JSON
   ↓
applyTheme()
   ↓
CSS Variables runtime
   ↓
UI instantly adapts
```

Example:

```ts id="rt9"
:root {
  --primary: 201 169 110;
  --radius: 16px;
}
```

---

# 🧿 6. Ornament System Runtime Layer

This is your “Stripe + cultural identity layer”

```
Theme
  ↓
ornament config
  ↓
Parallax engine
  ↓
DOM layer injection
```

### Layers:

| Layer              | Speed |
| ------------------ | ----- |
| background texture | 0.1   |
| glow               | 0.2   |
| ornament SVG       | 0.3   |
| content            | 0     |

---

# 🧠 7. Full System Boundaries

## ❌ NEVER in frontend:

* tenant validation
* permissions
* pricing logic
* order validation

## ✅ ONLY in backend/server:

* RBAC
* RLS
* tenant resolution
* order processing

---

# 🧱 8. Runtime Layers Summary

## You now have 6 production layers:

### 1. Edge Layer

→ middleware, tenant resolution

### 2. Auth Layer

→ Supabase auth

### 3. Policy Layer

→ RBAC

### 4. Data Layer

→ PostgreSQL + RLS

### 5. Cache Layer

→ ISR / Edge / Realtime split

### 6. Presentation Layer

→ Next.js + Theme Engine + UI Kit

---

# ⚠️ 9. What most devs MISS (и почему это важно)

Если этого нет:

* SaaS не масштабируется
* data leaks возможны
* performance нестабильен
* themes ломаются
* admin unsafe

---

# 🚀 10. Final Mental Model (очень важно)

Думай так:

> “Каждый request = проходит 6 фильтров перед UI”

---