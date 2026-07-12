# Phase 06 — Deployment Tracking

**Status:** ✅ Done (2026-07-11) — production deploy itself pending owner Coolify setup
Diagram: [diagrams/deployment-flow.md](../diagrams/deployment-flow.md)

## Goal

Every deployment of every project is recorded: what version, which commit,
which environment, did it succeed, was it rolled back.

The `Deployment` model already exists from Phase 01.

## Scope

1. Deployments page: timeline per project and global recent list on the dashboard
2. Manual "record deployment" form (version, environment, commit, notes, success)
3. Coolify webhook endpoint (`/api/webhooks/coolify`) creating deployment rows automatically
4. Rollback marking: link a rollback deployment to the one it reverts
5. Also in this phase: deploy Personal OS itself via Docker + Coolify
   (see [architecture/deployment.md](../architecture/deployment.md))

## Out of scope

- Triggering deployments from Personal OS (record, don't orchestrate)

## Acceptance criteria

- [x] Recorded deployments render on the project detail page and the
  dashboard "Recent Deployments" card
- [x] Coolify webhook creates rows: `POST /api/webhooks/coolify?projectId=..&environment=..`
  with `X-Webhook-Secret: $COOLIFY_WEBHOOK_SECRET`; lenient payload parsing
  (`commit`/`sha`, `status`, `version`, `message`)
- [ ] Personal OS in production: Dockerfile (standalone output, `prisma
  migrate deploy` on boot) + .dockerignore are ready — the actual Coolify
  deploy needs the owner's server (set env vars from .env.example there)
