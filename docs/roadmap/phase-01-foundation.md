# Phase 01 — Foundation

**Status:** ✅ Done (2026-07-10, commits `95b08be`, `204fd3f`)

## Goal

A running application skeleton every later module plugs into: framework,
database schema, folder structure, and a navigable dashboard shell.

## Scope

- Next.js 15 + React 19 + TypeScript + Tailwind v4 + shadcn/ui (Nova preset)
- Prisma 7 schema for the core chain: Workspace → Client → Project → Sprint →
  Feature → Task, plus DailyActivity, Deployment, JournalEntry, Habit, HabitLog
- Initial migration applied to Supabase PostgreSQL
- Folder structure per root CLAUDE.md
- Dashboard shell: sidebar navigation, page header, stat cards
- Read-only pages: Dashboard, Projects, Tasks, Activities, Journal, Habits
- Database-offline resilience (`lib/safe-query.ts` + banner)

## Out of scope

Mutations, auth, integrations.

## Acceptance criteria

- [x] `next build` passes with all routes dynamic
- [x] All pages return 200 with and without a reachable database
- [x] Migration `20260710141246_init` creates 11 tables in Supabase
- [x] Data written to the database appears on the pages

## Notes

- Prisma 7 requires the `@prisma/adapter-pg` driver adapter.
- Generated client lives in `lib/generated/prisma` (gitignored; `postinstall` regenerates).
