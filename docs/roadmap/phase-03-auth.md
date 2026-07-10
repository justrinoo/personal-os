# Phase 03 — Authentication

**Status:** ✅ Done (2026-07-10)

## Goal

Protect the app with Better Auth before it is deployed anywhere or holds API
tokens for external services.

## Scope

- Better Auth with email/password (single account: my own)
- `Session`/`User` tables via Better Auth's Prisma adapter
- Middleware guarding all app routes; `/login` page
- Sign-out in the sidebar footer
- Disable public sign-up after the first account exists

## Out of scope

- Multi-user roles/permissions — this is a single-user system
- OAuth providers (can be added later for convenience)

## Acceptance criteria

- [x] Unauthenticated requests to any page redirect to `/login` (middleware 307 + server-side check in `(app)` layout)
- [x] Server actions reject unauthenticated calls (guard in all 20 actions; verified no row created)
- [x] Session cookie (httpOnly, sameSite=lax, 7 days); sign-out in sidebar footer
- [x] Sign-up returns 403 after first user (databaseHooks user.create.before)

## Implementation notes

- Better Auth 1.6 + Prisma adapter; auth tables in migration `20260710154959_auth`.
- Routes restructured: protected pages live in the `app/(app)` group whose
  layout validates the session server-side; `/login` is a bare route with a
  Sign in / First-time setup tabbed form.
- `middleware.ts` does an optimistic cookie check only — real validation is
  `getSession()` (lib/require-auth.ts) in the layout and inside every action.
- First-time setup: while `users` is empty, the sign-up tab creates the single
  owner account; afterwards it is permanently blocked (403).
