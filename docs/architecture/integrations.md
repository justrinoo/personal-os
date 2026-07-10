# Integrations

External systems connect through one consistent pattern. Planned order:
ClickUp (Phase 04), GitHub (05), Coolify webhook (06), Uptime Kuma (07),
Anthropic (12). Future candidates: Slack/Discord/Telegram, Google Calendar, n8n.

## The external-ID pattern

For every remote object we care about:

1. Store the **remote ID** (`clickupId`, commit `sha`, PR `number`) with a
   unique constraint.
2. Store only the fields the UI renders (title, status, url, timestamps) —
   the remote system stays the source of record for everything else.
3. Sync is **idempotent upsert by external ID** — re-running a sync never
   duplicates.
4. Keep a `syncedAt` timestamp; show staleness in the UI instead of hiding it.

## Sync strategy

- Start **read-only + manual trigger** ("Sync now") — simplest to reason about,
  no webhook infrastructure needed.
- Graduate to scheduled polling, then webhooks, only when the manual flow is
  proven (see [adr-003-clickup-sync.md](../decisions/adr-003-clickup-sync.md)).
- Sync code lives in `services/<provider>.service.ts` (API client + mapping)
  called from server actions; never from components.

## Secrets

- Tokens live in `.env` (`CLICKUP_TOKEN`, `GITHUB_TOKEN`, `ANTHROPIC_API_KEY`)
  and are read server-side only — never in client components, never logged.
- Webhook endpoints (`app/api/webhooks/*`) verify a shared secret before
  touching the database.

## Failure rules

- A failing integration must never break a page: sync errors surface as UI
  banners/toasts and log server-side.
- Rate limits respected per provider (conditional requests for GitHub,
  backoff on 429).
