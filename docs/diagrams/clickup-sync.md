# ClickUp Sync Flow (planned — Phase 04)

Design per [ADR-003](../decisions/adr-003-clickup-sync.md): read-only first,
idempotent upsert by `clickupId`, manual trigger.

## Stage 1 — manual read-only sync

```mermaid
sequenceDiagram
    participant U as User
    participant P as Project page
    participant A as syncClickUpAction
    participant S as clickup.service
    participant CU as ClickUp API
    participant DB as Supabase

    U->>P: click "Sync now"
    P->>A: projectId
    A->>DB: load mapping (list ids, status map, syncedAt)
    A->>S: fetchTasks(listIds, updated_since: syncedAt)
    S->>CU: GET /list/{id}/task (token from env)
    CU-->>S: tasks JSON
    S->>S: map remote status/priority → local enums
    loop each remote task
        A->>DB: upsert Task by clickupId
    end
    A->>DB: update syncedAt
    A-->>P: ActionResult + revalidatePath
    P-->>U: toast "Synced N tasks" · staleness badge updates
```

## Stage 2 — webhooks (after Stage 1 proven + app deployed)

```mermaid
flowchart LR
    CU[ClickUp] -->|taskUpdated event| WH["/api/webhooks/clickup<br/>verify signature"]
    WH --> S["clickup.service<br/>map + upsert by clickupId"]
    S --> DB[("Supabase")]
    WH -->|200| CU
```

## Rules

- Upsert only — a re-sync of unchanged data is a no-op.
- Remote deletions mark the local link stale (badge), never cascade-delete local work.
- Sync failures toast + log; pages keep rendering last-synced data with `syncedAt` shown.
