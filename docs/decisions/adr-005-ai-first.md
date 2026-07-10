# ADR-005 — AI-first development and product

**Status:** Accepted (2026-07-10)

## Context

Personal OS is built primarily through AI-assisted sessions (Claude Code) and
will eventually ship AI features over its own data (Phase 12). Both need
deliberate structure: AI development quality depends on repo legibility, and
AI product features depend on clean, connected data.

## Decision

1. **AI-assisted development is the default workflow.** The repo is optimized
   for it: root CLAUDE.md (vision + rules), docs/CLAUDE.md (working
   agreement), phase files scoping each session, ADRs recording decisions so
   sessions don't relitigate them, and small predictable files (ADR-004).
2. **Documentation is part of the definition of done** — an AI session without
   updated docs loses its context value for the next session.
3. **AI product features (Phase 12) are grounded generations over local
   data** (digest, insights, planning) — stored with their inputs, editable by
   the user, server-side Anthropic API only. No autonomous writes to my data.

## Alternatives considered

- **Ad-hoc AI usage without repo conventions** — works early, degrades fast:
  each session re-derives context, contradicts earlier decisions, duplicates patterns.
- **AI-free development** — slower for a solo project and contradicts the
  point of building a personal engineering OS in 2026.

## Consequences

- ✅ Session continuity: any AI (or future me) can resume from docs + ADRs.
- ✅ Phase 12 needs no data re-architecture — the connected schema is the RAG corpus.
- ⚠️ Docs drift is the failure mode — the same-commit doc rule
  (docs/CLAUDE.md) exists to prevent it.
