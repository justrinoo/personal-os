# Roadmap

One phase at a time; a phase is done when its acceptance criteria pass and the
work is committed. Details per phase live in [roadmap/](./roadmap/).

| Phase | Name | Status | Delivered |
|---|---|---|---|
| 01 | [Foundation](./roadmap/phase-01-foundation.md) | ✅ Done | 2026-07-10 |
| 02 | [Core CRUD](./roadmap/phase-02-core-crud.md) | ✅ Done | 2026-07-10 |
| 03 | [Authentication](./roadmap/phase-03-auth.md) | ✅ Done | 2026-07-10 |
| 04 | [ClickUp Integration](./roadmap/phase-04-clickup.md) | ✅ Stage 1 | 2026-07-11 |
| 05 | [GitHub Integration](./roadmap/phase-05-github.md) | ✅ Done | 2026-07-11 |
| 06 | [Deployment Tracking](./roadmap/phase-06-deployment.md) | ✅ Done | 2026-07-11 |
| 07 | [Monitoring](./roadmap/phase-07-monitoring.md) | ✅ Done | 2026-07-12 |
| 08 | [Journal+](./roadmap/phase-08-journal.md) | ✅ Done | 2026-07-12 |
| 09 | [Habits+](./roadmap/phase-09-habit.md) | ✅ Done | 2026-07-12 |
| 10 | [Learning](./roadmap/phase-10-learning.md) | ✅ Done | 2026-07-12 |
| 11 | [Reports](./roadmap/phase-11-reports.md) | ✅ Done | 2026-07-12 |
| 12 | [AI](./roadmap/phase-12-ai.md) | 🔜 Next | — |
| — | [Release v1](./roadmap/release-v1.md) | Gate | — |

## After v1

| Version | Plan | Status |
|---|---|---|
| v2 | [Personal Operational System](./roadmap/v2-personal-operational-system.md) — category-first navigation (Today/Business/Personal/Explore), 7-day AI self-review, Google/LinkedIn/affiliate integrations, Hermes agent orchestration, Expo mobile app | 📋 Planned |
| v3 | Multi-tenant company mode (organizations, RBAC, audit) | 💭 Idea |

## Sequencing rationale

- **Auth (03) before integrations** — API tokens and webhooks must not land in an unprotected app.
- **ClickUp (04) and GitHub (05) before deployment/monitoring** — they populate the entities the later phases link to.
- **Reports (11) near the end** — reports are only as good as the data the earlier phases accumulate.
- **AI (12) last** — it consumes everything else.
