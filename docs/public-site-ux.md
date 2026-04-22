# Публичный сайт: позиционирование и копирайт (Heritage Edition)

Status: Operational  
Purpose: зафиксировать новый дизайн-канон **Heritage Edition** для публичной витрины (главная и меню), чтобы сайт читался как «порог гостеприимного дома», а не как стерильный SaaS-шаблон.

> Канонические первоисточники для дизайна и копирайта — **`newdocs/`**:
> - `newdocs/visual_identity_heritage.md` — слои, цвет, тени, орнамент, моушн.
> - `newdocs/ui_kit_material.md` — рамки (Hero/Card), типошкала, кнопки, формы, разделители.
> - `newdocs/copy_strategy_nomad.md` — голос «Nomad», заголовки, микрокопия, запреты.
> - `newdocs/atmosphere_config.md` — параметры blur/opacity/overlayAlpha/blendMode по секциям.

При расхождении этого файла с `newdocs/` приоритет у `newdocs/`.

---

## Принципы

1. **Главная (`/`)** — голос гостя: огонь, казан, дастархан. Никаких «Production-ready», «AI», «Меню-ассистент». «SaaS-кухня» (тенанты, RLS, синки) живёт в `admin/*` и в `services/*`/`lib/*`, а не на витрине.
2. **Главная композиция секций**: Hero → About → SignatureMenu → Gallery → Reserve. Footer — общий, в `app/(public)/layout.tsx`.
3. **Главный CTA** — «Забронировать у огня» (`#reserve`) в Hero и в шапке. Вторичный — «Смотреть меню» (`/[slug]/menu`). Телефон — только в форме брони/футере; не дублируется в Hero как самостоятельный CTA.
4. **Шапка `TopNav`** — sticky `umber-950/80 backdrop-blur-md`, EN-лейблы (Menu / About / Gallery / Reserve / Contact), `Book a table` Primary; mobile drawer с теми же пунктами.
5. **Футер** — три колонки (Address / Hours / Contact) на текстуре кирпича + film-grain. «Открыть в картах» через `lib/utils/maps-url.ts`. `OpenIndicator` — живой статус по `hoursLine`.
6. **Юридическое** — страница `/privacy` (заготовка под юр. согласование), стилизованная теми же `t-*` токенами.
7. **Бронь (v1)** — клиентская валидация (zod-style минимум) + `tel:` fallback на submit. Серверный путь записи в БД — отдельная задача (см. `compliance-checklist.md`).

---

## Визуальный язык: Heritage Edition

### Палитра (Tailwind tokens, см. `tailwind.config.ts`)

- `umber-950 / 900 / 800` — основа (тёмное дерево/кирпич).
- `gold-500 / 400` — золотая нить (рамки, акценты, гипер-ссылки).
- `ember-500 / 600` — медный/огненный акцент (бейдж «Авторское», ring ошибок).
- `cream-100` — основной текст; `muted-400` — micro-caps и плейсхолдеры.

### Типошкала (`app/globals.css` → `@layer components`)

`.t-display`, `.t-h1`, `.t-h2`, `.t-h3`, `.t-body-lg`, `.t-body`, `.t-caps`, `.t-micro`. Шрифты — Playfair Display (serif, дисплейные) и Inter (sans, intermediate/caps).

### Слои фона

Через универсальный wrapper `components/ui/primitives/Section.tsx`:

1. **Базовый цвет** — `bg-umber-950` / `bg-umber-900`.
2. **Bokeh** — фото с `background-image` + `backdrop-filter: blur(...)` + `rgba(26,14,8,α)` overlay. Параметры берём из `config/atmosphere.ts`.
3. **Текстура** — `brick`/`ikat`/`pergament` поверх с `mix-blend-overlay` и `opacity` из конфига.
4. **Film grain** — `.bg-film-grain` (SVG noise) поверх с opacity ~0.04–0.06.
5. **Контент** — `mx-auto max-w-[1280px]` + типошкала + кнопки.

### Рамки

- `HeroFrame` — двойной `gold-500` ring + `OrnamentCorner` в углах. Используется в Hero.
- `CardFrame` — `umber-900` фон, двойное `gold-500` ring без угловых орнаментов. Используется в `DishCard`, `MenuCard`, About-фото.

### Орнамент

- `components/ornaments/OrnamentSprite.tsx` — SVG `<defs>` с символами `kazakh-main` и шестью `plate-*`. Подключается один раз в `app/layout.tsx`.
- `OrnamentCorner` (для HeroFrame) — `<use href="#kazakh-main" />` с `ornament-engraved` фильтром (drop-shadow для эффекта тиснения) и `ornament-breathe` анимацией.
- `PlateIcon variant="plov|kazy|samsa|tea|dessert|default"` — стилизованные «тарелки» (placeholder под финальные SVG). Используется в `GalleryTile` и в `MenuCard` как заглушка при отсутствии фото.

### Кнопки (`components/ui/primitives/Button.tsx`)

Три варианта: `primary` (gold заливка + ember-glow на hover, внутренний ring `inset-[2px]`), `secondary` (прозрачный + gold ring), `ghost` (caps + золотая верхняя черта). Размеры `sm | md | lg`. Caps `tracking-[0.3em]`, `rounded-none`, `ease-heritage` 600ms.

### Моушн

- `FloatingPlates` — три параллакс-тарелки в Hero, `useScroll` + `useReducedMotion`.
- `LampGlow` — radial-gradient + blur, `lamp-breathe` ~6s.
- `OrnamentCorner` — `ornament-breathe` ~10s (opacity 0.6→0.85).
- Все анимации отключаются под `prefers-reduced-motion: reduce` (см. `app/globals.css`).

---

## Контент-контракт

`lib/services/tenant.types.ts` → `TenantPublicConfig` содержит секции:

- `heroEyebrow` / `heroTitleLine1` / `heroTitleAccent` / `heroSub` / `primaryCtaLabel` / `secondaryCtaLabel`
- `aboutEyebrow` / `aboutTitleLine1` / `aboutTitleAccent` / `aboutLead` / `aboutClosingItalic` / `aboutStats[]` / `aboutPhotoUrl`
- `signatureEyebrow` / `signatureTitleLine1` / `signatureTitleAccent`
- `galleryEyebrow` / `galleryTitleLine1` / `galleryTitleAccent` / `galleryTiles[]`
- `reserveEyebrow` / `reserveTitleLine1` / `reserveTitleAccent` / `reserveSub`
- `footerClosingItalic` / `footerCreditLine` / `footerInstagramLabel`
- `contacts` (адрес, часы, телефон брони/доставки, Instagram, kazansLine, halalNote)

Те же поля валидируются в `HomeConfigSchema` (`lib/validation/tenantLanding.ts`) — все поля **опциональны**, чтобы переопределять только дельты в `tenants.home_config` (JSONB).

Пилотный fallback (`getPilotTenant()` в `lib/services/tenant.service.ts`) уже залит копи из `newdocs/copy_strategy_nomad.md §2`.

---

## Связанные файлы

- Дизайн-канон: `newdocs/visual_identity_heritage.md`, `newdocs/ui_kit_material.md`, `newdocs/copy_strategy_nomad.md`, `newdocs/atmosphere_config.md`.
- Конфиг атмосферы: `config/atmosphere.ts`.
- Главная: `app/(public)/page.tsx`, `app/(public)/layout.tsx`.
- Меню: `app/[slug]/menu/page.tsx`, `app/[slug]/menu/layout.tsx`, `components/menu/MenuClient.tsx`, `components/menu/MenuCard.tsx`.
- Корзина: `components/cart/CartDrawer.tsx`, `components/cart/CheckoutForm.tsx`, `components/menu/ItemModifierModal.tsx`.
- Шапка/футер: `components/layout/TopNav.tsx`, `components/layout/Footer.tsx`, `components/layout/OpenIndicator.tsx`.
- Секции: `components/sections/{HeroSection,AboutSection,SignatureMenuSection,GallerySection,ReserveSection}.tsx`.
- Контент: `lib/services/tenant.types.ts`, `lib/services/tenant.service.ts`, `lib/validation/tenantLanding.ts`.
- Политика: `app/(public)/privacy/page.tsx`.
