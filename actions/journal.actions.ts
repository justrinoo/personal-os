"use server";

import { revalidatePath } from "next/cache";

import {
  deleteJournalEntry,
  upsertJournalEntry,
} from "@/repositories/journal.repository";
import { journalSchema, type JournalInput } from "@/schemas/journal.schema";
import { isAuthenticated } from "@/lib/require-auth";
import { ACTION_OK, actionError, type ActionResult } from "@/types/action";
import { emptyToNull } from "@/utils/normalize";

function revalidate() {
  revalidatePath("/journal");
  revalidatePath("/");
}

/** Upsert semantics: one morning + one night per day, saving updates. */
export async function saveJournalEntryAction(
  input: JournalInput
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  const parsed = journalSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const entry = parsed.data;
  try {
    await upsertJournalEntry({
      type: entry.type,
      date: new Date(entry.date),
      goals: emptyToNull(entry.goals),
      focus: emptyToNull(entry.focus),
      reflection: emptyToNull(entry.reflection),
      wins: emptyToNull(entry.wins),
      problems: emptyToNull(entry.problems),
      lessons: emptyToNull(entry.lessons),
      tomorrow: emptyToNull(entry.tomorrow),
    });
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to save journal entry");
  }
}

export async function deleteJournalEntryAction(
  id: string
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    await deleteJournalEntry(id);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to delete journal entry");
  }
}
