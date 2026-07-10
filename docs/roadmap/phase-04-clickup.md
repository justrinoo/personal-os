# Phase 04 — ClickUp Integration

**Status:** Planned · Design: [decisions/adr-003-clickup-sync.md](../decisions/adr-003-clickup-sync.md), [diagrams/clickup-sync.md](../diagrams/clickup-sync.md)

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

- [ ] Sync pulls my ClickUp tasks into linked projects idempotently (re-sync creates no duplicates)
- [ ] `clickupId` uniqueness enforced; remote fields stored minimally (title, status, priority, url, updatedAt)
- [ ] Sync failures surface in UI without breaking pages
