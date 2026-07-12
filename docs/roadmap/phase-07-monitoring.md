# Phase 07 — Monitoring

**Status:** ✅ Done (2026-07-12) — live Kuma verification pending owner instance · Diagram: [diagrams/monitoring-flow.md](../diagrams/monitoring-flow.md)

## Goal

Production health visible inside Personal OS: uptime, incidents, and links to
the deployments that caused or fixed them.

## Scope

1. Models: `Monitor` (what is watched, per project/environment) and `Incident`
   (start, end, severity, cause, linked deployment/fix)
2. Uptime Kuma integration: pull monitor status via its API/status page
3. Dashboard "System Health" card: up/down counts, active incidents
4. Incident timeline on the project page; manual incident create/close
5. ~~Optional: Prometheus metrics~~ — skipped (documented deviation; revisit with a real Prometheus instance)

## Out of scope

- Alerting/paging (Uptime Kuma already notifies), log aggregation, APM

## Acceptance criteria

- [x] Monitor sync pulls the Kuma public status page (UPTIME_KUMA_URL + UPTIME_KUMA_STATUS_SLUG); manual Sync button, graceful error when unconfigured
- [x] Incidents store monitor/project/deployment links; monitoring page lists them with severity + resolve; schema ready for project timeline
- [x] Dashboard System Health card: up/down/unknown counts + active incidents from the DB
