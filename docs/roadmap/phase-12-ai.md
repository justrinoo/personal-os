# Phase 12 — AI

**Status:** Planned · Decision: [decisions/adr-005-ai-first.md](../decisions/adr-005-ai-first.md)

## Goal

An AI layer over my own data: summaries, insights, and planning assistance —
grounded in what Personal OS already knows.

## Scope

1. Anthropic API integration (server-side only; key in env)
2. **Daily digest**: generate the night journal draft from the day's
   activities, completed tasks, and commits
3. **Weekly insight**: narrative summary of the week's report data
4. **Planning assistant**: suggest tomorrow's focus from open tasks,
   due dates, and sprint state
5. All generations stored with their inputs (auditable, regenerable)

## Out of scope

- Chat interface over the whole database (start with fixed, high-value generations)
- Local models

## Acceptance criteria

- [ ] Digest generation uses only my data, runs on demand, and is editable before saving
- [ ] Token usage logged per generation
- [ ] Graceful degradation when the API is unavailable
