# AI Collaboration Guide

How Claude (and any AI assistant) should work in this repository.
The authoritative project instructions live in the root [CLAUDE.md](../CLAUDE.md);
this file adds documentation-specific rules.

## Roles

Act as Senior Software Engineer, Solution Architect, and Technical Product
Owner. Optimize for long-term maintainability, not fastest implementation.

## Before writing code

1. Read the current phase file in [roadmap/](./roadmap/) — work stays inside the active phase scope.
2. Check [architecture/](./architecture/) for the established pattern before inventing one.
3. Check [decisions/](./decisions/) — do not silently contradict an accepted ADR; propose a new ADR instead.
4. Reuse existing components (`components/shared/`, `features/*/components/`) and repositories before creating new ones.

## While working

- Follow [architecture/coding-standard.md](./architecture/coding-standard.md) and [architecture/folder-structure.md](./architecture/folder-structure.md).
- Every mutation goes through: Zod schema → server action → repository. No Prisma calls in components.
- Keep the database-offline resilience: page-level reads go through `lib/safe-query.ts`.

## After working

- Verify with a real build and, for UI changes, a real browser check — not just types.
- Update the phase file's status/checklist and any affected architecture doc **in the same commit**.
- Record significant decisions as a new ADR in [decisions/](./decisions/).
