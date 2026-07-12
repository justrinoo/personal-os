# Phase 11 — Reports

**Status:** ✅ Done (2026-07-12)

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

- [x] All aggregations in services/report.service.ts (raw SQL date_trunc buckets + Prisma groupBy/counts)
- [x] Bounded queries (grouped buckets only, no row scans in JS); day/week/month/year ranges via URL param
- [x] Recharts with --chart-1..5 tokens, popover-styled tooltips, soft grid; print stylesheet + Print button. Deviation: custom date range + PDF export deferred
