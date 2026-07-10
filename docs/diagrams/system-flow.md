# System Flow

How a request moves through Personal OS today (Phases 01–02).

## Read path (page render)

```mermaid
flowchart LR
    B[Browser] -->|GET /tasks| P["app/tasks/page.tsx<br/>(Server Component, force-dynamic)"]
    P --> SQ["safeQuery()"]
    SQ --> R["task.repository"]
    R --> PR["Prisma Client<br/>(adapter-pg)"]
    PR --> DB[("Supabase<br/>PostgreSQL")]
    DB --> PR --> R --> SQ
    SQ -->|"ok:true + data"| P
    SQ -.->|"db unreachable → ok:false + fallback"| BN["DbOfflineBanner + empty states"]
    P -->|HTML stream| B
```

## Write path (mutation)

```mermaid
sequenceDiagram
    participant U as User
    participant D as FormDialog (client)
    participant A as Server Action
    participant Z as Zod schema
    participant R as Repository
    participant DB as Supabase

    U->>D: fill form, submit
    D->>Z: client-side validate (zodResolver)
    Z-->>D: field errors (stop) or pass
    D->>A: typed input
    A->>Z: re-validate on server
    A->>A: normalize ("" → null, string → Date)
    A->>R: create/update/delete
    R->>DB: SQL via Prisma
    DB-->>R: row
    A->>A: revalidatePath(affected routes)
    A-->>D: ActionResult { ok }
    D-->>U: toast + close dialog
    Note over U,DB: revalidated Server Components re-render with fresh data
```

## Future additions

- Phase 03 inserts an auth check at the top of every action and middleware in front of every page.
- Phases 04–07 add `services/<provider>.service.ts` between actions and external APIs
  (see [clickup-sync.md](./clickup-sync.md)) and webhook route handlers as inbound entry points.
