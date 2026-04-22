# Master Spec

Status: Normative  
Audience: engineering, product, design, QA, security review  
Scope: production contract for the Restaurant OS codebase

## 1. Purpose

This document is the single implementation contract for the project. Other Markdown files may provide vision, rationale, examples, or future direction, but this file defines what the codebase must satisfy to be considered production-compliant.

If another document conflicts with this file:

1. `master-spec.md` wins for implementation decisions.
2. `security-spec.md` wins for security constraints.
3. `testing-strategy.md` wins for verification requirements.
4. Vision and concept documents are advisory unless explicitly promoted into this spec.

## 2. Product Scope

The product is a multi-tenant restaurant platform with:

- public tenant-facing website
- SSR menu experience
- tenant-aware branding and metadata
- server-side data access through validated service boundaries
- production-ready foundation for orders, admin, RBAC, realtime, AI, and integrations

The current production baseline is not "all roadmap modules shipped". The baseline is that shipped modules are implemented in a way that scales into the full platform without architectural rewrite.

## 3. Normative Sources

Implementation work should be navigated using:

- `docs/documentation-map.md` (index and reading order)
- `docs/CODEBASE.md` (where code lives and layer boundaries)
- `docs/compliance-checklist.md` (tracked compliance state versus this spec)
- `docs/deployment-runbook.md` (Vercel + Supabase env and post-deploy checks, when releasing)

The following existing project documents are treated as source material, but only the requirements reflected here are normative:

- `spec.md`
- `blueprint.md`
- `Production Runtime Architecture.md`
- `menu_page.md`
- `menu_data_flow.md`
- `ui_kit.md`
- `design_system.md`
- `zod_schemas.md`

The following are planned unless explicitly promoted into this spec:

- `admin_panel_flow.md`
- `infrastructure_costs.md`

The following are conceptual or future-facing unless explicitly referenced below:

- `README.md`
- `cultural_theme_engine.md`
- `dynamic_cultural_theme_system.md`
- `ornament_design_layer.md`
- `stripe_level_parallax_system.md`
- `prompt.md`

## 4. Delivery Phases

### 4.1 Production Baseline

Required now:

- tenant resolution
- public homepage
- tenant menu page
- service-layer data loading
- Zod validation at server boundaries
- SEO and structured metadata
- canonical tenant content pipeline
- theme runtime contract
- image pipeline contract
- accessible public UI baseline

### 4.2 Platform Expansion

Required before broader platform launch:

- cart and order write path
- admin shell
- RBAC enforcement
- realtime event flow
- auditability and monitoring

### 4.3 Differentiation Layer

Optional until promoted:

- advanced cultural theme switching
- parallax engine
- high-touch motion system
- AI concierge runtime
- deep external integrations

These may not weaken baseline correctness, accessibility, performance, or maintainability.

## 5. Architectural Rules

## 5.1 Layering

The system must follow this boundary model:

- presentation layer: React components, layout, styling, animation
- application/service layer: tenant resolution, content assembly, menu retrieval, orchestration
- validation layer: Zod schemas for external and persistence boundaries
- data access layer: Supabase/Postgres access only through server-side code
- security layer: tenant isolation, RBAC, RLS, server-only policy enforcement

Business logic must not live in UI components.

Allowed in UI:

- rendering
- local interaction state
- visual filtering of already-authorized data
- accessibility behavior

Not allowed in UI:

- tenant authorization
- pricing rules
- order validation
- permission checks
- trust decisions

## 5.2 Server Boundaries

All reads and writes to tenant business data must go through server-side code:

- Server Components
- Route Handlers
- Server Actions
- server-only service functions

The browser must never be the authority for tenant scope, permissions, or record validity.

## 5.3 Multi-Tenancy

All tenant-bound domain records must resolve against a tenant identifier.

Production expectations:

- tenant slug may come from pathname and/or host
- tenant context must be resolved server-side
- middleware must be used when host-based or header-based tenant injection is required
- no cross-tenant data access may be possible through UI routing mistakes
- DB access must remain compatible with RLS enforcement

## 6. Routing Contract

## 6.1 Required Routes

- `/` public homepage
- `/[slug]/menu` tenant menu

## 6.2 Required Planned Routes

These must exist in the architectural plan and remain reserved:

- `/[slug]/order`
- `/admin`
- `/admin/dashboard`
- `/admin/menu`
- `/admin/orders`
- `/privacy-policy`
- `/terms-of-service`

If not implemented yet, they must be marked planned in the compliance checklist rather than implied as complete.

## 7. Tenant Source of Truth

Tenant content must come from a canonical tenant configuration source.

This source must define at minimum:

- `id`
- `slug`
- `display name`
- contact phones
- address
- hours
- social links
- currency
- SEO-relevant fields
- theme contract

The following surfaces must consume canonical tenant data, not hardcoded copies:

- metadata
- JSON-LD
- footer
- navbar brand
- homepage copy where tenant-specific
- menu page headings
- AI contextual copy if exposed publicly

## 8. SEO Contract

The public site must be SEO-capable and metadata-driven.

Required:

- route-level metadata generation
- tenant-aware titles and descriptions
- Open Graph fields
- Twitter card fields
- canonical URLs where applicable
- `Restaurant` JSON-LD on public tenant pages
- menu-aware structured data where implemented

Static hardcoded metadata is acceptable only for truly global non-tenant pages.

## 9. Menu Runtime Contract

The menu flow must follow this shape:

1. server resolves tenant
2. server loads validated tenant data
3. server loads validated menu data through a service
4. UI receives normalized display-safe structures
5. client handles lightweight interactivity only

Required properties:

- SSR or server-first rendering
- tenant-scoped fetching
- Zod validation of DB responses
- non-fatal handling of malformed upstream data
- meaningful empty/error states
- image rendering through approved image pipeline
- accessibility-compliant category controls

## 10. Theme Contract

Theme support is mandatory as a contract even if only one active preset is shipped.

Required:

- typed theme schema
- theme values mapped to CSS variables or equivalent runtime token system
- no untyped `record(unknown)` used as the effective theme API
- presentation components read tokens, not magic values, when tenant theming is expected

Optional until promoted:

- dynamic runtime switching between multiple cultural themes
- motion styles per theme
- ornament engines

## 11. UI System Contract

The UI kit is an API, not just a set of styles.

Required primitives:

- Button
- Card
- Badge

Planned primitives required before interactive form/admin surfaces are considered production-compliant:

- Input

Required component qualities:

- typed props
- predictable variant API
- accessibility states
- disabled states
- loading states where relevant
- `forwardRef` where the component is a focusable primitive or intended for composition
- consistent token usage

Required design constraints:

- restrained dark-first luxury visual system
- no arbitrary one-off component styling when shared primitive exists
- production-safe radii and spacing rules
- text must remain stable across viewport sizes

## 12. Image Contract

Public images must use an approved delivery path.

Required:

- `next/image` or an equivalent framework-native optimized path
- configured remote patterns or safe local asset strategy
- non-empty meaningful `alt` text unless decorative
- responsive sizing
- optimization-compatible source handling

Strongly expected:

- placeholders
- compression strategy
- CDN-compatible URLs

## 13. Validation Contract

Zod is the normative validation boundary for application inputs and persistence outputs.

Required schema groups:

- tenant
- menu
- category
- modifier
- order
- staff/RBAC

Rules:

- parse at the boundary, not deep in rendering logic
- normalize into UI-safe DTOs after validation
- log parse failures server-side
- avoid `any` and loosely typed business payloads

## 14. Security Contract

See `security-spec.md` for full detail.

At minimum:

- tenant isolation by design
- server-side permission checks
- no trust in client-provided tenant identifiers without server validation
- DB queries must remain compatible with RLS
- secrets never exposed to the browser

## 15. Performance Contract

Required baseline:

- server-first rendering for public pages
- sensible revalidation/caching strategy
- no unnecessary client overfetching
- lazy or deferred loading where appropriate
- image optimization
- stable rendering under tenant traffic growth

Nice-to-have performance effects may never degrade baseline UX.

## 16. Accessibility Contract

Required baseline for public pages:

- semantic landmarks
- keyboard-reachable controls
- visible focus states
- accessible names for actionable controls
- non-empty alt text for meaningful images
- text contrast consistent with dark theme usage

Animation must not be required to understand the interface.

## 17. Content and Encoding Rules

Required:

- UTF-8 encoded source files for user-facing text assets
- consistent language policy for visible content
- no mojibake in shipped UI strings or docs promoted as normative

If bilingual or multilingual support is added later, it must be explicit rather than accidental.

## 18. Definition of Done

A production feature is done only if all of the following are true:

- architecture follows layer boundaries
- types are explicit
- Zod validation exists at boundaries
- empty/error/loading states are handled
- metadata is correct if the route is public
- accessibility baseline is met
- lint passes
- build passes
- compliance checklist is updated
- tests required by `testing-strategy.md` are present and passing

## 19. Non-Goals

Not required for baseline compliance unless promoted later:

- full ERP
- advanced accounting
- warehouse/inventory suite
- exhaustive analytics platform
- rich motion/parallax system beyond baseline UX support

## 20. Change Control

Any new architecture or feature document must declare one of:

- `Normative`
- `Planned`
- `Conceptual`
- `Experimental`

Only `Normative` requirements may block compliance by default.
