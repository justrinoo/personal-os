# ADR-001 — PostgreSQL on Supabase

**Status:** Accepted (2026-07-10)

## Context

Personal OS needs a relational store for a deeply connected schema
(workspace → … → task chains, cascading deletes, enums) that will later feed
reports and integrations. Development happens on a Windows laptop; a local
PostgreSQL existed but with lost credentials, and the app should be usable
from a future deployment anyway.

## Decision

PostgreSQL as the engine, **hosted on Supabase** (free tier, `ap-northeast-1`),
connected through the **session pooler** (port 5432 — IPv4-compatible and
supports the prepared statements Prisma uses).

## Alternatives considered

- **Local PostgreSQL** — zero latency, but ties data to one machine, no access
  from a deployed instance, and credential/ops friction already bit us.
- **SQLite** — simplest, but weak enum support, no hosted story for the
  deployment target, and Supabase Storage is already in the stack.
- **Neon** — equivalent serverless Postgres; Supabase won because the stack
  already plans Supabase Storage (one provider, one dashboard).

## Consequences

- ✅ Same database from dev and future production; automated backups; Table Editor UI.
- ✅ Prisma migrations work unchanged (`migrate dev` from the laptop).
- ⚠️ ~100–200 ms query latency from Indonesia to Tokyo — acceptable for a
  personal dashboard; mitigate with `Promise.all` batching (already the pattern).
- ⚠️ Free-tier pausing after inactivity — first request after idle is slow;
  revisit if it becomes annoying.
- Transaction pooler (6543) must not be used without `?pgbouncer=true`.
