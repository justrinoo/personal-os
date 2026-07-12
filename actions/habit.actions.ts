"use server";

import { revalidatePath } from "next/cache";

import {
  createHabit,
  deleteHabit,
  setHabitActive,
  toggleHabitOnDay,
  toggleHabitToday,
  updateHabit,
} from "@/repositories/habit.repository";
import { habitSchema, type HabitInput } from "@/schemas/habit.schema";
import { isAuthenticated } from "@/lib/require-auth";
import { ACTION_OK, actionError, type ActionResult } from "@/types/action";
import { emptyToNull } from "@/utils/normalize";

function revalidate() {
  revalidatePath("/habits");
  revalidatePath("/");
}

export async function createHabitAction(
  input: HabitInput
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
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
  if (!(await isAuthenticated())) return actionError("Unauthorized");
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
  if (!(await isAuthenticated())) return actionError("Unauthorized");
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
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    await toggleHabitToday(habitId);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to update habit log");
  }
}

/** Backfill: toggle a habit log on any past day (yyyy-MM-dd). */
export async function toggleHabitDayAction(
  habitId: string,
  day: string
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return actionError("Invalid day");
  const date = new Date(`${day}T00:00:00`);
  if (date.getTime() > Date.now()) {
    return actionError("Future days can't be logged");
  }
  try {
    await toggleHabitOnDay(habitId, date);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to update habit log");
  }
}

export async function setHabitActiveAction(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    await setHabitActive(id, isActive);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to update habit");
  }
}
