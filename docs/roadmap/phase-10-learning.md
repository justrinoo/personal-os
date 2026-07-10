# Phase 10 — Learning

**Status:** Planned

## Goal

Track everything I learn — courses, books, videos, technologies,
certifications — with progress and links back to projects that use them.

## Scope

1. Models: `LearningItem` (type, title, source url, status, progress %,
   started/finished dates) and `Technology` (name, category, proficiency)
2. Learning page: in-progress shelf, backlog, finished archive
3. Link learning items to projects and to daily activities (a LEARNING
   activity can reference the item)
4. Certifications with issuer, date, expiry, credential url

## Out of scope

- Spaced repetition / flashcards, note-taking (Documentation module later)

## Acceptance criteria

- [ ] Learning items CRUD with progress updates
- [ ] LEARNING activities can link to an item; item page shows time invested
      (sum of linked activity durations)
- [ ] Dashboard shows current in-progress items
