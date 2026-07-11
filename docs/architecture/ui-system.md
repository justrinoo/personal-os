# UI System — FitFlow applied to Personal OS

**The canonical style source is [DESIGN.md](../../DESIGN.md)** (FitFlow,
generated via NeedMCP): golden-hour gold `#FFD147` on warm beige, shadow-only
elevation, Inter + JetBrains Mono, light-first with a Warm Inversion dark
mode. Read DESIGN.md for the full token set, component specs, and do's/don'ts
— this file documents how those tokens map onto our shadcn/Tailwind stack and
the app-specific patterns DESIGN.md doesn't cover.

## Token mapping (DESIGN.md → `app/globals.css`)

| FitFlow token | shadcn variable | Light | Dark |
|---|---|---|---|
| `colors.background` | `--background` | `#EBE9E4` | `#121212` |
| `colors.surface-card` | `--card` / `--popover` | `#FFFFFF` | `#2A2A2A` |
| `colors.ink` | `--foreground` | `#1A1D20` | `#E4E4E7` |
| `colors.primary` | `--primary` / `--ring` | `#FFD147` | `#FFD147` |
| (hover / pressed) | `--primary-hover` / `--primary-deep` | `#F5C038` / `#E0AD20` | `#FFE070` / `#E0AD20` |
| `colors.surface-dark` | `--secondary` | `#DCD4C6` | `#3E3A33` |
| `colors.background-bone` | `--muted` | `#F5F3EF` | `#1E1E1E` |
| `colors.mute` | `--muted-foreground` | `#6E7073` | `#909097` |
| `colors.surface` | `--accent` (hovers) | `#F8F7F4` | `#333333` |
| `colors.divider` | `--border` | `#E5E2DC` | `#2A2A2A` |
| `colors.hairline-strong` | `--input` (field borders) | `#C9C6BE` | `#555555` |
| hero gradient stops | `--chart-1…3` | gold / glow / pink | same |
| `elevation.level1–4` | `--elevation-1…4` | soft black shadows | deeper alphas |
| `rounded.md` (12px) | `--radius` | `0.75rem` | — |

**Light is the default** (no class on `<html>`); `.dark` holds the Warm
Inversion palette for a future toggle.

## Typography

Inter for everything (weights 400–700 only, tight negative tracking on
headings), JetBrains Mono for numbers/code — per DESIGN.md. Loaded via
`next/font` in `app/layout.tsx`, mapped as `--font-sans`, `--font-heading`,
`--font-mono`. Numeric cells keep `font-mono tabular-nums`.

## How the theme is applied (don't restyle per page)

- `app/globals.css` targets shadcn's `data-slot` attributes with unlayered
  rules (they must beat the utility classes inside shadcn components). New
  shadcn components usually need **zero styling work**.
- Depth utilities keep their historical `neu-*` names but now follow
  FitFlow's elevation table: `neu-raised`/`neu-panel`/`neu-raised-sm` =
  level 1 card, `neu-inset(-sm)` = subtle inner well, `glow-primary` =
  level 1 (FitFlow has no glow).
- Cards: white, borderless, level-1 shadow, hover lifts to level 2.
- Buttons: primary = gold with `--primary-hover`/`--primary-deep` states +
  0.98 press scale; outline = white card with hairline border that turns
  gold on hover; ghost = flat with warm surface hover.
- Inputs/selects: flat white with `--input` border, gold focus ring.
- Tabs: transparent rail with bottom hairline; active tab = 2px gold
  underline (FitFlow tab spec).
- Sidebar active item: warm surface + 2px gold accent bar.
- Overlays (dialog/dropdown/popover): level-3 shadow.

## Motion (Framer Motion)

- Dashboard analytics is the one orchestrated moment: stat tiles enter with a
  staggered spring (`stiffness 260 / damping 24`) and numbers count up ~0.9 s
  (`features/dashboard/components/animated-stats.tsx`).
- Everywhere else motion stays micro (hover lift, press scale, row
  highlight). One set piece per page at most.
- `useReducedMotion` respected in JS; a global `prefers-reduced-motion` rule
  kills CSS animation.
- DESIGN.md timing tokens: fast 150ms (tooltips), normal 200ms, slow 300ms.

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

`StatusBadge` maps enums to muted outline colors; the semantic anchors come
from DESIGN.md badges: success `#22C55E`, warning `#F59E0B`, info `#3B82F6`.
Add new enum values to its map — never inline badge colors in pages.

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

1. Follow DESIGN.md's do's/don'ts: gold is scarce (accent, never large
   surfaces); warm neutrals only (no cold grays/pure black); no thin font
   weights; shadow-only depth (never border-based elevation).
2. Tokens only — no hex in components or pages; charts use `--chart-1…5`.
3. New tables: wrap in `neu-panel overflow-x-auto` (or rely on the
   `table-container` slot styling) and add a `TableToolbar`.
4. Contrast floor: body text ≥7:1 on base; muted text ≥4.5:1.
5. Truncate long text; tables scroll inside their panel, never the page.
6. When DESIGN.md changes (e.g. a new NeedMCP style), re-map tokens in
   `globals.css` following the table above — one commit, and log it below.

## Theme evolution log

| Date | Theme | Notes |
|---|---|---|
| 2026-07-10 | shadcn neutral defaults | Phase 1 speed |
| 2026-07-11 | "Soft Clay Garden" — green neumorphism, Quicksand+Nunito | owner brief |
| 2026-07-11 | "Midnight Harbor" — navy dark-first, Space Grotesk+Jakarta | owner brief + table filtering |
| 2026-07-11 | **FitFlow** (DESIGN.md via NeedMCP) — gold on warm beige, Inter+JetBrains Mono, light-first | owner adopted NeedMCP style |
