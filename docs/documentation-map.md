# Documentation Map: Restaurant OS

Этот файл — **точка входа в документацию**: оглавление, приоритет чтения и классификация по статусу. При изменениях в коде и при работе ассистентов ИИ **в первую очередь** опирайтесь на раздел ниже и связанные normative-документы.

---

## Приоритет для разработки и ИИ (читать в этом порядке)

1. **[CODEBASE.md](CODEBASE.md)** — где лежат файлы, границы слоёв, куда класть новый код (карта репозитория). При добавлении/удалении значимых путей обновляйте `CODEBASE.md` вместе с кодом.
2. **[master-spec.md](master-spec.md)** — контракт реализации: что считается «сделано» для продукта.
3. **[compliance-checklist.md](compliance-checklist.md)** — фактическое состояние репо по строкам требований (done / partial / …), компаньон к master-spec.
4. **[security-spec.md](security-spec.md)** — ограничения безопасности и RLS (пересекается с master-spec: при конфликте по security действует security-spec).
5. **[testing-strategy.md](testing-strategy.md)** — какие проверки обязательны (lint, typecheck, тесты, smoke).
6. **Heritage-канон (`newdocs/`)** — нормативные документы для публичной витрины: `newdocs/visual_identity_heritage.md`, `newdocs/ui_kit_material.md`, `newdocs/copy_strategy_nomad.md`, `newdocs/atmosphere_config.md`. При конфликте с этим файлом по дизайну/копи публичного фронта действует `newdocs/`.

Дальше — предметные спеки (`menu_page.md`, `zod_schemas.md`, …) и архитектурные заметки по разделам ниже.

**Индекс этого файла** удобно держать открытым рядом с [CODEBASE.md](CODEBASE.md): сначала «куда в коде», затем «что должно выполняться по контракту».

**Локальный запуск:** [README.md](../README.md) (раздел «Локальный запуск»), шаблон переменных — [.env.example](../.env.example); корень Next.js при втором `package-lock` в родителе — см. `outputFileTracingRoot` в [`next.config.ts`](../next.config.ts).

**Перед сдачей изменения** (с Git или без): [change-checklist.md](change-checklist.md). После подключения GitHub PR шаблон подхватывается из [.github/pull_request_template.md](../.github/pull_request_template.md).

---

## 1. Core & Governance (ядро)

*Правила игры и обязательные ориентиры для реализации.*

| Файл | Статус | Описание |
| :--- | :--- | :--- |
| [CODEBASE.md](CODEBASE.md) | **Operational** | Карта кодовой базы, каталог папок, правила слоёв, точки входа. |
| [master-spec.md](master-spec.md) | **Normative** | Главный контракт реализации. |
| [compliance-checklist.md](compliance-checklist.md) | **Normative** | Трекер соответствия спецификации (строки требований + статусы). |
| [spec.md](../spec.md) | **Normative** | Базовая техническая спецификация SaaS-платформы. |
| [blueprint.md](../blueprint.md) | **Normative** | Канон пилота (PLOVXAHA) и стек. |

---

## 2. Technical Architecture (техника)

| Файл | Статус | Описание |
| :--- | :--- | :--- |
| [deployment-runbook.md](deployment-runbook.md) | **Operational** | Выкат Vercel + Supabase, env, проверка после деплоя. |
| [integration-boundaries.md](integration-boundaries.md) | **Normative** | Что не дублировать в Next.js (WhatsApp/AI/iiko sync вынесены во внешний backend). |
| [database_schema.sql](../database_schema.sql) | **Reference** | Ориентир по схеме; **фактические DDL/RLS** — в `supabase/migrations/`. |
| [zod_schemas.md](../zod_schemas.md) | **Normative** | Контракты валидации (канон типов — код в `lib/validation/`). |
| [Production Runtime Architecture.md](../Production%20Runtime%20Architecture.md) | **Normative** (runtime-рельсы) / **Conceptual** (runtime theme через CSS vars) | Прод: infra, SSR, кэш, realtime. В v1 Heritage палитра зашита в Tailwind; runtime-темизация через CSS-переменные возвращается как roadmap с появлением второго тенанта. |
| [menu_data_flow.md](../menu_data_flow.md) | **Normative** | Поток данных меню от БД до UI; кэш `getMenu` (anon-server), стоп-лист staff, Realtime — см. раздел «Реализация в коде». |

---

## 3. UX & Design System (интерфейс)

| Файл | Статус | Описание |
| :--- | :--- | :--- |
| [public-site-ux.md](public-site-ux.md) | **Operational** | Дизайн-канон Heritage Edition для витрины: структура `/` (Hero→About→SignatureMenu→Gallery→Reserve→Footer), CTA, копирайт, слои фона. |
| [newdocs/visual_identity_heritage.md](../newdocs/visual_identity_heritage.md) | **Normative** | Heritage-слои, цветовая палитра (umber/gold/ember/cream), тени, моушн. |
| [newdocs/ui_kit_material.md](../newdocs/ui_kit_material.md) | **Normative** | Heritage-примитивы: Button (Primary/Secondary/Ghost), HeroFrame, CardFrame, типошкала, SectionDivider. |
| [newdocs/copy_strategy_nomad.md](../newdocs/copy_strategy_nomad.md) | **Normative** | Голос «Nomad», канонические тексты для всех секций и микрокопия. |
| [newdocs/atmosphere_config.md](../newdocs/atmosphere_config.md) | **Normative** | Параметры атмосферы (blur/opacity/overlayAlpha/blendMode) по секциям — исполняются в `config/atmosphere.ts`. |
| [design_system.md](../design_system.md) | **Legacy** | Устаревшие токены v1 (до Heritage). Актуальная палитра живёт в Tailwind-конфиге + `newdocs/visual_identity_heritage.md`. |
| [ui_kit.md](../ui_kit.md) | **Legacy** | Устаревшие примитивы админки (Button/Card/Badge/Input). Публичные примитивы — `components/ui/primitives/*` + `newdocs/ui_kit_material.md`. |
| [menu_page.md](../menu_page.md) | **Normative** (контракт) / **Legacy** (визуал) | Контракт данных и состояний валиден; визуал страницы меню переведён на Heritage (`CardFrame`, `t-*`, `umber-950`). |
| [ornament_design_layer.md](../ornament_design_layer.md) | **Conceptual** | Раннее видение орнаментов. Практическая реализация — `components/ornaments/*` + `newdocs/visual_identity_heritage.md`. |

---

## 4. Roadmap & Flows (планы)

| Файл | Статус | Описание |
| :--- | :--- | :--- |
| [admin_panel_flow.md](../admin_panel_flow.md) | **Planned** | Админка, CRUD, заказы. |
| [stripe_level_parallax_system.md](../stripe_level_parallax_system.md) | **Planned** | Сложные фоновые анимации. |
| [cultural_theme_engine.md](../cultural_theme_engine.md) | **Conceptual** | Темы под культуру заведения. |
| [dynamic_cultural_theme_system.md](../dynamic_cultural_theme_system.md) | **Conceptual** | Расширение культурных тем. |

---

## 5. Security & QA

| Файл | Статус | Описание |
| :--- | :--- | :--- |
| [security-spec.md](security-spec.md) | **Normative** | RLS, тенанты, валидация. |
| [testing-strategy.md](testing-strategy.md) | **Normative** | Unit, smoke, CI. |

Состояние реализации по требованиям — в [compliance-checklist.md](compliance-checklist.md) (раздел 1.1 и таблицы ниже).

---

## 6. Прочее

| Файл | Описание |
| :--- | :--- |
| [change-checklist.md](change-checklist.md) | Ручной чеклист перед коммитом/релизом (типчек, lint, smoke, доки). |
| [infrastructure_costs.md](../infrastructure_costs.md) | Оценка стоимости инфраструктуры. |
| [prompt.md](../prompt.md) | **Архив (Conceptual)** — методичка ранней стадии; примеры кода не валидны под Heritage (ссылаются на удалённые `motion/FadeIn`, `layout/Navbar`, hex `#050505`/`#C9A96E`). Для нового кода использовать `newdocs/*` + `docs/CODEBASE.md`. |
| [README.md](../README.md) | Обзор репозитория и quick start; ссылка на эту карту документов. |
