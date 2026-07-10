"use server";

import { revalidatePath } from "next/cache";

import {
  createJournalEntry,
  deleteJournalEntry,
} from "@/repositories/journal.repository";
import { journalSchema, type JournalInput } from "@/schemas/journal.schema";
import { ACTION_OK, actionError, type ActionResult } from "@/types/action";
import { emptyToNull } from "@/utils/normalize";

function revalidate() {
  revalidatePath("/journal");
  revalidatePath("/");
}

export async function createJournalEntryAction(
  input: JournalInput
): Promise<ActionResult> {
  const parsed = journalSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const entry = parsed.data;
  try {
    await createJournalEntry({
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
  try {
    await deleteJournalEntry(id);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to delete journal entry");
  }
}
