# ADR-003 — ClickUp sync: external IDs, read-first, idempotent

**Status:** Proposed (target Phase 04)

## Context

Work tasks live in ClickUp (office requirement). Personal OS must show them in
project context without becoming a divergent copy of ClickUp, and without a
fragile bidirectional sync as the first step.

## Decision

1. **ClickUp stays the system of record** for tickets. Personal OS stores the
   `clickupId` (unique) plus only render-needed fields (title, status,
   priority, url, remote `updatedAt`).
2. **Read-only sync first**, manually triggered per project ("Sync now"),
   upserting by `clickupId` — re-sync is always idempotent.
3. Status/priority mapping lives in a config table (remote statuses are
   list-specific and user-defined), not in code.
4. Two-way updates (push local status changes) and webhooks come **after** the
   read path is proven in daily use.

## Alternatives considered

- **Full mirror (all fields, comments, attachments)** — maximum offline
  fidelity, but heavy sync surface and guaranteed drift; the ClickUp UI is one
  click away via the stored URL.
- **Webhooks first** — real-time, but requires a publicly reachable deployment
  (Phase 06) and hides sync-logic bugs that a manual button exposes early.
- **iframe/embed** — no data ownership, nothing to link reports against.

## Consequences

- ✅ No duplicate data (root CLAUDE.md rule); deletion/archival upstream just
  marks the local link stale rather than cascading destruction.
- ✅ The same pattern (external ID + minimal fields + idempotent upsert)
  becomes the template for GitHub and every later integration.
- ⚠️ Data is only as fresh as the last sync — show `syncedAt` prominently.
