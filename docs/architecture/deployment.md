# Deployment

Target: Docker container on Coolify (self-hosted), database stays on Supabase.
Lands in Phase 06, after auth (Phase 03) exists.

Flow diagram: [diagrams/deployment-flow.md](../diagrams/deployment-flow.md)

## Build

- `next.config.ts` will enable `output: "standalone"` for a small runtime image.
- Multi-stage Dockerfile: deps → build (`prisma generate` runs via postinstall)
  → runtime (node, standalone output, non-root user).
- Build-time env: none required (no secrets baked into the image).

## Release process

1. Merge to `master` → Coolify builds the image
2. Run `./node_modules/.bin/prisma migrate deploy` against Supabase
   (release command, before the new container serves traffic)
3. Container starts; healthcheck on `/` (later a dedicated `/api/health`)
4. Record the deployment in Personal OS itself via the Coolify webhook

## Runtime environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Supabase session pooler URL |
| `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL` | Auth (Phase 03) |
| Integration tokens | ClickUp, GitHub, Anthropic as phases land |

## Rollback

- Coolify redeploys the previous image tag.
- Migrations are forward-only; destructive schema changes ship in two steps
  (expand → migrate data → contract) so old images keep working during rollback.

## Local ↔ prod parity

Same `npm run build` + `next start`; the only difference is env values.
