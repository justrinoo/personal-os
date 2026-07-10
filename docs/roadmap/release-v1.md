# Release v1 — "Daily Driver"

**Status:** Gate (not yet scheduled)

v1 is the point where Personal OS replaces my scattered tracking for daily
work. It does **not** require every phase — it requires the daily loop.

## Required phases

- [x] Phase 01 — Foundation
- [x] Phase 02 — Core CRUD
- [ ] Phase 03 — Authentication
- [ ] Phase 06 — Deployment (Personal OS itself running in production)
- [ ] Phase 08 — Journal+
- [ ] Phase 09 — Habits+
- [ ] Phase 11 — Reports (weekly report minimum)

ClickUp (04), GitHub (05), Monitoring (07), Learning (10), and AI (12) are
v1.x/v2 — valuable, but not required for the daily loop.

## Release checklist

- [ ] Running on Coolify over HTTPS behind Better Auth
- [ ] Database backups scheduled (Supabase PITR or pg_dump cron)
- [ ] `prisma migrate deploy` wired into the release process
- [ ] Error tracking minimally in place (server logs reviewed)
- [ ] 14 consecutive days of real personal usage without a blocking bug
- [ ] Tag `v1.0.0`, changelog written
