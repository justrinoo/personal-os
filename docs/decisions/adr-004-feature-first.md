# ADR-004 — Feature-first architecture with shared layers

**Status:** Accepted (2026-07-10)

## Context

The app will grow to 15+ modules over 12 phases, maintained by one person with
AI assistance. The structure must make it obvious where code lives, keep
modules from tangling, and stay friendly to AI edits (small, focused files
with predictable locations).

## Decision

**Feature-first UI, layered data.** Feature-specific components live in
`features/<module>/components/`; the data path is shared horizontal layers
(`schemas/` → `actions/` → `repositories/`, plus `services/` for composition)
with one file per entity per layer. Cross-feature UI primitives graduate to
`components/shared/`.

See [architecture/folder-structure.md](../architecture/folder-structure.md)
for the full map and placement rules.

## Alternatives considered

- **Fully vertical slices** (each feature owns its actions/repos/schemas
  inside its folder) — maximum isolation, but this app's entities are deeply
  relational (dashboard reads five repositories); vertical silos force
  awkward cross-feature imports immediately.
- **Flat layers only** (no `features/`) — fine at 5 components, unnavigable at 50.
- **Domain-driven modules with barrels** — over-ceremony for a single-dev app.

## Consequences

- ✅ Predictable: "task edit form" → `features/tasks/components/`;
  "task query" → `repositories/task.repository.ts`. AI and human agree on placement.
- ✅ The relational dashboard composes repositories without feature-to-feature imports.
- ⚠️ Discipline required: pages must not grow business logic, and shared
  components must not accumulate feature-specific props. Review for this in
  every phase.
