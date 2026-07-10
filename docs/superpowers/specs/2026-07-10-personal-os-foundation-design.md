# Personal OS — Phase 1 Foundation Design

Date: 2026-07-10
Status: Implemented

## Goal

Establish the foundation of the Personal Engineering OS described in CLAUDE.md:
a Next.js 15 application with the core relational data model, the standard
folder structure, and a working dashboard shell — so every later module
(ClickUp sync, Git integration, monitoring, reports) plugs into an existing
skeleton instead of being bolted on.

## Scope

**In (Phase 1):**

- Next.js 15 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui (Nova preset)
- Prisma 7 + PostgreSQL schema for the core chain:
  Workspace → Client → Project → Sprint → Feature → Task,
  plus DailyActivity, Deployment, JournalEntry, Habit, HabitLog
- Folder structure per CLAUDE.md (features/, actions/, services/,
  repositories/, lib/, hooks/, schemas/, types/, store/, utils/, constants/)
- Dashboard shell: sidebar navigation, page header, stat cards
- Read-only module pages: Projects, Tasks, Activities, Journal, Habits
- Database-offline resilience: pages render with empty data + banner when
  PostgreSQL is not reachable

**Out (later phases):**

- Better Auth wiring (single-user local app first; auth before deployment)
- CRUD forms and server actions (Phase 2)
- ClickUp / GitHub sync, deployments UI, monitoring, documentation module,
  learning tracker, reports (Phase 3+)

## Architecture

- **Pages are Server Components** that call repository/service functions
  directly. No API routes needed for first-party reads.
- **repositories/** own Prisma queries (one file per aggregate).
- **services/** compose repositories where a page needs aggregated data
  (dashboard stats). Trivial single-repo reads skip the service layer — KISS.
- **lib/safe-query.ts** wraps queries so a missing database degrades to empty
  states instead of crashes.
- **Prisma 7** uses the `prisma-client` generator (output: `lib/generated/prisma`)
  with the `@prisma/adapter-pg` driver adapter; connection URL comes from
  `prisma.config.ts` → `.env`.
- Table names are snake_case via `@@map`; every model has `id`, `createdAt`,
  `updatedAt`.

## Key decisions

1. **Postgres over SQLite** — CLAUDE.md mandates PostgreSQL; the app tolerates
   its absence at render time so the UI is explorable before DB setup.
2. **Task links are optional FKs** (`projectId?`, `featureId?`, `sprintId?`) —
   quick capture without ceremony, relational when it matters.
3. **External IDs stored, remote data not duplicated** — `clickupId` on Task is
   the pattern for every future integration.
4. **Enums in the database** for statuses/priorities — typed end-to-end via the
   generated client.

## Next steps

1. Run `npx prisma migrate dev --name init` against a local PostgreSQL.
2. Phase 2: CRUD server actions + forms (Zod schemas in schemas/, forms with
   react-hook-form) for Workspace, Project, Task, Activity, Journal, Habit.
3. Phase 3: Better Auth, ClickUp sync, GitHub integration, reports.
