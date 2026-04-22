Status: Conceptual

# 🍽️ Restaurant OS — Production-Grade Multi-Tenant SaaS Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square\&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square\&logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI-38B2AC?style=flat-square\&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square\&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **Restaurant OS** is a production-grade, multi-tenant SaaS platform for modern restaurant operations — combining high-conversion web presence, real-time order management, AI-powered customer interaction, and business automation.

This is not a website template.
This is a **restaurant operating system**.

## Current status (v1.0 pilot)

What is **implemented and shippable** in this repo today: Next.js App Router public site, tenant-aware routing, SSR menu with modifiers, cart and **server-validated guest checkout** (requires `SUPABASE_SERVICE_ROLE_KEY` on the server), SEO/JSON-LD baseline, and admin shell scaffolding.

What remains **roadmap / not production-complete** in this codebase: AI Concierge (beyond static demo copy), realtime kitchen flow, full multi-tenant content CMS, and enterprise integrations described in vision sections below.

## Documentation (for contributors and tooling)

Read in this order: [docs/documentation-map.md](docs/documentation-map.md) (index), [docs/CODEBASE.md](docs/CODEBASE.md) (repository layout), [docs/master-spec.md](docs/master-spec.md) (implementation contract), [docs/compliance-checklist.md](docs/compliance-checklist.md) (current compliance state), then [docs/security-spec.md](docs/security-spec.md) and [docs/testing-strategy.md](docs/testing-strategy.md) as needed. Before you consider a change done, use [docs/change-checklist.md](docs/change-checklist.md) (with Git or without). Deploy steps: [docs/deployment-runbook.md](docs/deployment-runbook.md).

### Локальный запуск (быстро)

1. Установите зависимости: `npm install`
2. Скопируйте [`.env.example`](.env.example) в **`.env.local`** (файл уже в `.gitignore`).
3. Чтобы **не подключать Supabase**, оставьте `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY` пустыми — главная и меню работают с пилотными данными; полное меню/заказ с БД появятся после заполнения ключей и миграций.
4. Запуск: `npm run dev` → откройте в браузере URL из консоли (часто `http://localhost:3000`). Если порт занят, Next выберет другой (например `3001`) — тогда задайте в `.env.local` строку `NEXT_PUBLIC_SITE_URL` с тем же хостом и портом, чтобы canonical/OG совпадали.
5. Оформление гостевого заказа локально потребует `SUPABASE_SERVICE_ROLE_KEY` и настроенную БД (см. [deployment-runbook.md](docs/deployment-runbook.md)).

---

## 🧠 Why this exists

Modern restaurants suffer from:

* fragmented ordering systems
* outdated UI/UX (PDF menus, static websites)
* no automation between orders → kitchen → staff
* lack of digital presence optimized for Google + Meta
* zero data-driven decision systems

**Restaurant OS solves this by turning every restaurant into a digital-first SaaS node.**

---

## ✨ Core Capabilities

### 🌐 Customer Experience Layer

* Ultra-fast SSR menu (Next.js App Router)
* Interactive smart menu with filtering & cart
* Premium “Dark Luxury” UI system
* AI Concierge (menu-aware assistant)
* Mobile-first, PWA-ready experience

---

### ⚙️ Business Layer (SaaS Core)

* Multi-tenant architecture (1000+ restaurants ready)
* Real-time order system (WebSockets / Supabase Realtime)
* Role-based staff system (owner / manager / waiter / chef)
* Dynamic menu & pricing engine
* Modifier system (complex orders like real POS systems)

---

### 🤖 AI Layer

* Context-aware restaurant assistant
* Menu-trained RAG system (Retrieval Augmented Generation)
* Customer recommendation engine
* Allergy & ingredient awareness system

---

### 🛡️ Enterprise & Compliance

* Meta Platforms verification-ready architecture
* WhatsApp Business API integration ready
* GDPR-style data isolation (tenant-level RLS)
* Audit logging system (enterprise-grade traceability)

---

## 🏗️ System Architecture

```text
Client (Next.js)
      ↓
Server Actions / API Layer
      ↓
Supabase (PostgreSQL + Realtime + Auth)
      ↓
AI Layer (OpenAI / Vercel AI SDK)
      ↓
External Integrations (Meta / Telegram / Payments)
```

---

## 🧱 Project Structure

```bash
/app            → App Router (Public + Admin)
/components     → UI Kit + Domain Components
/lib            → Database + utilities + SEO layer
/services       → External integrations (AI, Meta, Bots)
/store          → State management (Zustand)
/types          → TypeScript domain models
```

---

## ⚙️ Tech Stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Frontend  | Next.js 14, TypeScript                |
| Styling   | Tailwind CSS, shadcn/ui               |
| Animation | Framer Motion                         |
| Backend   | Supabase (PostgreSQL + Realtime)      |
| State     | Zustand + React Query                 |
| AI        | OpenAI / Vercel AI SDK                |
| Storage   | Supabase Storage / Cloudinary         |
| Deploy    | Vercel Edge Network                   |
| Messaging | Telegram API / Resend / Meta WhatsApp |

---

## 🚀 Quick Start

### 1. Clone repository

```bash
git clone https://github.com/your-username/restaurant-os.git
cd restaurant-os
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment setup

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
RESEND_API_KEY=
```

### 4. Run development server

```bash
npm run dev
```

---

## 🧠 SaaS Multi-Tenancy Model

Each restaurant is an isolated tenant:

* `tenant_id` isolates all data
* Row Level Security enforces access control
* No cross-restaurant data leakage possible
* Fully scalable horizontal architecture

---

## 📊 Business Modules

### 🍽 Menu Engine

* dynamic categories
* modifiers system (POS-grade complexity)
* pricing engine
* availability control (real-time)

---

### 📦 Order Engine

* real-time order streaming
* kitchen-ready status pipeline
* customer tracking metadata
* full audit trail

---

### 👨‍🍳 Staff System

* role-based permissions
* restaurant-scoped access control
* operational workflow support

---

### 💳 Payments Layer (future-ready)

* Stripe / CloudPayments abstraction
* order-based payment tracking
* extensible provider system

---

## 🛡️ Security Model

* Row Level Security (Supabase)
* Tenant isolation enforced at DB level
* API-level validation layer
* Audit logging for all critical actions
* Environment-based secrets management

---

## 📈 Roadmap

### Phase 1 — Core Platform

* [x] Database architecture
* [x] UI system
* [x] Multi-tenant structure

### Phase 2 — Product Layer

* [ ] Full menu system
* [ ] Cart & ordering flow
* [ ] Admin dashboard

### Phase 3 — Intelligence Layer

* [ ] AI assistant integration
* [ ] Recommendation engine
* [ ] Smart upselling system

### Phase 4 — Enterprise Layer

* [ ] Payments integration
* [ ] WhatsApp Business API
* [ ] Advanced analytics dashboard

---

## 🌍 Meta & SEO Readiness

* Schema.org Restaurant markup
* OpenGraph dynamic generation
* SEO-first SSR architecture
* Verified business data structure
* Legal compliance pages ready

---

## 🤝 Philosophy

> We are not building restaurant websites.
> We are building **operating systems for food businesses.**

---

## 👤 Author

**Temirlan — Product Engineer / System Architect**

* Focus: SaaS systems, AI products, scalable architectures
* Stack: Full-stack TypeScript, AI integration, backend systems

---

## 📄 License

MIT — use freely, build aggressively.

---
