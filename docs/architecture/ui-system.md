# UI System — "Soft Clay Garden"

The visual identity of Personal OS: **neumorphism** molded from a single
sage-cream material, using the palette
[EDF1D6 / 9DC08B / 609966 / 40513B](https://colorhunt.co/palette/edf1d69dc08b60996640513b).
shadcn/ui (Nova preset) on Tailwind v4; light and dark theme. The system is
enforced centrally in `app/globals.css` — new pages and new shadcn components
inherit it automatically.

## Core idea

The whole interface is one slab of material. Form comes from light, not lines:

- **Raised** elements (cards, buttons, panels) cast a dual shadow — light from
  top-left (`--neu-light`), shade to bottom-right (`--neu-dark`).
- **Carved** elements (inputs, tab rails, active nav, icon wells) use the same
  pair inset.
- Borders are transparent almost everywhere; separation is done by depth.
- Pressing a button flips it from raised to inset (tactile feedback).

## Tokens (defined in `app/globals.css`)

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--background` / `--card` | `#EDF1D6` | `#40513B` | the material itself |
| `--foreground` | `#40513B` | `#EDF1D6` | text |
| `--primary` | `#609966` | `#9DC08B` | CTAs, active icons, focus ring |
| `--secondary` / `--muted` | sage tints | deep-green tints | chips, wells |
| `--neu-dark` / `--neu-light` | `#C7CFA7` / white | `#313F2C` / green glow | the shadow pair |
| `--radius` | `1rem` | — | soft corners everywhere |
| charts 1–5 | palette greens | inverted order | Recharts series |

## Typography

| Role | Face | Why |
|---|---|---|
| Headings (`h1–h4`, card/dialog titles) | **Quicksand** | rounded geometric — echoes the clay softness |
| Body | **Nunito** | rounded humanist, readable at small sizes |
| Data & numbers | **Geist Mono** | precise digits against soft surfaces (count-ups, tabular cells) |

Loaded via `next/font` in `app/layout.tsx`; mapped in `@theme` as
`--font-sans`, `--font-heading`, `--font-mono`.

## How the theme is applied (don't restyle per page)

- `app/globals.css` targets shadcn's `data-slot` attributes
  (`[data-slot="card"]`, `[data-slot="input"]`, `[data-slot="tabs-list"]`,
  `[data-slot="sidebar-menu-button"][data-active="true"]`, …). New shadcn
  components usually need **zero styling work**.
- Utilities for custom elements: `neu-raised`, `neu-raised-sm`, `neu-inset`,
  `neu-inset-sm`, `neu-panel` (raised + bg + radius — for table wrappers and
  free-form tiles).
- Buttons: `default`/`outline`/`secondary` variants are raised and flip to
  inset on `:active`; `ghost`/`link` stay flat.

## Motion (Framer Motion)

- Dashboard analytics is the one orchestrated moment: stat tiles enter with a
  staggered spring (`stiffness 260 / damping 24`) and numbers count up ~0.9 s
  (`features/dashboard/components/animated-stats.tsx`).
- Everywhere else motion stays micro (press, hover). One set piece per page
  at most; detail pages stay calm.
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

## Rules for future work

1. Never add hard borders for separation — use depth (`neu-*`) or spacing.
2. New tables: wrap in `neu-panel overflow-x-auto` (or rely on the
   `table-container` slot styling).
3. Charts use `--chart-1…5` only (palette greens).
4. Contrast floor: body text `--foreground` on base (≈7:1); muted text ≥4.5:1.
   Don't put long text on `--primary`.
5. `tabular-nums`/mono on numeric columns; truncate long text; tables never
   overflow the page.
