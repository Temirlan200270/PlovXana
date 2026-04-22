---
name: spec-review
description: Review an existing codebase against project specifications, compliance documents, release criteria, and architecture contracts. Use when the user asks to check whether the current implementation matches Markdown specs, normative docs, release readiness rules, or "what is missing and why". Default to review mode, not implementation mode.
---

# Spec Review

## Overview

Use this skill when the task is to assess whether already-written code matches the project's documented requirements. Treat this as a code-review workflow driven by specs, not a coding task.

## Workflow

1. Identify the normative documents using [docs/documentation-map.md](../../../docs/documentation-map.md) as the primary index.
2. Separate `normative`, `planned`, and `conceptual` sources based on the map.
3. Read only the documents needed to establish the implementation contract.
4. Inspect the current code against that contract.
5. Report findings first, ordered by severity.

## Review Rules

- Default to reviewer mode unless the user explicitly asks for changes.
- Focus on gaps between code and requirements, not on ideal rewrites.
- Treat release blockers, security issues, false `done` states, and contract violations as highest severity.    
- Distinguish clearly between:
  - implemented
  - partial
  - planned
  - blocked
- Do not treat roadmap or conceptual docs as release blockers unless a higher-priority normative doc promotes them.

## Source Priority

When multiple docs exist, use this priority order unless the repo defines a stricter one:

1. codebase map / master spec / security / testing strategy / compliance docs
2. older normative spec files
3. planned docs
4. conceptual or inspiration docs

If documents conflict, say so explicitly and name the higher-priority source.

## What To Check

For each relevant area, verify both code and documentation claims:

- structural compliance with [docs/CODEBASE.md](../../../docs/CODEBASE.md)
- tenant/runtime boundaries
- route scope
- canonical content source of truth
- SEO and structured data
- service-layer data flow
- validation boundaries
- UI kit contract
- image pipeline
- accessibility baseline
- verification gates such as lint, typecheck, build, and tests

Also check whether compliance/status docs overstate the implementation.

## Output Shape

Use the standard review structure:

1. Findings
2. Open questions or assumptions
3. Short summary

Each finding should include:

- severity
- why it violates the documented contract
- the document source
- code references

If no issues are found, say that clearly and note residual risk or missing verification.
## Project Mode: PLOVXAHA v1 Release-Ready

If the repo is the PLOVXAHA project, default the first review pass to the v1 release scope before broader platform compliance.

Check release blockers first:

- server-side tenant context
- no production fallback mode for tenant resolution
- canonical tenant content source of truth
- homepage and `/plovxana/menu` render correctly
- SEO metadata on public routes
- `Restaurant` JSON-LD and menu metadata where applicable
- server-side menu read path through services
- Zod validation at boundaries
- approved image baseline: optimized image path, explicit remote config, meaningful `alt`, responsive behavior  
- accessibility baseline for public routes
- verification gates: lint, typecheck, build, smoke checks
- no mojibake or broken user-facing text in release surfaces

For PLOVXAHA requests, structure findings in this order:

1. Release blockers
2. Important non-blocking gaps
3. Planned/platform items that should not block v1

Do not escalate roadmap or conceptual docs into blockers unless a normative document explicitly promotes them.
