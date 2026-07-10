# Phase 06 — Deployment Tracking

**Status:** Planned · Diagram: [diagrams/deployment-flow.md](../diagrams/deployment-flow.md)

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

- [ ] Recorded deployments render on project timeline and dashboard
- [ ] Coolify webhook creates rows with correct env/commit mapping
- [ ] Personal OS runs in production behind auth
