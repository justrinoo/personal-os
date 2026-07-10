# Phase 05 — GitHub Integration

**Status:** Planned

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

- [ ] A linked project lists its recent commits and open PRs
- [ ] Re-sync is idempotent (upsert by sha/number)
- [ ] Rate-limit friendly: cached responses, conditional requests (ETag)
