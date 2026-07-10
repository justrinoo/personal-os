# Folder Structure

Feature-first with shared layers. One folder = one responsibility.

```
app/                     Routes (Server Components) — thin: fetch + compose
components/
  layout/                App shell: sidebar, page header
  shared/                Cross-feature primitives: EmptyState, StatusBadge,
                         DeleteButton, EnumSelect, FieldError, DbOfflineBanner
  ui/                    shadcn/ui components (generated — edit sparingly)
features/
  <module>/components/   Feature-scoped components (form dialogs, cards)
actions/                 Server actions: one file per entity (*.actions.ts)
services/                Multi-repository composition (*.service.ts)
repositories/            All Prisma queries (*.repository.ts)
schemas/                 Zod schemas (*.schema.ts) — validation source of truth
lib/                     prisma client, safe-query, cn utility, generated client
hooks/                   Reusable client hooks
types/                   Shared types (ApiResponse, ActionResult)
store/                   Zustand stores (client-only UI state)
utils/                   Pure functions (format, normalize)
constants/               Navigation, enum value lists
prisma/                  schema.prisma + migrations/
docs/                    This documentation tree
```

## Placement rules

- Used by 2+ features → `components/shared/`; used by one → `features/<module>/components/`.
- A component that needs interactivity is a client component (`"use client"`),
  kept as small as possible; the page around it stays a server component.
- Pure logic (formatting, normalizing) goes in `utils/` — never inline in components.
- Enum value lists used by both Zod and selects live in `constants/enums.ts`
  and must match `prisma/schema.prisma`.

## Naming

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase file kebab-case | `status-badge.tsx` → `StatusBadge` |
| Hooks | `useSomething` | `use-mobile.ts` |
| Actions | `<verb><Entity>Action` | `createTaskAction` |
| Repositories | `<verb><Entity>` | `listProjects`, `deleteHabit` |
| DB tables | snake_case | `journal_entries` |
