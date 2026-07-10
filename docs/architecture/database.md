# Database

PostgreSQL on Supabase, accessed exclusively through Prisma 7.
ERD: [diagrams/erd.md](../diagrams/erd.md).

## Connection

- **Session pooler** (`aws-0-ap-northeast-1.pooler.supabase.com:5432`) — IPv4
  compatible and supports prepared statements, which Prisma requires.
  Do not switch to the transaction pooler (6543) without `?pgbouncer=true`.
- URL comes from `DATABASE_URL` in `.env`, loaded by `prisma.config.ts` (dotenv).
- Prisma 7 uses the `@prisma/adapter-pg` driver adapter (`lib/prisma.ts`,
  singleton with global caching in dev).

## Conventions

| Convention | Rule |
|---|---|
| Primary keys | `cuid()` strings |
| Timestamps | every model has `createdAt` + `updatedAt` |
| Table names | snake_case via `@@map` (`daily_activities`) |
| Enums | database enums, generated as TS types |
| Foreign keys | required parent → `onDelete: Cascade`; optional link → `onDelete: SetNull` |
| External IDs | integrations store remote IDs (`clickupId`), never duplicate remote data |

## Entities (Phase 01 schema)

Core chain: `Workspace → Client → Project → Sprint → Feature → Task`
Standalone: `DailyActivity` (optional project), `Deployment` (project),
`JournalEntry`, `Habit → HabitLog` (unique per habit+date).

## Workflow

```bash
# after editing prisma/schema.prisma
./node_modules/.bin/prisma migrate dev --name <change>   # dev: create + apply
./node_modules/.bin/prisma migrate deploy                # prod: apply committed migrations
```

- Migrations are committed; never edit an applied migration.
- Generated client (`lib/generated/prisma/`) is gitignored; `postinstall` regenerates.
- On this machine call `./node_modules/.bin/prisma` (the RTK hook breaks `npx prisma`).
