# Roadmap

One phase at a time; a phase is done when its acceptance criteria pass and the
work is committed. Details per phase live in [roadmap/](./roadmap/).

| Phase | Name | Status | Delivered |
|---|---|---|---|
| 01 | [Foundation](./roadmap/phase-01-foundation.md) | ✅ Done | 2026-07-10 |
| 02 | [Core CRUD](./roadmap/phase-02-core-crud.md) | ✅ Done | 2026-07-10 |
| 03 | [Authentication](./roadmap/phase-03-auth.md) | 🔜 Next | — |
| 04 | [ClickUp Integration](./roadmap/phase-04-clickup.md) | Planned | — |
| 05 | [GitHub Integration](./roadmap/phase-05-github.md) | Planned | — |
| 06 | [Deployment Tracking](./roadmap/phase-06-deployment.md) | Planned | — |
| 07 | [Monitoring](./roadmap/phase-07-monitoring.md) | Planned | — |
| 08 | [Journal+](./roadmap/phase-08-journal.md) | Planned | — |
| 09 | [Habits+](./roadmap/phase-09-habit.md) | Planned | — |
| 10 | [Learning](./roadmap/phase-10-learning.md) | Planned | — |
| 11 | [Reports](./roadmap/phase-11-reports.md) | Planned | — |
| 12 | [AI](./roadmap/phase-12-ai.md) | Planned | — |
| — | [Release v1](./roadmap/release-v1.md) | Gate | — |

## Sequencing rationale

- **Auth (03) before integrations** — API tokens and webhooks must not land in an unprotected app.
- **ClickUp (04) and GitHub (05) before deployment/monitoring** — they populate the entities the later phases link to.
- **Reports (11) near the end** — reports are only as good as the data the earlier phases accumulate.
- **AI (12) last** — it consumes everything else.
