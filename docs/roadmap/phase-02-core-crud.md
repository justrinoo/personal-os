# Phase 02 — Core CRUD

**Status:** ✅ Done (2026-07-10)

## Goal

Make the app writable: create, edit, and delete the core entities from the UI
so Personal OS becomes a usable daily driver.

## Scope

- Zod schemas in `schemas/` for Workspace, Project, Task, Activity, Journal, Habit
- Server actions in `actions/` (validate → repository → `revalidatePath`)
- Repository write functions alongside the existing reads
- Form dialogs (react-hook-form + zodResolver) per entity in `features/*/components/`
- Shared primitives: `DeleteButton` (AlertDialog confirm), `EnumSelect`, `FieldError`
- New Workspaces page (`/workspaces`) + nav entry
- Habit "mark today" toggle (upsert/delete today's log)
- Toast feedback via sonner on every mutation

## Out of scope

- Clients, Sprints, Features UI (models exist; UI comes with the phases that need them)
- Editing journal entries and activities (create + delete only for journal; activities have update action ready but no edit UI yet)
- Auth (Phase 03)

## Acceptance criteria

- [x] Build passes (webpack; Turbopack build crashes on this machine)
- [x] Workspace can be created, edited, deleted from the browser
- [x] Project/Task/Activity/Journal/Habit create + delete work end-to-end
- [x] Validation errors render under fields; server errors toast
- [x] Deleting a workspace warns about cascade

## Patterns established

- Mutation path: **Zod schema → server action → repository → revalidatePath**.
- Form dialogs receive option lists (workspaces, projects) as props from server pages.
- Empty-string form values normalize to `null` in actions (`utils/normalize.ts`).
