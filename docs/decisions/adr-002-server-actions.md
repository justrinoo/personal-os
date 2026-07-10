# ADR-002 — Server Actions for first-party mutations

**Status:** Accepted (2026-07-10)

## Context

The UI needs create/update/delete for every module. Options: REST-ish route
handlers (`app/api/*`) consumed by client `fetch`, tRPC, or Next.js Server
Actions. The app is single-user, first-party only — there is no external API
consumer today.

## Decision

**Server Actions** for all first-party mutations, with a fixed pipeline:
Zod schema (`schemas/`) → action (`actions/*.actions.ts`) validates and
normalizes → repository (`repositories/`) → `revalidatePath`. Actions return a
typed `ActionResult` (`{ ok, error? }`) instead of throwing.

Route handlers are reserved for **external callers**: future webhooks
(Coolify, ClickUp) and any future public API — which will then use the
`ApiResponse` envelope from root CLAUDE.md.

## Alternatives considered

- **Route handlers + fetch** — more boilerplate (serialization, status codes,
  client fetch states) for zero benefit while the only consumer is our own UI.
- **tRPC** — great DX for larger teams/apps, but an extra layer and dependency
  the App Router + actions combination already covers.

## Consequences

- ✅ End-to-end types without codegen; progressive enhancement possible.
- ✅ Revalidation is declarative (`revalidatePath`) — no client cache to manage (see state-management doc).
- ⚠️ Server actions are public endpoints once deployed — Phase 03 must add an
  auth check **inside every action**, not just middleware.
- ⚠️ When an external API is needed, it is a separate deliberate build — not a
  refactor of actions.
