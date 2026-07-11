# v2 Vision — Personal Operational System

**Status:** 📋 Planned — starts after the current v1 phases are stable
**Owner note:** captured 2026-07-11 from Rino's brief; this document turns the
brain-dump into an executable plan. Nothing here starts before the active
phase is done.

## From v1 to v2

v1 is a **Personal Engineering OS**: projects, tasks, ClickUp, journal,
habits. v2 grows it into a **Personal Operational System** — one place that
runs the whole day (work, business, health, career growth) and uses agents to
think alongside you. Same product, bigger loop: *observe → suggest → act*.

## Navigation becomes category-first

```
Global (Dashboard)
├── Today        — timeline, meetings, prospects
├── Business     — pipeline, market, targeting, meetings
├── Personal     — health, decisions, what-next, CV practice
└── Explore      — automations lab (ClickUp, LinkedIn, affiliate, CV)
```

## Module map

### Global — weekly self review
- Dashboard shows the **last 7 days of personal performance**: activity
  minutes, tasks closed vs planned, habit streaks, journal mood, meeting
  load — trend charts (Recharts, palette greens).
- An **AI review block**: generated summary of what went well and *what to
  improve next week*, produced from the week's data (first via manual
  "Generate review" → later scheduled). Data model: `WeeklyReview` (period,
  metrics snapshot JSON, aiSummary, aiSuggestions[]).

### Today
- **Timeline**: unified feed for the day — activities, tasks due, synced
  ClickUp tickets, calendar events.
- **Important meetings**: Google Calendar + Meet + Gmail integration (OAuth;
  read calendar events, surface meeting links, flag important invites from
  Gmail). Model: `CalendarEvent` with external ids, `source` enum.
- **Prospect**: job/network opportunities inbox — suggestions from LinkedIn /
  job portals land here; one click attaches the polished CV and tracks the
  application (`Opportunity`: source, company, role, status, appliedAt,
  cvVersionId).

### Business
- **Pipeline**: deals/leads kanban (`Lead`: stage, value, nextAction, contact).
- **Market**: notes + saved research per segment (reuses documentation module).
- **Targeting**: quarterly targets with progress tracking (`Target`: metric,
  goal, current, deadline) — feeds the Global dashboard.
- **Meeting**: business meeting log linked to leads (reuses CalendarEvent +
  notes).

### Personal
- **Health**: extends habits — sleep, water, workout metrics + weekly trend.
- **Decisions**: personal decision log (context, options, choice, review date)
  — the ADR pattern applied to life.
- **What next**: a ranked "explore next" list the AI keeps fresh from journal
  + activity signals.
- **SubAgent**: UI to define scoped agent jobs (see Hermes below).
- **CV practice**: CV versions storage (Supabase Storage), tailored variants
  per application, AI review feedback loop.

### Explore — automations lab
Each automation is a **worker job with an audit trail**, never a silent bot:
- **ClickUp automation**: scheduled sync + rules ("when ticket moves to X,
  create activity/note").
- **LinkedIn automation**: ⚠️ LinkedIn's public API is closed for this use —
  plan around it: manual-assist flows (bookmarklet/manual import + AI matching
  against my profile) instead of scraping. Revisit if API access changes.
- **Affiliate automation** (TikTok / Threads / Shopee): content calendar +
  performance tracking first (manual metric entry or CSV import); direct API
  posting only where an official API exists and is approved.
- **CV automation**: JD in → tailored CV draft out (AI), human approves.

## Hermes orchestration (agent connection)

Goal: **Hermes thinks about improvements, Personal OS is its workspace, and
Claude Code executes directed work.**

Design (Agent API):
1. `POST /api/agent/*` endpoints secured by **scoped API keys** (per-agent,
   revocable, rate-limited) — separate from user session auth.
2. **Read scope**: Hermes pulls dashboard metrics, timelines, reviews.
3. **Suggest scope**: Hermes writes into a `Suggestion` inbox (menu, title,
   rationale, proposed action). Nothing executes without approval.
4. **Execute scope**: an approved suggestion can carry a prepared instruction
   payload; Hermes launches **Claude Code** (headless `claude -p` or Agent
   SDK) with that instruction against this repo, and reports the run back
   (`AgentRun`: status, log, commit).
5. Every agent action lands in an **audit log** — who/what/when/why.

Start point: schema (`AgentKey`, `Suggestion`, `AgentRun`) + read/suggest
endpoints + Suggestions inbox UI. Execution wiring comes last.

## Could this serve a company?

Yes — the relational core (Workspace → Client → Project → Task) was designed
for it. What it takes, honestly:

| Concern | Today (v1) | Company-ready |
|---|---|---|
| Tenancy | single owner, sign-up locked | Organizations + memberships (Better Auth org plugin) |
| Authorization | authenticated = full access | RBAC per workspace (owner/admin/member/viewer) |
| Data scoping | global queries | every query scoped by org id (repository-layer enforcement) |
| Audit | git history only | audit log table (shared with Agent API) |
| Billing | n/a | per-org plans (later, if ever commercialized) |

**Decision: stay single-tenant through v2.** Multi-tenancy doubles the surface
of every feature; retrofit it as **v3** once v2 proves which modules matter.
Design rule starting now: repositories keep all queries behind one layer, so
adding org scoping later is one refactor, not fifty.

## Web + mobile architecture

**Recommendation: no microservices yet.** For a single-developer product,
microservices multiply deploys, auth, and failure modes without benefit
(CLAUDE.md rule: never overengineer). Instead — **modular monolith with a
contract-first API edge**, which delivers the same mobile outcome:

1. Extract a **versioned API layer** (`/api/v1/*`) over the existing
   repositories, sharing the Zod schemas as the contract.
2. **Mobile app: Expo (React Native)** — one TypeScript codebase → Android +
   iOS, consuming `/api/v1` with Better Auth bearer sessions. Monorepo later
   (`apps/web`, `apps/mobile`, `packages/contracts`).
3. The **one justified service split**: an automation **worker** (queue +
   scheduled jobs for syncs/agents) — because long-running jobs don't belong
   in request handlers. Everything else stays in the monolith until a real
   scaling boundary appears.

## Execution order (after current v1 work)

| Stage | Scope | Depends on |
|---|---|---|
| v2.1 | Global 7-day review dashboard (charts + manual AI review) | v1 reports groundwork |
| v2.2 | Today: timeline + Google Calendar/Meet/Gmail (OAuth) | — |
| v2.3 | Business: pipeline, targets | — |
| v2.4 | Personal: health, decisions, CV versions | — |
| v2.5 | Agent API + Suggestion inbox (Hermes read/suggest) | v2.1 |
| v2.6 | Explore: automation worker + ClickUp rules | v2.5 |
| v2.7 | Prospect + CV automation (manual-assist LinkedIn) | v2.4 |
| v2.8 | API v1 edge + Expo mobile app (Android/iOS) | v2.1–v2.4 stable |
| v2.9 | Hermes execute scope → runs directed Claude Code | v2.5, audit log |
| v3   | Multi-tenant / company mode | v2 proven |

## Ground rules carried over

- One phase at a time, docs updated in the same commit, ADR for every
  irreversible choice (Agent API security and mobile stack each get an ADR
  before code).
- External integrations start read-only, store external ids, never duplicate
  remote data — the ClickUp pattern is the template.
