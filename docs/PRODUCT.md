# Product

Personal OS is a self-hosted web application for one user (me) that manages
engineering work and personal productivity in a single connected system.

## Modules

| Module | Status | Description |
|---|---|---|
| Dashboard | ✅ Live | Daily overview: active projects, open tasks, today's activity, habits |
| Workspaces | ✅ Live | Work environments: Office, Freelance, Personal, Open Source |
| Clients | 🔲 Model only | Clients inside a workspace, owning projects |
| Projects | ✅ Live | Software projects with status, repository, and relations |
| Sprints | 🔲 Model only | Time-boxed iterations inside a project |
| Features | 🔲 Model only | Deliverable feature units linking sprints, tasks, deployments |
| Tasks | ✅ Live | Development work: type, status, priority, due date, ClickUp ID |
| Daily Activities | ✅ Live | Everything I do: coding, meetings, learning, workout, with mood/productivity |
| ClickUp Sync | 🔜 Phase 4 | Two-way ticket synchronization |
| Git Integration | 🔜 Phase 5 | Repos, branches, commits, PRs |
| Deployments | 🔜 Phase 6 | Deployment history per environment with rollback tracking |
| Monitoring | 🔜 Phase 7 | Server/API/uptime signals and incidents |
| Journal | ✅ Live (basic) | Morning goals/focus, night reflection/wins/problems/lessons |
| Habits | ✅ Live (basic) | Daily habits with weekly consistency and today-toggle |
| Documentation | 🔜 Later | Markdown knowledge base inside the app |
| Learning | 🔜 Phase 10 | Courses, books, videos, certifications |
| Reports | 🔜 Phase 11 | Daily/weekly/monthly/yearly reports with charts |
| AI | 🔜 Phase 12 | Summaries and insights over my own data |

## Behavior rules

- Every entity is reachable from the dashboard within two clicks.
- Deleting a parent cascades (workspace → projects → tasks); the UI warns explicitly.
- External systems are referenced by stored IDs — remote data is never duplicated.
- The UI renders (with empty states and an offline banner) even when the database is unreachable.

## Non-goals

- Multi-tenant SaaS. This is a personal tool; auth exists to protect a deployment, not to serve users.
- Replacing ClickUp/GitHub UIs. Personal OS aggregates and links; deep work happens in the source tools.
