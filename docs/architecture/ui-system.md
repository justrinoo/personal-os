# UI System

Modern, minimal, dashboard-oriented. shadcn/ui (Nova preset, radix base) on
Tailwind v4 with CSS variables — light and dark theme supported by default.

## Layout

- App shell: `SidebarProvider` → `AppSidebar` (nav from `constants/navigation.ts`) → `SidebarInset`.
- Every page: `PageHeader` (title, description, action button slot) then
  `<main className="flex flex-col gap-6 p-4 md:p-6">`.
- Content primitives: Cards for summaries and lists, Tables for datasets,
  grids that collapse on mobile (`sm:grid-cols-2 xl:grid-cols-4`).

## Shared primitives (use these, don't reinvent)

| Component | Use |
|---|---|
| `StatCard` | Dashboard metric tiles |
| `EmptyState` | Icon + title + description for empty datasets |
| `StatusBadge` | Colored outline badge for any status/priority enum |
| `DbOfflineBanner` | Shown when `safeQuery` reports `ok: false` |
| `DeleteButton` | AlertDialog-confirmed destructive action |
| `EnumSelect` | Select over enum values or `{value,label}` options |
| `FieldError` | Form field validation message |

## Form pattern

Dialog-based create/edit: `features/<module>/components/<entity>-form-dialog.tsx`
— react-hook-form + zodResolver, `Controller` for selects/tabs, native inputs
for date (`type="date"` / `datetime-local`), submit button with pending label,
sonner toast on result. The same dialog handles create and edit (optional
entity prop).

## Status colors

`StatusBadge` maps enums to muted outline colors: emerald = done/active,
sky = planned/ready, violet = in development, amber = attention (review,
on hold), red = urgent, gray = backlog/archived. Add new enum values to its
map — never inline badge colors in pages.

## Rules

- No unnecessary animation; motion only where it communicates state.
- `tabular-nums` on numeric columns.
- Truncate long text (`truncate` + `max-w-*`), never let tables overflow the page.
- Charts (Phase 11): Recharts, consistent palette, follow the dataviz method.
