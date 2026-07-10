# Phase 11 — Reports

**Status:** Planned

## Goal

Turn accumulated data into insight: daily, weekly, monthly, and yearly reports
with charts and summaries.

## Scope

1. Report pages with Recharts: activity time by category/project, task
   throughput and cycle time, habit consistency, journal streaks, mood and
   productivity trends
2. Time ranges: day, ISO week, month, year, custom
3. Productivity metrics: focused minutes/day, tasks done/week, deploys/month
4. Export: print-friendly view first; PDF later if needed
5. Dashboard "Productivity Metrics" card fed by the same aggregation services

## Out of scope

- Scheduled report emails (needs delivery channel), AI narrative summaries (Phase 12)

## Acceptance criteria

- [ ] Aggregations computed in repositories/services (SQL), not in components
- [ ] Weekly report renders under 500 ms with a year of data
- [ ] Charts follow the dataviz conventions in [architecture/ui-system.md](../architecture/ui-system.md)
