# Deployment Flow (planned — Phase 06)

Two flows: deploying Personal OS itself, and recording deployments of any
tracked project.

## Deploying Personal OS

```mermaid
flowchart TD
    C[git push master] --> CO[Coolify]
    CO --> BI["Build Docker image<br/>(standalone Next.js build,<br/>prisma generate via postinstall)"]
    BI --> MG["Release command:<br/>prisma migrate deploy"]
    MG --> SB[("Supabase")]
    MG --> RUN["Start container<br/>healthcheck /"]
    RUN --> LIVE[Traefik routes traffic]
    RUN -->|webhook| POS["Personal OS<br/>/api/webhooks/coolify"]
    POS --> DEP["Deployment row created<br/>(version, commit, env, success)"]
```

## Recording any project's deployment

```mermaid
flowchart LR
    subgraph sources [Sources]
        M["Manual form<br/>'Record deployment'"]
        W["Coolify webhook"]
    end
    M --> A[deployment action]
    W --> V["verify shared secret"] --> A
    A --> DB[("deployments table")]
    DB --> T["Project timeline"]
    DB --> D["Dashboard · Recent Deployments"]
    DB -.->|"rolledBack=true links to reverted deploy"| DB
```

## Rollback rules

- Coolify redeploys the previous image; migrations are forward-only
  (expand → migrate → contract for destructive changes).
- A rollback is recorded as its own Deployment row referencing the one it reverts —
  history is append-only.
