"use server";

import { revalidatePath } from "next/cache";

import {
  createActivity,
  deleteActivity,
  updateActivity,
  type ActivityData,
} from "@/repositories/activity.repository";
import { activitySchema, type ActivityInput } from "@/schemas/activity.schema";
import { ACTION_OK, actionError, type ActionResult } from "@/types/action";
import { emptyToNull, ratingToNumber } from "@/utils/normalize";

function revalidate() {
  revalidatePath("/activities");
  revalidatePath("/");
}

function toActivityData(input: ActivityInput): ActivityData {
  return {
    title: input.title.trim(),
    category: input.category,
    date: new Date(input.date),
    durationMin: input.durationMin,
    notes: emptyToNull(input.notes),
    mood: ratingToNumber(input.mood),
    productivity: ratingToNumber(input.productivity),
    projectId: input.projectId || null,
  };
}

export async function createActivityAction(
  input: ActivityInput
): Promise<ActionResult> {
  const parsed = activitySchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  try {
    await createActivity(toActivityData(parsed.data));
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to log activity");
  }
}

export async function updateActivityAction(
  id: string,
  input: ActivityInput
): Promise<ActionResult> {
  const parsed = activitySchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  try {
    await updateActivity(id, toActivityData(parsed.data));
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to update activity");
  }
}

export async function deleteActivityAction(id: string): Promise<ActionResult> {
  try {
    await deleteActivity(id);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to delete activity");
  }
}
