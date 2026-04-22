# Security Spec

Status: Normative  
Audience: engineering, backend, app platform, reviewers  
Scope: mandatory security contract for Restaurant OS

## 1. Security Goals

The system must protect:

- tenant isolation
- customer data
- order integrity
- staff/admin permissions
- secret management
- auditability of privileged actions

The architecture must assume that:

- clients are untrusted
- routes can be guessed
- payloads can be tampered with
- UI bugs happen
- authorization mistakes in the frontend are inevitable unless the server remains authoritative

## 2. Trust Model

Trusted:

- server-side code
- database RLS and policies
- validated server-side service boundaries
- environment secrets kept out of client bundles

Untrusted:

- browser local state
- query params
- hidden form fields
- client-sent tenant IDs
- client-sent prices
- client-side permission assumptions

## 3. Tenant Isolation

Tenant isolation is the primary security boundary.

Required:

- all tenant-owned records are scoped by tenant identifier
- server resolves tenant context before data access
- service functions never query tenant business data without tenant scope
- data access stays compatible with RLS policies
- no API or service returns cross-tenant data due to route ambiguity

Forbidden:

- trusting tenant ID from browser input without server validation
- querying tenant tables without tenant filter unless intentionally privileged and reviewed
- mixing tenant-neutral and tenant-scoped DTOs without explicit naming and validation

## 4. Authorization Model

Authorization must be server-side.

Required:

- all privileged actions are checked on the server
- RBAC decisions are made outside UI components
- admin-only routes and mutations have explicit permission gates
- kitchen/waiter/manager/owner visibility is enforced server-side when implemented

Forbidden:

- hiding buttons in UI as the only authorization mechanism
- using role values from client storage as the authority
- exposing unrestricted admin data and filtering it only in the browser

## 5. Database Security

The database is expected to enforce isolation and access policy.

Required:

- RLS-compatible schema design
- queries written so that RLS can protect tenant data
- service-role credentials, if ever used, are confined to server-only privileged paths
- privileged DB operations are minimized and auditable

Strongly required:

- indexes supporting tenant-scoped access patterns
- explicit treatment of background jobs and revalidation hooks as privileged paths

### 5.1 Public menu read vs staff stop-list (canonical implementation)

This repo distinguishes **guest catalog reads**, **cached server reads**, and **staff mutations**:

- **Public menu (`getMenu`)** uses `lib/supabase/anon-server.ts` (no session cookies) inside Next.js `unstable_cache`, because the cached callback **must not** call dynamic request APIs such as `cookies()`. Tags (`lib/cache/tags.ts`) + `revalidateTag` in server actions invalidate the Data Cache after changes.
- **Stop-list / availability updates** are implemented in `app/actions/menu.actions.ts` with `createSupabaseServerClient()` so the request runs as the **authenticated staff user** and is enforced by RLS (`menu_items_staff_update` in `supabase/migrations/20260424_0008_menu_realtime.sql`). **Do not** use `service_role` / `lib/supabase/admin.ts` for this path unless the threat model explicitly requires bypassing RLS and the action is audited separately.
- **Realtime** on the public menu page: `components/menu/MenuClient.tsx` subscribes to `postgres_changes` on `menu_items` (filtered by `tenant_id`) and calls `router.refresh()`; the same migration enables Realtime replication for `menu_items`.

### 5.2 Telegram order notifications (optional)

- `TELEGRAM_BOT_TOKEN` and chat routing (`tenants.telegram_chat_id` or env fallback `TELEGRAM_CHAT_ID`) are **server-only**; never expose under `NEXT_PUBLIC_*`.
- Notifications are sent **asynchronously** after a successful order commit; failures must not block the guest response (log + structured warning).

## 6. Input Validation

All untrusted input must be validated at the server boundary.

Required:

- Zod schemas for mutation inputs
- schema validation for persistence output where shape trust is required
- normalization after validation
- rejection of malformed privileged input

High-risk inputs:

- order submissions
- admin mutations
- tenant configuration changes
- image upload metadata
- external webhook payloads

Forbidden:

- direct use of `unknown` payloads past the boundary
- permissive pass-through DTOs for privileged flows
- client-only validation as the sole validation layer

## 7. Pricing and Order Integrity

Price and order totals are server-owned facts.

Required:

- the server derives authoritative pricing
- modifier pricing is resolved from trusted data
- totals are never trusted from the browser without recomputation or verification
- stored order line items snapshot resolved prices at write time

Forbidden:

- charging or persisting raw client-submitted totals as authoritative
- using UI display values as accounting values

## 8. Secrets and Configuration

Required:

- secrets remain server-only
- public environment variables are safe for browser exposure
- no API keys or privileged tokens are committed to source control
- fallback/development behavior never leaks secrets into client output

Forbidden:

- using `NEXT_PUBLIC_*` for sensitive credentials
- embedding secret integration tokens into public JS bundles

## 9. External Integrations

All external integrations must be treated as untrusted boundaries.

Required when implemented:

- webhook signature verification where the provider supports it
- request authentication and replay protection where applicable
- timeouts and retries designed to avoid duplicate order writes
- idempotency strategy for payment and order-related callbacks

Integrations include:

- payment providers
- Telegram
- Meta/WhatsApp (входящий webhook и обработка — во внешнем backend; см. [integration-boundaries.md](integration-boundaries.md))
- iiko adapter
- AI providers

## 10. File and Image Security

Required:

- uploaded file metadata is validated
- content type is constrained
- storage paths do not permit tenant crossover
- remote image domains are allowlisted
- user-provided URLs are not blindly trusted into critical rendering or admin flows

Forbidden:

- arbitrary remote asset loading from uncontrolled origins in production
- exposing internal storage locations unnecessarily

## 11. Logging and Audit

Required for privileged and security-relevant actions:

- structured server-side logs
- tenant identifier in logs where relevant
- actor identifier for admin/staff actions
- event type classification

Required events once those features exist:

- admin login
- menu mutations
- theme/config changes
- order status changes
- permission changes
- privileged integration failures

Sensitive data rules:

- do not log secrets
- do not log full payment payloads
- do not log unnecessary customer PII

## 12. Error Handling

Required:

- user-facing errors must not leak internal stack details
- server logs must contain enough diagnostic detail for investigation
- malformed tenant or authorization states fail closed

Fail closed means:

- unknown tenant -> no tenant data
- unauthorized actor -> no privileged result
- invalid mutation payload -> reject and log

## 13. Middleware and Edge Concerns

If middleware participates in tenant resolution or auth propagation:

Required:

- header injection is deterministic
- downstream code does not trust spoofable headers unless set by trusted runtime logic
- middleware failures degrade safely

Forbidden:

- accepting arbitrary user-supplied `x-tenant-*` headers as authoritative in hostile contexts

## 14. AI Security

If AI features are enabled:

Required:

- prompts must not include secrets
- tenant data sent to AI must remain scoped
- moderation or guardrails must be considered for public chatbot surfaces
- tool/action execution must remain server-authorized

Forbidden:

- giving the model authority to mutate business data without a validated server action layer
- mixing data between tenants in retrieval context

## 15. Security Verification Requirements

Before a feature is considered production-ready:

- server boundary validation exists
- tenant scope is explicit
- authorization location is documented
- logging expectations are defined
- misuse cases are reviewed

Minimum recurring checks:

- lint and typecheck
- dependency review
- route/mutation permission review
- tenant leakage review
- secret exposure review

## 16. Security Definition of Done

A security-sensitive feature is done only if:

- tenant boundary is explicit
- authorization is server-side
- validation exists
- logging exists for privileged actions where appropriate
- error handling fails closed
- no client-trusted critical fields remain
- checklist and tests are updated
