"use server";

import { revalidatePath } from "next/cache";

import {
  createLearningItem,
  deleteLearningItem,
  updateLearningItem,
  type LearningData,
} from "@/repositories/learning.repository";
import { learningSchema, type LearningInput } from "@/schemas/learning.schema";
import { isAuthenticated } from "@/lib/require-auth";
import { ACTION_OK, actionError, type ActionResult } from "@/types/action";
import { emptyToNull } from "@/utils/normalize";

function revalidate() {
  revalidatePath("/learning");
  revalidatePath("/");
}

function toLearningData(input: LearningInput): LearningData {
  return {
    title: input.title.trim(),
    type: input.type,
    status: input.status,
    sourceUrl: emptyToNull(input.sourceUrl),
    progress: input.status === "FINISHED" ? 100 : input.progress,
    startedAt: input.startedAt ? new Date(input.startedAt) : null,
    finishedAt: input.finishedAt ? new Date(input.finishedAt) : null,
    notes: emptyToNull(input.notes),
    issuer: emptyToNull(input.issuer),
    credentialUrl: emptyToNull(input.credentialUrl),
    expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    projectId: input.projectId || null,
  };
}

export async function createLearningItemAction(
  input: LearningInput
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  const parsed = learningSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  try {
    await createLearningItem(toLearningData(parsed.data));
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to create learning item");
  }
}

export async function updateLearningItemAction(
  id: string,
  input: LearningInput
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  const parsed = learningSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  try {
    await updateLearningItem(id, toLearningData(parsed.data));
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to update learning item");
  }
}

export async function deleteLearningItemAction(
  id: string
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    await deleteLearningItem(id);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to delete learning item");
  }
}
