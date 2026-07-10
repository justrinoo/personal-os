# Monitoring Flow (planned — Phase 07)

Uptime Kuma is the watcher; Personal OS aggregates its signal into project
context and links incidents to deployments and fixes.

```mermaid
flowchart TD
    subgraph watched [Watched systems]
        API[Project APIs]
        WEB[Project sites]
        POS_APP[Personal OS itself]
    end

    UK[Uptime Kuma] -->|checks| watched
    UK -->|"status API / poll"| SYNC["monitoring.service<br/>(scheduled + on-view sync)"]
    SYNC --> MON[("monitors table<br/>status, latency, lastCheck")]

    MON --> HC["Dashboard · System Health card"]
    MON --> PP["Project page · Monitors tab"]

    MON -->|"down detected"| INC[("incidents table<br/>start, severity, cause")]
    INC --> TL["Project timeline"]
    INC -.->|"linked deployment (suspected cause)"| DEPL[("deployments")]
    INC -.->|"resolved by fix → linked task/deploy"| FIX["fix reference"]

    UK -->|"native notifications"| ALERT["Telegram/Email<br/>(Uptime Kuma's job, not ours)"]
```

## The incident chain

```
Monitoring detects ↓ → Incident opened → linked Deployment (cause?)
→ Fix task → fixing Deployment → Incident closed → visible in Reports
```

## Rules

- Personal OS **aggregates and links** — it never pages/alerts (Uptime Kuma does).
- Monitor sync failures degrade to "last known status + staleness", pages never break.
- Every incident closure requires a cause note — that text feeds Phase 12 AI summaries.
