# Phase 05 — GitHub Integration

**Status:** ✅ Done (2026-07-11)

## Goal

Connect projects to their repositories so branches, commits, and pull requests
appear on the project timeline and can be linked to tasks.

## Scope

1. GitHub PAT (fine-grained, read-only) in env
2. Link a Project to a repository (owner/repo, already have `repositoryUrl`)
3. Models: `Repository`, `Branch`, `Commit`, `PullRequest` — external-ID keyed,
   storing only what the UI shows (sha, message, author, dates, state, url)
4. Project page tabs: recent commits, open PRs
5. Link a Task to a branch/PR by name convention (`task-<id>` or manual link)

## Out of scope

- Webhooks (poll on view/sync first), code browsing, reviews, checks/CI status

## Acceptance criteria

- [x] A linked project lists its recent commits and PRs (project detail page
  `/projects/[id]`, Commits / Pull Requests tabs)
- [x] Re-sync is idempotent (commits upsert by unique `sha`, PRs by
  `[repositoryId, number]`; PR state stays truthful via `state=all` fetch)
- [x] Rate-limit friendly: in-process ETag cache sends `If-None-Match`; 304s
  cost no GitHub quota. Works unauthenticated for public repos; `GITHUB_TOKEN`
  raises limits and unlocks private repos

## Implementation notes

- `services/github.service.ts` (typed client + `parseRepoReference` accepting
  owner/name, URLs, SSH remotes), `repositories/github.repository.ts`,
  `actions/github.actions.ts` (link/unlink/sync, auth-guarded).
- New project detail page with repo card: link form when unlinked; repo info +
  Sync + tabs when linked. Project names in the list now link to it.
- Task↔PR link: tasks expose a `gitBranch` field (task form); PRs whose head
  branch matches show the task as a gold chip.
- **Deviation from plan:** no `Branch` model — branch names live on PRs and
  tasks; a branch table added sync surface with no UI consumer. Revisit if a
  branches view is ever needed.
- Verified live against `justrinoo/personal-os` (repo/commits/pulls endpoints).
