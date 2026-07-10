# Phase 07 — Monitoring

**Status:** Planned · Diagram: [diagrams/monitoring-flow.md](../diagrams/monitoring-flow.md)

## Goal

Production health visible inside Personal OS: uptime, incidents, and links to
the deployments that caused or fixed them.

## Scope

1. Models: `Monitor` (what is watched, per project/environment) and `Incident`
   (start, end, severity, cause, linked deployment/fix)
2. Uptime Kuma integration: pull monitor status via its API/status page
3. Dashboard "System Health" card: up/down counts, active incidents
4. Incident timeline on the project page; manual incident create/close
5. Optional: Prometheus metrics pull for CPU/memory summary cards

## Out of scope

- Alerting/paging (Uptime Kuma already notifies), log aggregation, APM

## Acceptance criteria

- [ ] Monitor status reflects Uptime Kuma within one sync interval
- [ ] Incidents link to deployments and appear on the project timeline
- [ ] Dashboard health card shows real data
