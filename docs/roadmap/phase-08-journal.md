# Phase 08 — Journal+

**Status:** ✅ Done (2026-07-12)

## Goal

Turn the basic journal into a durable daily practice with structure, streaks,
and review.

## Scope

1. **One entry pair per day** enforced (morning + night), with "today" quick
   actions on the dashboard
2. Edit existing entries (currently create/delete only)
3. Journal calendar view: month grid showing which days have entries
4. Streak counter and completion stats
5. Weekly review view: aggregate the week's wins/problems/lessons
6. Markdown rendering in entry fields

## Out of scope

- AI-generated summaries (Phase 12), mood analytics (Phase 11 reports)

## Acceptance criteria

- [x] @@unique([date,type]) + upsert — same-day same-type saves update in place
- [x] Month calendar with morning/night dots + prev/next; dates stored day-only from the date input, streaks computed on day strings
- [x] Current ISO week wins/problems/lessons aggregated on the journal page
