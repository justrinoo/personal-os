# Personal OS

Personal Engineering Operating System — the single source of truth for daily
work, projects, tasks, journaling, and habits. See `CLAUDE.md` for the full
vision and `docs/superpowers/specs/` for design documents.

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Prisma 7 · PostgreSQL

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure the database
cp .env.example .env   # then edit DATABASE_URL

# 3. Create the schema
npx prisma migrate dev --name init

# 4. Set auth secrets in .env (see .env.example)

# 5. Run
npm run dev
```

On first run, open /login and use the **First-time setup** tab to create the
single owner account — sign-up locks permanently afterwards.

The app renders without a database (empty states + offline banner), so you can
explore the UI before setting up PostgreSQL.

## Structure

- `app/` — routes (Server Components)
- `components/` — layout, shared, and shadcn/ui components
- `features/` — feature-scoped components
- `repositories/` — Prisma data access
- `services/` — multi-repository composition
- `prisma/` — schema and migrations
- `lib/`, `utils/`, `constants/`, `types/` — support code
- `actions/`, `hooks/`, `schemas/`, `store/` — reserved for Phase 2 (server
  actions, custom hooks, Zod schemas, Zustand stores)
