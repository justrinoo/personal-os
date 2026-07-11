# Phase 04 — ClickUp Integration

**Status:** ✅ Stage 1 shipped (2026-07-11) — read-only sync built; live verification pending a real `CLICKUP_TOKEN`
Design: [decisions/adr-003-clickup-sync.md](../decisions/adr-003-clickup-sync.md), [diagrams/clickup-sync.md](../diagrams/clickup-sync.md)

## Goal

Tasks I manage in ClickUp appear in Personal OS, linked to my projects,
without duplicating ClickUp as a system of record.

## Scope

1. **Read-only sync first**: personal API token in env; sync Spaces → Folders →
   Lists → Tasks into a mapping layer keyed by external IDs (`clickupId`)
2. Manual "Sync now" button per project + last-synced timestamp
3. Map ClickUp status/priority to local enums (config table, not hardcode)
4. Link a local Task to a ClickUp ticket (by ID) and show sync status
5. **Later in phase**: two-way status updates, then webhooks to replace polling

## Out of scope

- Comments, attachments, time tracking
- Creating ClickUp tasks from Personal OS (until two-way lands)

## Acceptance criteria

- [x] Idempotent sync implemented: upsert by unique `clickupId`; re-sync of unchanged data is a no-op
- [x] Remote fields stored minimally (title, description, status, priority, url, dueDate, remote updatedAt)
- [x] Failures surface as toasts with specific messages (no token / 401 / 404 / 429) — pages never break
- [ ] Verified against a live ClickUp workspace (needs `CLICKUP_TOKEN` in `.env` — see "How to use")

## How to use

1. ClickUp → Settings → Apps → copy your personal API token → set `CLICKUP_TOKEN` in `.env`
2. **Zero-config path:** Projects or ClickUp page → **Import my ClickUp tickets** —
   finds every ticket assigned to you across all teams, auto-creates one project per
   list (inside the auto-created "ClickUp" workspace), and syncs everything
3. Manual path: Projects page → **Link** in the ClickUp column → paste a ticket ID,
   ticket URL, or list ID → sync icon. Unknown remote statuses get a guessed mapping
   saved to `clickup_status_map` (edit that table to correct them)

## Implementation notes

- `services/clickup.service.ts`: typed API client (list fetch, task pagination,
  priority map, status heuristic). `repositories/clickup.repository.ts`: link/unlink,
  self-populating status map, remote-fields-only upsert (local task `type` untouched).
- **Sync scope: only tickets assigned to the token owner** (`assignees[]` filter,
  owner id resolved live from `/user`). Sync mirrors that set — synced tickets that
  are deleted remotely or de-assigned are removed locally; manually created local
  tasks (`clickupId` null) are never touched.
- Migration `20260711090743_clickup`: link fields on projects, `clickupUrl` +
  `clickupRemoteUpdatedAt` on tasks, `clickup_status_map` table.
- Stage 2 (two-way updates, webhooks) remains open per ADR-003.
