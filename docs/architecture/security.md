# Security

Single-user personal app — the goal is protecting a personal deployment and
its API tokens, not building a permission system.

## Current posture

- **Better Auth is live (Phase 03):** email/password, single owner account,
  session cookies (httpOnly, sameSite=lax). Three layers: middleware redirect
  (optimistic cookie check) → server-side `getSession()` in the `(app)` layout
  → guard inside every server action. Sign-up returns 403 once an owner exists.
- `.env` is gitignored (`.env*` with `!.env.example`); verified on every commit
  that no secret is staged. `.env.example` contains placeholders only.
  Secrets: `DATABASE_URL`, `BETTER_AUTH_SECRET` (64-hex random), `BETTER_AUTH_URL`.
- Database credentials exist only in `.env`; Supabase connection uses TLS.

## Input handling

- Every mutation validates on the server with Zod regardless of client
  validation (`actions/*` re-parse all input).
- Prisma parameterizes all queries — no string-built SQL. `$queryRaw` only as
  tagged template (parameterized), never string concatenation.
- Server actions return typed errors; internal error details are never sent to
  the client (generic messages + server-side logs).

## Planned

- `secure` cookie flag + HTTPS once deployed (Phase 06).
- Webhook endpoints authenticated by shared secret; integration tokens
  scoped read-only where the provider allows (Phases 04–07).

## Data

- Supabase RLS is not used — the app connects as a single role and Better Auth
  gates access at the application layer. Revisit if the database is ever
  shared with other clients.
- Backups: Supabase automated backups; add `pg_dump` export before v1
  (see [release-v1.md](../roadmap/release-v1.md)).
