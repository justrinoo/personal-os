# Phase 09 — Habits+

**Status:** ✅ Done (2026-07-12)

## Goal

Make habit tracking sticky: streaks, history, and honest statistics.

## Scope

1. Streak tracking: current and best streak per habit
2. Habit history view: month grid per habit (GitHub-contribution style)
3. Backfill: mark past days done/missed, not just today
4. Weekly target evaluation: met/missed per ISO week against `targetDays`
5. Archive habits (`isActive` exists) with an archived section
6. Dashboard habit strip: today's habits as one-tap toggles

## Out of scope

- Reminders/notifications (needs a delivery channel — revisit with Telegram integration)
- Habit analytics beyond streaks (Phase 11 reports)

## Acceptance criteria

- [x] Current + best streaks via shared utils/streak (day-string based, gap-safe)
- [x] 12-week contribution grid, click any past cell to toggle; day-range lookup keeps one log per day; future days rejected
- [x] TodayHabits pill strip on the dashboard (one-tap toggle, server action + revalidate)
