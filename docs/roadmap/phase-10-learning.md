# Phase 10 — Learning

**Status:** ✅ Done (2026-07-12)

## Goal

Track everything I learn — courses, books, videos, technologies,
certifications — with progress and links back to projects that use them.

## Scope

1. Model `LearningItem` shipped; **deviation:** `Technology` model skipped (no UI consumer yet — revisit when a skills matrix view exists)
2. Learning page: in-progress shelf, backlog, finished archive
3. Link learning items to projects and to daily activities (a LEARNING
   activity can reference the item)
4. Certifications with issuer, date, expiry, credential url

## Out of scope

- Spaced repetition / flashcards, note-taking (Documentation module later)

## Acceptance criteria

- [x] LearningItem CRUD (type/status/progress/dates/notes + certification issuer/credential/expiry); FINISHED forces progress 100
- [x] LEARNING activities link to an item (activity form select); cards show time invested (sum of linked durations)
- [x] Dashboard "Learning now" card with progress bars
