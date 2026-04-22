# Compliance Checklist

Status: Normative  
Purpose: implementation tracking document for spec compliance  
Last Updated Against Repo State: current checked-in code only

## 1. How To Use This File

This file is the operational companion to `docs/master-spec.md`.

**Navigation:** start from `docs/documentation-map.md` (reading order for development), then `docs/CODEBASE.md` (where to change code), then this checklist versus `docs/master-spec.md` and `docs/security-spec.md`.

Rules:

1. Each row is one checkable requirement.
2. Status is one of: `done`, `partial`, `planned`, `blocked`, `not-applicable`.
3. `done` means the requirement is implemented in code and verified.
4. `partial` means some implementation exists, but the requirement is not fully satisfied.
5. `planned` means the requirement is accepted but not yet implemented.
6. `blocked` means progress depends on another unresolved change.
7. A row may not be marked `done` without both a code reference and a verification method.

This checklist must describe the repo as it exists now, not the intended future state.

## 1.1 Spec Review (pass / partial / fail)

| Section | Status | Why |
|---|---|---|
| Tenant runtime | partial | Middleware + server-side resolver есть; **fail-closed** в runtime включён, но **build phase** допускает пилотный fallback (иначе `next build`/CI падают без env) |
| Public routes (`/`, `/[slug]/menu`) | pass | Оба маршрута реализованы server-first и tenant-aware; `test:smoke` рендерит `/` и `/plovxana/menu` и проверяет базовые маркеры (title/JSON‑LD) |
| Canonical content | pass | Heritage-лендинг собирается из `TenantPublicConfig` / `home_config`: Hero/About/SignatureMenu/Gallery/Reserve + Footer (контакты, prefix брони/доставки, `footerClosingItalic`, `footerInstagramLabel`, `footerCreditLine`, ссылка «в карты» из `addressLine`, ссылка на `/privacy`). Пилотный merge для второго+ tenant; галерея и about-статы — массивы в `TenantPublicConfig` ([tenantLanding.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/tenantLanding.ts), [tenant.types.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/services/tenant.types.ts), [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/(public)/page.tsx)) |
| SEO + JSON-LD | partial | `generateMetadata` + JSON‑LD есть; корректность canonical/OG зависит от `NEXT_PUBLIC_SITE_URL` — unit: [seo-canonical.test.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/tests/seo-canonical.test.ts); smoke проверяет JSON‑LD и `<title>`; ручной чек canonical на деплое — [deployment-runbook.md](C:/Users/Gulmira/Desktop/PlovХана Сайт/docs/deployment-runbook.md) |
| Menu flow (services + Zod) | pass | Read path через сервис + Zod-граница + graceful empty/error состояния есть, `typecheck` зелёный |
| Images | pass | `next/image` + `remotePatterns` + `alt` + `sizes`, `typecheck` зелёный |
| Accessibility | partial | База есть (focus/aria/tablist); интерактив (mobile nav) реализован, но baseline требует финальной проверки через smoke/ручной прогон на мобильном |
| Verification gates | pass | `lint/typecheck/test:unit/build/test:smoke` зелёные; smoke стартует prod server на свободном порту и проверяет `/` + `/plovxana/menu` |
| Admin KDS (Realtime) | partial | `/admin/live-orders` + `useLiveOrders`; на проде нужны миграция `20260422_0007_realtime_orders.sql` и ручная проверка «гостевой заказ → карточка в live» |
| Checklist as source-of-truth | partial | Строки ниже синхронизированы с кодом; финальный «операционный SSoT» — после явной процедуры релиза (ENV в проде, smoke на деплое) |

## 2. Governance

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| governance | `docs/master-spec.md` is treated as the top implementation contract | docs/master-spec.md | done | [master-spec.md](C:/Users/Gulmira/Desktop/PlovХана Сайт/docs/master-spec.md) | manual review | Priority order is defined in the document itself |
| governance | Existing project Markdown files are explicitly classified as normative, planned, or conceptual | docs/master-spec.md | partial | [master-spec.md](C:/Users/Gulmira/Desktop/PlovХана Сайт/docs/master-spec.md), [README.md](C:/Users/Gulmira/Desktop/PlovХана Сайт/README.md), [admin_panel_flow.md](C:/Users/Gulmira/Desktop/PlovХана Сайт/admin_panel_flow.md) | manual review | File markers exist; old docs still need periodic sync review |
| governance | Public-facing docs do not overstate implemented platform scope | docs/master-spec.md | partial | [README.md](C:/Users/Gulmira/Desktop/PlovХана Сайт/README.md) | manual review | Добавлен блок «Current status»; vision-секции ниже по-прежнему шире v1 |

## 3. Tenant Runtime

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| tenant | Tenant identity can be resolved server-side | master-spec §5.3 | done | [getTenant.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/tenant/getTenant.ts) | manual code review | Server-side slug/host resolution exists |
| tenant | Path-based tenant resolution is validated against canonical tenant records | master-spec §5.3 | done | [getTenant.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/tenant/getTenant.ts), [menu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/menu.ts) | manual code review | `getTenantBySlug` validates DB result with Zod |
| tenant | Host-based tenant resolution is supported by middleware when required | master-spec §5.3, security-spec §13 | done | [middleware.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/middleware.ts), [getTenant.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/tenant/getTenant.ts) | manual code review | Middleware инжектит `x-tenant-slug`, server читает его первым |
| tenant | Tenant fallback behavior is explicit and safe for local development | master-spec §5.3 | done | [getTenant.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/tenant/getTenant.ts), [pilotTenant.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/tenant/pilotTenant.ts) | manual code review | Local fallback is explicit |
| tenant | Tenant context is not trusted from browser state alone | master-spec §5.2, security-spec §2 | done | [getTenant.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/tenant/getTenant.ts), [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/[slug]/menu/page.tsx) | manual code review | Server determines tenant before data load |

## 4. Canonical Tenant Data

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| content | There is a canonical tenant config contract for public content | master-spec §7 | done | [tenant.service.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/services/tenant.service.ts), [tenant.types.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/services/tenant.types.ts), [tenantLanding.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/tenantLanding.ts) | manual code review + `npm run typecheck` | Heritage-`TenantPublicConfig`: Hero/About(+stats)/Signature/Gallery(+tiles)/Reserve/Footer-подписи; `home_config` — частичные переопределения; второй+ tenant — merge с пилотным шаблоном |
| content | Homepage content consumes canonical tenant data | master-spec §7 | done | [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/(public)/page.tsx), [home-content.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/services/home-content.ts), [HeroSection.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/sections/HeroSection.tsx), [AboutSection.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/sections/AboutSection.tsx), [SignatureMenuSection.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/sections/SignatureMenuSection.tsx), [GallerySection.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/sections/GallerySection.tsx), [ReserveSection.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/sections/ReserveSection.tsx) | manual code review | Все Heritage-секции главной читают только `copy` (`TenantPublicConfig`); карточки меню — данные БД, заголовки — из DTO |
| content | Footer consumes canonical tenant data only | master-spec §7 | done | [Footer.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/layout/Footer.tsx), [layout.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/(public)/layout.tsx), [tenant.service.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/services/tenant.service.ts) | manual code review | Контакты из `copy.contacts`; префиксы брони/доставки, `footerClosingItalic`, `footerInstagramLabel`, `footerCreditLine` — из `TenantPublicConfig` / `home_config` |
| content | No public tenant phone/address/social values are duplicated outside canonical source | master-spec §7 | done | [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/(public)/page.tsx), [Footer.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/layout/Footer.tsx), [tenant.types.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/services/tenant.types.ts) | manual code review | Убраны публичные хардкоды контактов; все Heritage-поверхности читают канон |

## 5. Public Routes

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| routes | `/` is implemented as a server-first public route | master-spec §6.1 | done | [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/(public)/page.tsx) | manual code review | Server component route exists |
| routes | `/[slug]/menu` is implemented as a server-first tenant route | master-spec §6.1 | done | [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/[slug]/menu/page.tsx) | manual code review | Server component route exists |
| routes | `/[slug]/order` is reserved in architecture and docs | master-spec §6.2 | done | [master-spec.md](C:/Users/Gulmira/Desktop/PlovХана Сайт/docs/master-spec.md), [admin_panel_flow.md](C:/Users/Gulmira/Desktop/PlovХана Сайт/admin_panel_flow.md) | manual review | Reserved, not implemented |
| routes | Public privacy route exists as a legal placeholder | master-spec §6.2 (legal), Meta/WhatsApp prep | partial | [privacy/page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/(public)/privacy/page.tsx) | manual review + smoke `/` still builds | Заготовка текста; финальная редакция — после юр. согласования |

## 6. SEO and Structured Data

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| seo | Public routes export route-aware metadata | master-spec §8 | partial | [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/(public)/page.tsx), [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/[slug]/menu/page.tsx), [seo.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/seo/seo.ts) | manual code review | `generateMetadata` есть; нужна автоматизированная проверка метаданных |
| seo | Tenant metadata is generated from canonical tenant data | master-spec §8 | partial | [home-content.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/services/home-content.ts), [seo.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/seo/seo.ts) | manual code review | Канон используется; нужна проверка корректности canonical URL по окружению |
| seo | Public tenant pages emit `Restaurant` JSON-LD | master-spec §8 | partial | [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/(public)/page.tsx), [schema.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/seo/schema.ts) | manual code review | JSON‑LD вставляется через `JsonLd`, нужна проверка содержимого |
| seo | Menu-specific structured data exists where menu is publicly rendered | master-spec §8 | partial | [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/[slug]/menu/page.tsx), [schema.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/seo/schema.ts) | manual code review | `Menu` JSON‑LD есть при наличии данных; нужна проверка полей |
| seo | Canonical URLs are correct for tenant pages | master-spec §8 | partial | [seo.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/seo/seo.ts), [seo-canonical.test.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/tests/seo-canonical.test.ts) | `npm run test:unit` + ручная проверка `<link rel="canonical">` на Preview/Prod с заданным `NEXT_PUBLIC_SITE_URL` ([deployment-runbook.md](C:/Users/Gulmira/Desktop/PlovХана Сайт/docs/deployment-runbook.md)) | Абсолютный canonical строится от env; политика Preview — в runbook |

## 7. Menu Data Flow

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| menu | Menu reads happen server-side through a service function | master-spec §9 | done | [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/[slug]/menu/page.tsx), [getMenu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/menu/getMenu.ts) | manual code review | Matches desired server-first flow |
| menu | Menu queries are tenant-scoped | master-spec §9, security-spec §3 | done | [getMenu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/menu/getMenu.ts) | manual code review | Queries filter on `tenant_id` |
| menu | DB payloads are validated with Zod before UI consumption | master-spec §9, §13 | done | [getMenu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/menu/getMenu.ts), [menu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/menu.ts) | manual code review | Boundary parsing exists |
| menu | Service returns normalized UI-safe DTOs | master-spec §9 | done | [getMenu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/menu/getMenu.ts) | manual code review | Normalized categories/items are built server-side |
| menu | Empty/error states are graceful | master-spec §9 | done | [MenuClient.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/MenuClient.tsx) | manual code review | Load and empty states exist |
| menu | Loading skeleton exists for streamed/deferred menu states | menu_page.md, testing-strategy §4 | done | [loading.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/[slug]/menu/loading.tsx), [MenuSkeleton.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/MenuSkeleton.tsx) | manual code review | `loading.tsx` рендерит общий `MenuSkeleton` |
| menu | Modifier domain is represented in current menu contract | zod_schemas.md | done | [menu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/menu.ts), [getMenu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/menu/getMenu.ts), [MenuCard.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/MenuCard.tsx), [ItemModifierModal.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/ItemModifierModal.tsx) | manual code review | DTO `modifier_groups` + UI выбора; `modifier_ids` в заказе |
| menu | Stop-list (availability) with cache invalidation and public refresh | master-spec §9, security-spec §3 | partial | [getMenu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/menu/getMenu.ts), [menu.actions.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/actions/menu.actions.ts), [MenuClient.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/MenuClient.tsx), [20260424_0008_menu_realtime.sql](C:/Users/Gulmira/Desktop/PlovХана Сайт/supabase/migrations/20260424_0008_menu_realtime.sql) | apply migration + ручной тест: стоп в `/admin/menu-editor` → позиция исчезает с `/[slug]/menu` без полного CRUD | Канон реализации: [security-spec.md](C:/Users/Gulmira/Desktop/PlovХана Сайт/docs/security-spec.md) §5.1, [menu_data_flow.md](C:/Users/Gulmira/Desktop/PlovХана Сайт/menu_data_flow.md). `unstable_cache` + `revalidateTag`; Realtime → `router.refresh`; полный редактор меню — planned |
| menu | Cart line totals match server integer-tenge semantics (incl. modifiers) | master-spec §9, security-spec §7 | done | [order-money.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/domain/order-money.ts), [useCart.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/store/useCart.ts), [ItemModifierModal.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/ItemModifierModal.tsx), [MenuCard.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/MenuCard.tsx), [CartDrawer.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/cart/CartDrawer.tsx), [CheckoutForm.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/cart/CheckoutForm.tsx), [submitOrder.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/orders/submitOrder.ts) | `npm run test:unit` ([order-money.test.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/tests/order-money.test.ts)) + ручной чек корзины с модификаторами | Один `moneyToIntTenge` с сервером; оформление — `formatMoneyRu` с валютой тенанта |

## 8. UI Boundaries

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| ui-boundary | Business logic does not live inside visual components | master-spec §5.1 | done | [getMenu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/menu/getMenu.ts), [MenuClient.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/MenuClient.tsx) | manual code review | UI remains mostly presentational |
| ui-boundary | Pricing rules are not computed in UI except display formatting | master-spec §5.1, security-spec §7 | done | [MenuCard.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/MenuCard.tsx) | manual code review | UI formats resolved prices only |
| ui-boundary | Tenant authorization logic is not in UI | master-spec §5.1 | done | [getTenant.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/tenant/getTenant.ts) | manual code review | Server handles tenant resolution |

## 9. UI Kit

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| ui-kit | Button primitive exists | master-spec §11 | done | [Button.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ui/primitives/Button.tsx), [Button.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ui/Button.tsx) | manual code review | Heritage Primary/Secondary/Ghost в `ui/primitives/`; legacy-примитив оставлен под admin |
| ui-kit | Card primitive exists | master-spec §11 | done | [CardFrame.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ui/primitives/CardFrame.tsx), [Card.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ui/Card.tsx) | manual code review | Heritage double-gold ring в `ui/primitives/CardFrame`; legacy — под admin |
| ui-kit | Badge primitive exists | master-spec §11 | done | [Badge.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ui/Badge.tsx) | manual code review | Legacy-бейдж; Heritage использует локальные ember-пиллы в карточках (`DishCard`/`MenuCard` — «Авторское») |
| ui-kit | Input primitive exists before interactive form/admin surfaces are declared compliant | master-spec §11 | done | [Input.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ui/Input.tsx), [CheckoutForm.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/cart/CheckoutForm.tsx), [ReserveSection.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/sections/ReserveSection.tsx) | manual code review | Heritage-инпуты (`umber-900` + gold ring + `shadow-inset-sm`) собраны локально в CheckoutForm/ReserveSection; legacy-`Input` остался под admin |
| ui-kit | Shared primitives use typed props | master-spec §11 | done | [Button.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ui/primitives/Button.tsx), [CardFrame.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ui/primitives/CardFrame.tsx), [Section.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ui/primitives/Section.tsx) | manual code review | Heritage-примитивы строго типизированы (variant/size/texture/bokeh union-типы) |
| ui-kit | Focusable primitives support `forwardRef` where composition requires it | master-spec §11 | done | [Button.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ui/primitives/Button.tsx), [Input.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ui/Input.tsx) | manual code review | Heritage-`Button` проксирует `ref` на `button`; legacy-`Input` использует `forwardRef` + `displayName` |
| ui-kit | Loading/disabled states exist where relevant | master-spec §11 | done | [Button.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ui/primitives/Button.tsx), [CheckoutForm.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/cart/CheckoutForm.tsx), [ReserveSection.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/sections/ReserveSection.tsx) | manual code review | `loading` + спиннер на Heritage-кнопках; `disabled` на полях во время submit |

## 10. Theme Runtime

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| theme | Tenant theme contract is typed | master-spec §10 | done | [theme.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/theme.ts), [menu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/menu.ts) | manual code review | `TenantThemeSchema` подключён в `TenantRowSchema` (v1 — палитра PLOVXAHA Heritage жёстко собрана в Tailwind-конфиге; per-tenant override темы запланирован) |
| theme | Theme values are applied through runtime tokens/CSS variables | master-spec §10 | done | [tailwind.config.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/tailwind.config.ts), [globals.css](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/globals.css), [atmosphere.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/config/atmosphere.ts), [layout.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/layout.tsx) | manual code review | Heritage-токены — Tailwind (`umber/gold/ember/cream`, `boxShadow.lift-*`, `ease-heritage`); CSS-переменные шрифтов `--font-serif`/`--font-sans`; параметры атмосферы — `config/atmosphere.ts` |
| theme | Public pages consume tokens rather than only hardcoded values where tenant theming is required | master-spec §10 | partial | [Section.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ui/primitives/Section.tsx), [Button.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ui/primitives/Button.tsx), [HeroSection.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/sections/HeroSection.tsx), [atmosphere.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/config/atmosphere.ts) | manual code review | Публичные Heritage-секции используют только Tailwind-токены + `config/atmosphere.ts`; per-tenant перекраска под другие рестораны — planned |

## 11. Images

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| images | Public images use an approved optimization path | master-spec §12 | done | [MenuCard.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/MenuCard.tsx), [next.config.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/next.config.ts) | manual code review | `next/image` + allowlisted remote patterns |
| images | Remote image configuration is explicit | master-spec §12, security-spec §10 | done | [next.config.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/next.config.ts) | manual code review | `remotePatterns` allowlist для Supabase Storage и Cloudinary |
| images | Meaningful images have non-empty `alt` text | master-spec §12, §16 | done | [MenuCard.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/MenuCard.tsx) | manual code review | `alt` = item.name |
| images | Images are responsive | master-spec §12 | done | [MenuCard.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/MenuCard.tsx) | manual code review | `sizes` настроен, карточки адаптивные |
| images | Placeholder strategy exists | master-spec §12 | done | [MenuCard.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/MenuCard.tsx), [DishCard.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/cards/DishCard.tsx), [PlateIcon.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ornaments/PlateIcon.tsx), [OrnamentSprite.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/ornaments/OrnamentSprite.tsx) | manual code review | `PlateIcon` (SVG `<use href>` из глобального спрайта) рисуется поверх `bg-umber-900` вместо фото при `imageUrl === null`; blur-placeholder для реальных фото — roadmap |

## 12. Validation

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| validation | Tenant schema exists | master-spec §13 | done | [menu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/menu.ts) | manual code review | Exists |
| validation | Menu/category schemas exist | master-spec §13 | done | [menu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/menu.ts) | manual code review | Exists |
| validation | Modifier schemas exist | master-spec §13 | done | [menu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/menu.ts) | manual code review | `MenuModifierGroupSchema` / опции в составе позиции меню |
| validation | Order schemas exist | master-spec §13 | done | [order.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/order.ts) | manual code review | `CheckoutDraftSchema`, серверные `modifier_ids` |
| validation | Имя `TenantResponseSchema` из normative docs | zod_schemas.md §2 | done | [schemas.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/schemas.ts), [zod_schemas.md](C:/Users/Gulmira/Desktop/PlovХана Сайт/zod_schemas.md) | manual code review | Канон в коде; MD указывает на `primitives`/`TenantRowSchema` (см. шапку zod_schemas.md) |
| validation | Staff/RBAC schemas exist | master-spec §13 | done | [staff.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/staff.ts), [schemas.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/schemas.ts) | `npm run typecheck` | `StaffRowSchema` / `StaffWithTenantSchema`; политики RBAC на мутациях — отдельно |
| validation | Parsing occurs at data boundaries | master-spec §13 | done | [getMenu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/menu/getMenu.ts), [getTenant.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/tenant/getTenant.ts) | manual code review | Boundary parsing exists |
| validation | Единые примитивы Zod (`IdSchema`, `PhoneSchema`, slug) | zod_schemas.md §1 | done | [primitives.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/primitives.ts), [order.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/order.ts), [menu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/validation/menu.ts) | `npm run typecheck` | Расширение `schemas.ts` / ответы API через `TenantResponseSchema` |

## 13. Security

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| security | Tenant isolation is represented in service queries | security-spec §3 | done | [getMenu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/menu/getMenu.ts) | manual code review | Explicit tenant filters present |
| security | Code remains compatible with DB-level RLS | security-spec §3, §5 | partial | [getMenu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/menu/getMenu.ts), [submitOrder.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/orders/submitOrder.ts), [admin.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/supabase/admin.ts), [20260420_0005_orders_rls_service_writes.sql](C:/Users/Gulmira/Desktop/PlovХана Сайт/supabase/migrations/20260420_0005_orders_rls_service_writes.sql) | manual code review + apply migration in Supabase | Гостевой write через `SUPABASE_SERVICE_ROLE_KEY`; anon INSERT в orders снят миграцией; `done` после проверки заказа на реальном проекте |
| security | RBAC policy layer is implemented server-side | security-spec §4 | planned | none | none | Not implemented |
| security | Audit logging exists for privileged actions | security-spec §11 | partial | [orderSubmitAudit.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/audit/orderSubmitAudit.ts), [submitOrder.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/orders/submitOrder.ts), [20260421_0006_audit_logs.sql](C:/Users/Gulmira/Desktop/PlovХана Сайт/supabase/migrations/20260421_0006_audit_logs.sql) | server logs + `audit_logs` для guest checkout (service_role); полный enterprise-audit — roadmap |
| security | Browser code is not source of truth for authorization | security-spec §2, §4 | done | [getTenant.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/tenant/getTenant.ts), [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/[slug]/menu/page.tsx) | manual code review | True for current implemented scope |
| security | Заказы: `tenant_id` сверяется с контекстом запроса (не только Zod) | security-spec §2, §7 | done | [assertOrderTenantContext.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/tenant/assertOrderTenantContext.ts), [order.actions.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/actions/order.actions.ts), [middleware.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/middleware.ts) | manual code review | Поддомен или путь → `x-tenant-slug`; иначе дефолтный slug |

## 14. Performance and Accessibility

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| perf | Public pages are server-first | master-spec §15 | done | [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/(public)/page.tsx), [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/[slug]/menu/page.tsx) | manual code review | True |
| perf | Revalidation/caching policy is explicit per public route | master-spec §15 | partial | [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/(public)/page.tsx), [page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/[slug]/menu/page.tsx), [getMenu.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/menu/getMenu.ts), [tags.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/cache/tags.ts) | manual code review | `revalidate` на маршрутах; меню — `unstable_cache` + теги + `revalidateTag` при стоп-листе |
| a11y | Navigation and category controls are keyboard reachable | master-spec §16 | done | [TopNav.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/layout/TopNav.tsx), [MenuClient.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/MenuClient.tsx) | manual code review | Heritage `TopNav` + mobile drawer на native links/buttons; категории меню — `role="tablist"` |
| a11y | Interactive elements expose accessible names | master-spec §16 | done | [TopNav.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/layout/TopNav.tsx), [MenuClient.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/MenuClient.tsx), [CartDrawer.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/cart/CartDrawer.tsx) | manual code review | `aria-label/aria-*` + семантические элементы; корзина — `role="dialog" aria-modal="true"` + Escape |
| a11y | Meaningful images are described | master-spec §16 | done | [MenuCard.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/menu/MenuCard.tsx) | manual code review | `alt` = item.name |

## 15. Verification Gates

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| verification | Lint passes | testing-strategy §3 | done | [package.json](C:/Users/Gulmira/Desktop/PlovХана Сайт/package.json) | `npm.cmd run lint` | Confirmed manually |
| verification | Typecheck gate exists and passes | testing-strategy §3 | done | [package.json](C:/Users/Gulmira/Desktop/PlovХана Сайт/package.json) | `npm.cmd run typecheck` | Script добавлен |
| verification | Production build passes | testing-strategy §3 | done | [package.json](C:/Users/Gulmira/Desktop/PlovХана Сайт/package.json) | `NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm.cmd run build` | Build зелёный при заданном `NEXT_PUBLIC_SITE_URL` (как и будет в прод-env) |
| verification | Required automated tests exist and pass | testing-strategy §3 | done | [tests](C:/Users/Gulmira/Desktop/PlovХана Сайт/tests), [scripts/smoke.mjs](C:/Users/Gulmira/Desktop/PlovХана Сайт/scripts/smoke.mjs) | `npm.cmd run test:unit`, `npm.cmd run test:smoke` | Unit зелёный; smoke зелёный: `/`, `/plovxana/menu` (JSON‑LD, title), редирект `/admin/dashboard` → `/admin/login`; перед релизом опционально `SMOKE_REQUIRE_SERVICE_ROLE=1` + секрет ([deployment-runbook.md](C:/Users/Gulmira/Desktop/PlovХана Сайт/docs/deployment-runbook.md)) |

## 16. Platform Expansion

| Area | Requirement | Source | Status | Code Ref | Verification | Notes |
|---|---|---|---|---|---|---|
| expansion | Cart state exists with tenant-safe assumptions | master-spec §4.2 | done | [useCart.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/store/useCart.ts) | manual code review | Zustand + сброс при смене tenant |
| expansion | Order write path exists with validation | master-spec §4.2, security-spec §7 | done | [submitOrder.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/orders/submitOrder.ts), [order.actions.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/actions/order.actions.ts) | manual code review | Цены и модификаторы с БД; снимок в `order_items.modifiers` |
| expansion | Admin shell exists | master-spec §4.2 | done | [middleware.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/middleware.ts), [lib/supabase/middleware.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/supabase/middleware.ts), [app/admin/(protected)/layout.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/admin/(protected)/layout.tsx), [auth.actions.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/actions/auth.actions.ts) | manual code review + `npm run test:smoke` | `/admin/*` защищён сессией; staff + сайдбар; миграция `staff` |
| expansion | Realtime order flow exists | master-spec §4.2 | done | [useLiveOrders.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/hooks/useLiveOrders.ts), [LiveOrdersList.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/admin/LiveOrdersList.tsx), [live-orders/page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/admin/(protected)/live-orders/page.tsx), [20260422_0007_realtime_orders.sql](C:/Users/Gulmira/Desktop/PlovХана Сайт/supabase/migrations/20260422_0007_realtime_orders.sql) | manual code review + apply migration + ручной тест: заказ с сайта появляется в KDS без перезагрузки | Подписка `postgres_changes` на `orders` с фильтром `tenant_id`; RLS staff |
| expansion | Admin menu: stop-list (not full CRUD) | master-spec §4.2 | partial | [menu-editor/page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/admin/(protected)/menu-editor/page.tsx), [MenuKillSwitchList.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/admin/MenuKillSwitchList.tsx), [menu.actions.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/actions/menu.actions.ts) | staff login + ручной тест стоп/возврат | Создание/удаление позиций — planned |
| expansion | Telegram notify on new order (async, non-blocking) | master-spec §4.2 (ops) | partial | [submitOrder.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/orders/submitOrder.ts), [telegram.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/lib/integrations/telegram.ts), [20260425_tenant_telegram.sql](C:/Users/Gulmira/Desktop/PlovХана Сайт/supabase/migrations/20260425_tenant_telegram.sql) | задать `TELEGRAM_BOT_TOKEN` + chat (`tenants.telegram_chat_id` или `TELEGRAM_CHAT_ID`); тестовый заказ → сообщение в чат | Не блокирует ответ гостю; сбой → structured warn |
| expansion | Admin dashboard: order analytics (revenue, top items, RLS) | master-spec §4.2 | partial | [dashboard/page.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/app/admin/(protected)/dashboard/page.tsx), [getOrderAnalytics.ts](C:/Users/Gulmira/Desktop/PlovХана Сайт/services/orders/getOrderAnalytics.ts), [OrderAnalyticsPanel.tsx](C:/Users/Gulmira/Desktop/PlovХана Сайт/components/admin/OrderAnalyticsPanel.tsx) | staff login; данные только своего tenant | Не полный BI; индексы/материализации — при росте нагрузки |

## 17. Release Rule

The repo may be called "production-compliant with the current spec" only when:

- all baseline architecture rows are `done`
- no security-critical row is below `partial`
- no image or accessibility blocker remains on public surfaces
- verification gates are real, not aspirational
- remaining gaps are explicitly `planned` or `blocked`
