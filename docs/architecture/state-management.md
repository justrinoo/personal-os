# State Management

Server-first. Most "state" in Personal OS is database state rendered by Server
Components — there is no client cache to keep in sync.

## The hierarchy (use the lowest level that works)

1. **Server state** — fetched in Server Components via repositories/services.
   Mutations call server actions and `revalidatePath`; Next.js re-renders with
   fresh data. This covers ~90% of the app.
2. **Local component state** — `useState`/`useTransition` inside client
   components (dialog open, pending flags). Never lift higher than needed.
3. **Zustand (`store/`)** — only for client-only UI state shared across
   components (e.g. future command palette, filters that persist across
   navigation). No server data in Zustand.
4. **React Query** — not used. Only introduce if a future feature needs
   client-side polling/optimistic caches that RSC + revalidation cannot do
   (per root CLAUDE.md: "only if necessary").

## Rules

- Never copy server data into client state to "manage" it — pass it as props.
- After a mutation, rely on `revalidatePath`; do not manually patch UI state
  (exception: `useTransition` pending states for feedback).
- URL is state: filters/tabs that should survive refresh belong in
  `searchParams`, not in a store.

## Current usage

- `store/` is empty (placeholder). Phase 02 needed none — dialogs use local
  state, tables re-render from revalidated server data.
