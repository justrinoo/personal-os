# Phase 03 — Authentication

**Status:** 🔜 Next

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

- [ ] Unauthenticated requests to any page redirect to `/login`
- [ ] Server actions reject unauthenticated calls (defense in depth, not just middleware)
- [ ] Session persists across restarts; sign-out works
- [ ] Sign-up endpoint disabled/guarded after first user

## Notes

Better Auth was chosen in root CLAUDE.md. Keep the auth surface minimal —
protecting a personal deployment, not building a user system.
