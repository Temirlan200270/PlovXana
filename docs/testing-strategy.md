# Testing Strategy

Status: Normative  
Audience: engineering, QA, reviewers, release owners  
Scope: verification requirements for production compliance

## 1. Purpose

This document defines the minimum verification required before calling the codebase production-ready for its implemented scope.

Testing is not optional polish. It is the mechanism that proves the code matches the contracts in:

- `docs/master-spec.md`
- `docs/security-spec.md`
- `docs/compliance-checklist.md`

## 2. Test Philosophy

The project should favor:

- narrow unit tests for normalization and validation
- service/integration tests for tenant-scoped data flow
- route-level smoke tests for public rendering and metadata
- targeted end-to-end checks for critical user journeys

The goal is not maximal test count. The goal is high confidence in:

- tenant isolation
- server boundaries
- public route correctness
- metadata correctness
- schema enforcement
- future-safe architecture

## 3. Required Verification Gates

Every release candidate must pass:

- lint
- typecheck
- production build
- required automated tests

Recommended standard scripts:

- `lint`
- `typecheck`
- `build`
- `test`
- `test:unit`
- `test:integration`
- `test:e2e`

If the repo does not yet expose all scripts, this is technical debt, not a reason to weaken the contract.

### Smoke script and service role

`scripts/smoke.mjs` runs lint, typecheck, production build, then starts `next start` and fetches public routes. By default it does **not** require `SUPABASE_SERVICE_ROLE_KEY` (so local runs and CI without Supabase secrets keep working).

For a **production-like** gate, set `SMOKE_REQUIRE_SERVICE_ROLE=1` (or `true`). Then the script exits with an error if `SUPABASE_SERVICE_ROLE_KEY` is missing — use before release or in CI that has the secret configured. See `docs/deployment-runbook.md`.

## 4. Test Pyramid for This Project

## 4.1 Unit Tests

Required for:

- Zod schemas and validators
- DTO normalization
- tenant helper logic
- metadata builders
- theme token mapping
- URL/canonical helpers
- price formatting and display-only helpers

Unit tests must be fast and deterministic.

## 4.2 Integration Tests

Required for:

- tenant resolution to service-layer flow
- menu retrieval and normalization
- canonical tenant content composition
- metadata generation from tenant data
- server error handling for malformed data

These tests should validate module interactions without requiring full browser automation.

## 4.3 End-to-End / Route Smoke Tests

Required for public production routes:

- homepage renders
- tenant menu route renders
- metadata exists
- structured data exists
- navigation links are valid
- critical interactive controls are keyboard reachable

Browser-level tests should be focused on high-value paths, not exhaustive decoration.

## 5. Mandatory Coverage Areas

## 5.1 Tenant Resolution

Must verify:

- default tenant fallback behavior
- slug-based tenant resolution
- host-based resolution behavior when middleware is introduced
- invalid tenant behavior

Expected assertions:

- wrong tenant does not leak data
- valid tenant yields correct config
- fallback mode is explicit and safe

## 5.2 Canonical Tenant Content

Must verify:

- footer uses canonical tenant contacts
- metadata uses canonical tenant fields
- structured data uses canonical tenant fields
- homepage/menu headings align with tenant source of truth

This is important because copy drift is one of the easiest ways the implementation silently diverges from the spec.

## 5.3 Menu Service Layer

Must verify:

- tenant-scoped queries
- Zod parsing of DB payloads
- invalid category/item rows fail gracefully
- UI DTOs are normalized correctly
- invisible/unavailable items are filtered as intended

## 5.4 SEO and Metadata

Must verify:

- `title`
- `description`
- Open Graph basics
- Twitter basics
- `Restaurant` JSON-LD presence and field correctness
- tenant route metadata differs correctly by tenant context where applicable

## 5.5 UI Accessibility Baseline

Must verify:

- buttons/links have accessible names
- keyboard focus can reach navigation and menu category controls
- meaningful images have non-empty `alt`
- no critical interaction relies on pointer only

Automated checks are useful, but do not replace minimal manual review.

## 5.6 Theme Runtime

Must verify:

- theme schema parsing
- CSS variable/token generation
- routes render with valid theme fallback
- missing optional theme fields do not break rendering

## 5.7 Security-Sensitive Behaviors

Must verify:

- tenant mismatch cannot produce another tenant's menu
- unauthorized privileged routes/actions fail closed when introduced
- client-submitted critical values are not blindly trusted in write paths when introduced

## 6. Required Test Cases by Module

## 6.1 Validation

Add tests for:

- valid tenant row
- invalid tenant row
- valid category rows
- invalid menu item rows
- optional field normalization

## 6.2 Services

Add tests for:

- `getTenant`
- `getTenantBySlug`
- canonical content composition
- `getMenu`
- metadata/SEO builders when introduced

Mocking is acceptable if it preserves contract realism.

## 6.3 Routes

Add smoke tests for:

- `/`
- `/[slug]/menu`
- not-found behavior for invalid slug

Assertions should include both status/rendering and key semantic output.

## 7. Manual Review Requirements

The following still require human review before release:

- visual text correctness and encoding
- no mojibake in user-visible content
- metadata reflects intended tenant content
- design remains within agreed system constraints
- accessibility basics under keyboard navigation
- no hardcoded tenant drift in UI copy

Manual review should be short but deliberate.

## 8. CI Expectations

CI should fail on:

- lint failure
- typecheck failure
- build failure
- required tests failure

CI should expose enough output to identify:

- which module failed
- whether the issue is validation, rendering, metadata, or route flow

## 9. Pre-Release Checklist

Before any release marked production-ready:

- lint passes
- typecheck passes
- build passes
- public smoke tests pass
- metadata tests pass
- service/validation tests pass
- compliance checklist updated
- unresolved gaps are explicitly documented

## 10. Minimum Definition of Tested

A feature is not considered tested because it renders locally once.

A feature is tested only when:

- its core logic has automated coverage at the correct layer
- its route behavior is smoke-tested if publicly reachable
- its failure behavior has been exercised
- its security-sensitive assumptions have at least one negative-path test where applicable

## 11. Recommended Initial Test Roadmap

Priority order for this repo:

1. validation tests for tenant/menu schemas
2. service tests for tenant resolution and menu loading
3. metadata/JSON-LD tests for public routes
4. route smoke tests for `/` and `/[slug]/menu`
5. accessibility smoke tests for critical controls
6. future order/admin/realtime tests as those modules ship

## 12. Anti-Patterns

Avoid:

- snapshot-only testing for business-critical modules
- testing implementation details instead of contracts
- relying only on manual browser checks
- declaring roadmap modules "tested" before they exist
- E2E-heavy strategy with no service-level tests

## 13. Definition of Done

No feature covered by the master spec is complete until its required verification exists and passes.
