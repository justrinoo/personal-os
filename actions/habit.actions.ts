"use server";

import { revalidatePath } from "next/cache";

import {
  createHabit,
  deleteHabit,
  toggleHabitToday,
  updateHabit,
} from "@/repositories/habit.repository";
import { habitSchema, type HabitInput } from "@/schemas/habit.schema";
import { ACTION_OK, actionError, type ActionResult } from "@/types/action";
import { emptyToNull } from "@/utils/normalize";

function revalidate() {
  revalidatePath("/habits");
  revalidatePath("/");
}

export async function createHabitAction(
  input: HabitInput
): Promise<ActionResult> {
  const parsed = habitSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  try {
    await createHabit({
      name: parsed.data.name.trim(),
      description: emptyToNull(parsed.data.description),
      targetDays: parsed.data.targetDays,
    });
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to create habit");
  }
}

export async function updateHabitAction(
  id: string,
  input: HabitInput
): Promise<ActionResult> {
  const parsed = habitSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  try {
    await updateHabit(id, {
      name: parsed.data.name.trim(),
      description: emptyToNull(parsed.data.description),
      targetDays: parsed.data.targetDays,
    });
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to update habit");
  }
}

export async function deleteHabitAction(id: string): Promise<ActionResult> {
  try {
    await deleteHabit(id);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to delete habit");
  }
}

export async function toggleHabitTodayAction(
  habitId: string
): Promise<ActionResult> {
  try {
    await toggleHabitToday(habitId);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to update habit log");
  }
}
