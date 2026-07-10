# Tech Stack

Versions reflect `package.json` at the time of writing.

## Application

| Concern | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 15.5 | Server Components first; Turbopack for dev, webpack for `next build` (Turbopack build crashes on this Windows machine) |
| UI runtime | React | 19.1 | |
| Language | TypeScript | 5.x | `strict`, no `any` |
| Styling | Tailwind CSS | 4.x | via `@tailwindcss/postcss` |
| Components | shadcn/ui | CLI 4.13 | Nova preset, radix base |
| Icons | lucide-react | — | |
| Animation | Framer Motion | 12.x | Use sparingly |
| Charts | Recharts | 3.x | Reports phase |
| Forms | React Hook Form + @hookform/resolvers | 7.x / 5.x | |
| Validation | Zod | 4.x | Single source of validation truth |
| Client state | Zustand | 5.x | Only for client-only UI state |
| Toasts | sonner | 2.x | |
| Dates | date-fns | 4.x | |

## Data

| Concern | Technology | Notes |
|---|---|---|
| Database | PostgreSQL (Supabase) | Session pooler, `aws-0-ap-northeast-1`, port 5432 |
| ORM | Prisma 7 | `prisma-client` generator → `lib/generated/prisma` (gitignored, regenerated on `postinstall`) |
| Driver | `@prisma/adapter-pg` | Required by Prisma 7 |
| Config | `prisma.config.ts` + `dotenv` | Connection URL from `DATABASE_URL` in `.env` |

## Planned

| Concern | Technology | Phase |
|---|---|---|
| Auth | Better Auth | 03 |
| File storage | Supabase Storage | later |
| Deployment | Docker + Coolify | 06 |
| Monitoring | Uptime Kuma, Prometheus, Grafana | 07 |
| AI | Anthropic API | 12 |

## Environment quirks (this machine)

- Port 3000 is occupied by another app — run dev on another port (`next dev -p 3001`).
- The RTK CLI hook rewrites `npx prisma`; call `./node_modules/.bin/prisma` directly.
