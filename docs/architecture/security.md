# Security

Single-user personal app — the goal is protecting a personal deployment and
its API tokens, not building a permission system.

## Current posture (pre-auth)

- Runs locally only. **Do not deploy publicly before Phase 03 (Better Auth).**
- `.env` is gitignored (`.env*` with `!.env.example`); verified on every commit
  that no secret is staged. `.env.example` contains placeholders only.
- Database credentials exist only in `.env`; Supabase connection uses TLS.

## Input handling

- Every mutation validates on the server with Zod regardless of client
  validation (`actions/*` re-parse all input).
- Prisma parameterizes all queries — no string-built SQL. `$queryRaw` only as
  tagged template (parameterized), never string concatenation.
- Server actions return typed errors; internal error details are never sent to
  the client (generic messages + server-side logs).

## Planned (Phase 03+)

- Better Auth: session cookies (httpOnly, secure, sameSite=lax), middleware
  gating all routes, **auth check inside every server action** (defense in
  depth — middleware alone is not enough for actions).
- Sign-up disabled after the first account.
- Webhook endpoints authenticated by shared secret; integration tokens
  scoped read-only where the provider allows.

## Data

- Supabase RLS is not used — the app connects as a single role and Better Auth
  gates access at the application layer. Revisit if the database is ever
  shared with other clients.
- Backups: Supabase automated backups; add `pg_dump` export before v1
  (see [release-v1.md](../roadmap/release-v1.md)).
