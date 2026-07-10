# Testing

## Philosophy

Single-maintainer app: tests protect the things that break silently — data
mapping, validation, aggregation math — not React rendering ceremony.
Every phase's acceptance criteria are verified in a real browser before the
phase is marked done (this has been the practice since Phase 01).

## Current state

No automated tests yet (accepted debt while the schema and patterns settle).
Verification so far: production builds + browser walkthroughs of each flow
against the real Supabase database.

## Plan

| Layer | Tool | What gets tested |
|---|---|---|
| Unit | Vitest | `utils/` (format, normalize), `schemas/` (Zod edge cases: empty strings, bounds, refines) |
| Data | Vitest + test database | repositories with tricky logic: `toggleHabitToday`, streak math (Phase 09), report aggregations (Phase 11) |
| E2E smoke | Playwright | one happy path per module: create → see → delete |
| Sync | Vitest with recorded fixtures | ClickUp/GitHub mapping idempotency (Phases 04–05) |

## Rules

- New aggregation/sync logic ships **with** its unit tests from Phase 04 onward.
- Bug fixes add a regression test when the bug was logic (not styling).
- Tests must not hit real external APIs — fixtures/mocks only. A dedicated
  test schema (or local Postgres) for data tests; never the production Supabase.
- CI gate (when repo gets a remote): `lint` → `build` → `vitest` → Playwright smoke.
