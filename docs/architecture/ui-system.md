# UI System — "Midnight Harbor"

The visual identity of Personal OS: deep-navy surfaces with layered soft
depth, using the palette
[1B262C / 0F4C75 / 3282B8 / BBE1FA](https://colorhunt.co/palette/1b262c0f4c753282b8bbe1fa).
shadcn/ui (Nova preset) on Tailwind v4. **Dark is the default theme**
(`<html class="dark">`); light tokens exist for a future toggle. The system is
enforced centrally in `app/globals.css` — new pages and new shadcn components
inherit it automatically.

## Core idea

Surfaces float on soft depth instead of hard lines:

- **Raised** elements (cards, panels, active tabs) cast a drop shadow below
  plus a hairline light edge on top (`--neu-light`).
- **Carved** elements (inputs, tab rails) are inset into the surface.
- **Primary actions** carry a quiet blue glow (`glow-primary`).
- Hairline borders (`--border`, ~10% light blue) give definition on dark.
- Rows, cards, and buttons all respond to hover/press — nothing feels static.

## Tokens (defined in `app/globals.css`)

| Token | Dark (default) | Light | Used for |
|---|---|---|---|
| `--background` | `#1B262C` | `#E9F2FA` | page base |
| `--card` | `#212F38` | `#F5FAFF` | raised surfaces |
| `--foreground` | `#DCECF7` | `#1B262C` | text |
| `--primary` | `#3282B8` | `#0F4C75` | CTAs, active nav, focus ring |
| `--secondary` | `#0F4C75` | `#CFE6F8` | chips, secondary actions |
| `--accent` | `#2A3D49` (fg `#BBE1FA`) | `#BBE1FA` | hovers, highlights |
| `--neu-dark` / `--neu-light` | black 55% / `#BBE1FA` 7% | navy 16% / white | depth pair |
| `--glow` | `#3282B8` 45% | 35% | primary button glow |
| `--radius` | `1rem` | — | soft corners everywhere |
| charts 1–5 | palette blues | inverted order | Recharts series |

## Typography

| Role | Face | Why |
|---|---|---|
| Headings (`h1–h4`, card/dialog titles) | **Space Grotesk** | technical character, fits the navy theme |
| Body | **Plus Jakarta Sans** | modern grotesque, excellent at small sizes |
| Data & numbers | **Geist Mono** | precise digits (count-ups, tabular cells) |

Loaded via `next/font` in `app/layout.tsx`; mapped in `@theme` as
`--font-sans`, `--font-heading`, `--font-mono`.

## How the theme is applied (don't restyle per page)

- `app/globals.css` targets shadcn's `data-slot` attributes
  (`[data-slot="card"]`, `[data-slot="input"]`, `[data-slot="tabs-list"]`,
  `[data-slot="sidebar-menu-button"][data-active="true"]`, …). New shadcn
  components usually need **zero styling work**.
- Utilities for custom elements: `neu-raised`, `neu-raised-sm`, `neu-inset`,
  `neu-inset-sm`, `neu-panel` (raised + bg + border + radius — for table
  wrappers and free-form tiles), `glow-primary`.
- Buttons: `default` glows, `outline`/`secondary` are raised; all three press
  to inset on `:active`; `ghost`/`link` stay flat.

## Motion (Framer Motion)

- Dashboard analytics is the one orchestrated moment: stat tiles enter with a
  staggered spring (`stiffness 260 / damping 24`) and numbers count up ~0.9 s
  (`features/dashboard/components/animated-stats.tsx`).
- Everywhere else motion stays micro (press, hover, row highlight). One set
  piece per page at most; detail pages stay calm.
- `useReducedMotion` respected in JS; a global `prefers-reduced-motion` rule
  kills CSS animation.

## Layout

- App shell: `SidebarProvider` → `AppSidebar` (nav from `constants/navigation.ts`) → `SidebarInset`.
- Every page: `PageHeader` (title, description, action slot) then
  `<main className="flex flex-col gap-6 p-4 md:p-6">`.
- Cards for summaries, tables for datasets, grids collapse on mobile
  (`sm:grid-cols-2 xl:grid-cols-4`).

## Shared primitives (use these, don't reinvent)

| Component | Use |
|---|---|
| `AnimatedStats` | Dashboard metric tiles (count-up + stagger) |
| `TableToolbar` | Search + enum filters via URL params (server-side filtering) |
| `EmptyState` | Icon + title + description for empty datasets |
| `StatusBadge` | Colored outline badge for any status/priority enum |
| `DbOfflineBanner` | Shown when `safeQuery` reports `ok: false` |
| `DeleteButton` | AlertDialog-confirmed destructive action |
| `EnumSelect` | Select over enum values or `{value,label}` options |
| `FieldError` | Form field validation message |

## Form pattern

Dialog-based create/edit: `features/<module>/components/<entity>-form-dialog.tsx`
— react-hook-form + zodResolver, `Controller` for selects/tabs, native inputs
for date, submit button with pending label, sonner toast on result. The same
dialog handles create and edit (optional entity prop).

## Status colors

`StatusBadge` maps enums to muted outline colors: emerald = done/active,
sky = planned/ready, violet = in development, amber = attention, red = urgent,
gray = backlog/archived. Add new enum values to its map — never inline badge
colors in pages.

## Table filtering pattern

Every dataset page filters server-side via URL search params:

1. Page reads `searchParams` (async in Next 15), validates enums with
   `pickEnum` (`utils/search-params.ts`), passes filters to the repository.
2. Repository list functions take an optional filters object and translate it
   to a Prisma `where` (insensitive `contains` for search).
3. `TableToolbar` renders the search box + selects, debounces typing 300 ms,
   and writes params with `router.replace` — results are shareable URLs.
4. Empty states switch copy when filters are active ("No X match your
   filters").

Implemented on Tasks, Projects, ClickUp; reuse for every future table.

## Rules for future work

1. No hard borders for separation — hairline `--border` + depth (`neu-*`).
2. New tables: wrap in `neu-panel overflow-x-auto` (or rely on the
   `table-container` slot styling) and add a `TableToolbar`.
3. Charts use `--chart-1…5` only (palette blues).
4. Contrast floor: body text ≥7:1 on base; muted text ≥4.5:1. Don't put long
   text on `--primary`.
5. `tabular-nums`/mono on numeric columns; truncate long text; tables never
   overflow the page; grids collapse (`sm:grid-cols-2 xl:grid-cols-4`).
