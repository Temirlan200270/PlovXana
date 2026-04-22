# Карта кодовой базы (Codebase Map)

Status: Operational  
Purpose: онбординг разработчиков и навигация по репозиторию; границы слоёв и точки входа для изменений.

**С чего начать:** [documentation-map.md](documentation-map.md) задаёт порядок чтения документов для разработки; эта страница отвечает на вопрос «где в коде что лежит».

Границы с Python/внешними сервисами (без дублирования WhatsApp, AI-заказов, тяжёлого iiko sync): [integration-boundaries.md](integration-boundaries.md).

Связанные документы: [documentation-map.md](documentation-map.md), [master-spec.md](master-spec.md), [compliance-checklist.md](compliance-checklist.md), [security-spec.md](security-spec.md), [testing-strategy.md](testing-strategy.md), [deployment-runbook.md](deployment-runbook.md).

### Сопровождение

Любое **добавление или удаление** заметных файлов/каталогов (новый маршрут, сервис, слой `lib/`, пакет в корне) сопровождайте **правкой этого файла в том же изменении**, чтобы карта репозитория не расходилась с кодом.

---

## Обзор

Многотенантный публичный сайт ресторана (пилот) и админ-оболочка на **Next.js 15 (App Router)**, **Supabase** (PostgreSQL, Auth, RLS), **Zod**, **Zustand** (корзина), **Vitest**.

---

## Корень репозитория

| Путь | Назначение |
|------|------------|
| `middleware.ts` | Edge: обновление сессии Supabase, защита `/admin/*`, заголовок `x-tenant-slug` |
| `next.config.ts` | Next.js, в т.ч. `remotePatterns` для изображений |
| `package.json` | Скрипты: `dev`, `build`, `lint`, `typecheck`, `test:unit`, `test:smoke` |
| `tailwind.config.ts` | Tailwind |
| `database_schema.sql` | Ориентир по доменной схеме; **фактические DDL и RLS** — в `supabase/migrations/*.sql` |
| `zod_schemas.md` | Человекочитаемое зеркало контрактов Zod (канон типов — код в `lib/validation/`) |

---

## `app/` — маршруты и точки входа

Бизнес-логика запросов к данным не в UI-файлах страниц: страницы вызывают модули из `services/` и `lib/`, Server Actions — из `app/actions/`.

```text
app/
├── layout.tsx, globals.css       # шрифты Playfair Display + Inter, OrnamentSprite, типошкала t-*
├── (public)/                     # Heritage-лендинг
│   ├── layout.tsx                # TopNav + Footer + CartDrawer вокруг children
│   ├── page.tsx                  # композиция Hero/About/SignatureMenu/Gallery/Reserve
│   └── privacy/page.tsx          # политика (типошкала t-h1/t-body/t-micro)
├── [slug]/menu/                  # меню тенанта (Heritage)
│   ├── layout.tsx                # CartDrawer
│   ├── page.tsx                  # TopNav + Section(brick) + MenuClient + Footer + JSON-LD
│   ├── loading.tsx               # Heritage-skeleton (lamp-breathe)
│   └── actions.ts                # server-only хелперы страницы при необходимости
├── admin/
│   ├── login/page.tsx
│   └── (protected)/          # сессия + staff (layout)
│       ├── layout.tsx
│       ├── dashboard/page.tsx
│       ├── live-orders/page.tsx   # KDS: SSR 50 заказов + LiveOrdersList (Realtime)
│       └── menu-editor/page.tsx   # стоп-лист (SSR список + MenuKillSwitchList)
├── actions/
│   ├── order.actions.ts      # submit заказа (вызов services/orders)
│   ├── menu.actions.ts       # стоп-лист позиций + revalidateTag кэша меню
│   └── auth.actions.ts
└── api/
    └── sync/menu/route.ts    # синхронизация меню (опционально; iiko bulk — вне этого репо, см. integration-boundaries.md)
```

---

## `components/` — презентация (Heritage Edition)

Клиентский Supabase (`lib/supabase/browser.ts`) — Realtime: KDS (`orders`) и публичное меню (`menu_items` → `router.refresh()` в `MenuClient`).

Дизайн-система — `newdocs/visual_identity_heritage.md` + `newdocs/ui_kit_material.md`. Контракт копи — `newdocs/copy_strategy_nomad.md`. Параметры фоновых слоёв — `newdocs/atmosphere_config.md` → `config/atmosphere.ts`.

```text
components/
├── ui/
│   ├── primitives/        # Heritage: Button (Primary/Secondary/Ghost), HeroFrame, CardFrame,
│   │                       #   Section (texture/bokeh/grain), SectionDivider, ItalicAccent
│   └── (Button|Input|Card|Badge).tsx  # legacy-примитивы, остались под admin (см. components/admin/*)
├── layout/                # TopNav (sticky, EN-лейблы + mobile drawer), Footer (brick + 3 колонки),
│                          #   OpenIndicator (live статус по hoursLine)
├── sections/              # HeroSection, AboutSection, SignatureMenuSection,
│                          #   GallerySection, ReserveSection
├── cards/                 # DishCard, StatCard, GalleryTile
├── ornaments/             # OrnamentSprite (defs: kazakh-main + 6 plate-*),
│                          #   OrnamentCorner (для HeroFrame), PlateIcon (use href)
├── atmosphere/            # FloatingPlates (parallax, useScroll/useReducedMotion), LampGlow
├── menu/                  # MenuClient (caps-tabs, t-h1), MenuCard (CardFrame + Авторское),
│                          #   MenuSkeleton (lamp-breathe), ItemModifierModal
├── cart/                  # CartDrawer (umber-950, gold-rim), CheckoutForm
├── admin/                 # AdminSidebar, LoginForm, StaffAccessDenied, LiveOrdersList (KDS),
│                          #   MenuKillSwitchList, OrderAnalyticsPanel
├── seo/                   # JsonLd
└── dev/                   # AgentationDev
```

Удалены при переходе на Heritage Edition: `sections/Hero`, `sections/Features`, `sections/AISection`, `sections/AIDemo`, `sections/MenuPreview`, `atmosphere/AtmosphereStack`, `hero/HeroAtmosphere`, `ornament/OrnamentLayer`, `ornament/OrnamentDivider`, `layout/Navbar`, `order/CartDrawer`, `motion/{FadeIn,Reveal}`, `lib/config/atmosphere.ts`, `public/textures/*`, `public/images/{textures,atmosphere,hero}/README.md`.

---

## `lib/` — инфраструктура, валидация, тенант, SEO

```text
lib/
├── cache/
│   └── tags.ts             # теги Data Cache (`menu_items`, `menu-tenant-*`) для revalidateTag
├── supabase/
│   ├── env.ts              # isSupabaseConfigured, isSupabaseAdminConfigured
│   ├── server.ts           # SSR-клиент (anon + cookies)
│   ├── anon-server.ts      # anon без cookies — публичные запросы внутри unstable_cache (меню)
│   ├── browser.ts          # браузерный anon-клиент (Realtime под JWT; не service_role)
│   ├── admin.ts            # service_role — только сервер, обход RLS; импорт только из server actions / services
│   └── middleware.ts       # сессия Supabase для Edge
├── hooks/
│   └── useLiveOrders.ts    # подписка Realtime на `orders` по tenant_id
├── audit/
│   └── orderSubmitAudit.ts # структурные логи + best-effort audit_logs для guest checkout
├── validation/             # Zod: primitives, menu, order, liveOrder, theme, staff, schemas
├── tenant/
│   ├── getTenant.ts        # резолв тенанта по slug / host
│   ├── pilotTenant.ts      # fallback для dev/build
│   └── assertOrderTenantContext.ts
├── services/
│   ├── tenant.service.ts   # публичный контент (merge с БД)
│   ├── home-content.ts
│   ├── menu/sync.service.ts
│   └── iiko/               # клиент к внешнему API (при наличии env)
├── auth/                   # getStaff, редиректы админки
├── seo/                    # seo.ts, schema.ts (JSON-LD)
├── ui/                     # tenant-feature-icon — whitelist Lucide для иконок фич лендинга
├── theme/                  # theme-resolver, пресеты для CSS variables
├── domain/                 # чистая логика: modifier-selection, order-money (тенге как на сервере)
├── integrations/         # telegram.ts — сервер-only, вызовы из submitOrder
├── format/
└── utils/                  # cn, result, maps-url (ссылка «в карты» по адресу)
```

> Heritage atmosphere config (`blur`/`opacity`/`overlayAlpha`/`blendMode` по секциям) живёт в **корневом** `config/atmosphere.ts` (а не в `lib/config/`) — см. `newdocs/atmosphere_config.md §2.1`.

---

## `services/` (корень проекта) — доступ к данным заказа и меню

Отдельная папка **на верхнем уровне** (не путать с `lib/services/`): сюда вынесены сценарии «загрузить меню» и «оформить заказ».

```text
services/
├── menu/getMenu.ts         # unstable_cache + теги; внутри — anon-server (без cookies), см. security-spec §5.1
├── orders/
│   ├── submitOrder.ts      # расчёт цен, insert через admin; опционально Telegram (env / tenants.telegram_chat_id)
│   ├── getOrderAnalytics.ts # агрегаты для `/admin/dashboard` (RLS staff)
│   ├── getRecentOrdersForTenant.ts  # последние заказы для SSR админки / KDS
│   └── createOrder.ts      # вспомогательные сценарии при необходимости
└── iiko/getIikoMenu.ts
```

**Стоп-лист меню (канон):** мутации `is_available` только через `app/actions/menu.actions.ts` + сессия staff и RLS (не `lib/supabase/admin.ts`). Инвалидация кэша — `revalidateTag` из `lib/cache/tags.ts`. Подробности: [security-spec.md](security-spec.md) §5.1, [menu_data_flow.md](../menu_data_flow.md).

---

## Прочее

| Путь | Назначение |
|------|------------|
| `store/useCart.ts` | Zustand: корзина, привязка к tenant |
| `tests/` | Vitest |
| `scripts/smoke.mjs` | Дымовой прогон прод-сервера |
| `supabase/migrations/` | Версионируемые DDL, RLS, индексы — **источник правды для деплоя БД** |

Отдельный Python **iiko adapter** в этом репозитории не обязан присутствовать: интеграция может жить внешним сервисом (см. `IIKO_ADAPTER_URL` в `.env.example`).

---

## Правила слоёв (кратко)

1. **Страницы и layouts** в `app/` не содержат сырого SQL; вызывают `services/*`, `lib/*`, `app/actions/*`.
2. **Запись заказа от гостя** — только после валидации на сервере, через **service_role** (`lib/supabase/admin.ts`), с логированием (`lib/audit/orderSubmitAudit.ts`). Клиентский бандл **не** импортирует `admin.ts`.
3. **Стоп-лист позиций меню (staff)** — через `app/actions/menu.actions.ts` и RLS, **не** через `admin.ts` (см. security-spec §5.1).
4. **Границы данных** — Zod в `lib/validation/` на входе/выходе сервисов.
5. **Тенант** для публичных маршрутов определяется на сервере (`lib/tenant/getTenant.ts`, заголовки middleware), не из «доверия» к полям формы в браузере.
6. **Интеграции вне сайта** — см. [integration-boundaries.md](integration-boundaries.md): не добавлять в этот репозиторий второй WhatsApp webhook, второй AI-оркестратор заказов, второй загрузчик номенклатуры iiko.

---

## Безопасность и RLS

- Канон политик и таблиц для продакшена задаётся миграциями в `supabase/migrations/` (в т.ч. гостевой write path через service role, политики для `staff` и заказов; отдельно — `menu_items` и стоп-лист: `20260424_0008_menu_realtime.sql`).
- Файл `database_schema.sql` в корне — справочный; при расхождении с миграциями приоритет у **миграций**.
- Паттерн «публичное меню vs staff stop-list» зафиксирован в [security-spec.md](security-spec.md) §5.1.

---

## Команды и CI

| Команда | Действие |
|---------|----------|
| `npm run dev` | Разработка |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run test:unit` | Vitest |
| `npm run test:smoke` | Smoke после сборки; опционально `SMOKE_REQUIRE_SERVICE_ROLE=1` проверяет наличие `SUPABASE_SERVICE_ROLE_KEY` ([deployment-runbook.md](deployment-runbook.md)) |

В репозитории: `.github/workflows/ci.yml` (проверки на push/PR при включённом GitHub Actions).

---

## Связанная документация

Полный индекс и **порядок чтения для разработки**: [documentation-map.md](documentation-map.md).
