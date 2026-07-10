# Coding Standard

## TypeScript

- `strict` mode; **no `any`** — use generated Prisma types, `z.infer`, or explicit interfaces.
- Explicit interfaces for component props; type imports with `import type`.
- Prefer `interface` for object shapes, `type` for unions/aliases.

## React / Next.js

- **Server Components by default.** Add `"use client"` only for interactivity,
  and keep the client boundary as low in the tree as possible.
- Pages: fetch (via repositories/services) → compose components. No business logic in JSX.
- All data pages export `dynamic = "force-dynamic"` and `metadata`.
- Mutations only via server actions; never `fetch` to own API routes for first-party UI.

## Validation

- Zod at every trust boundary: client form (UX) **and** server action (safety) —
  the same schema from `schemas/`.
- Normalize form values in actions (`utils/normalize.ts`): `"" → null`,
  string dates → `Date`, rating strings → numbers.

## Error handling

- Server actions return `ActionResult` (`{ ok, error? }`) — never throw at the UI.
- Page reads use `safeQuery` with a fallback so pages render without a database.
- User feedback: field errors under inputs, sonner toasts for action results.

## Style

- Match existing formatting (Prettier defaults, double quotes, trailing commas).
- Comments only for non-obvious constraints — code should read without them.
- Imports: external packages first, then `@/` aliases, alphabetized within groups.

## Definition of done

Build passes (`npm run build`), lint clean, the affected flow verified in a
real browser, docs/phase file updated in the same commit.
