"use server";

import { revalidatePath } from "next/cache";

import {
  createWorkspace,
  deleteWorkspace,
  updateWorkspace,
} from "@/repositories/workspace.repository";
import { workspaceSchema, type WorkspaceInput } from "@/schemas/workspace.schema";
import { ACTION_OK, actionError, type ActionResult } from "@/types/action";
import { emptyToNull } from "@/utils/normalize";

function revalidate() {
  revalidatePath("/workspaces");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function createWorkspaceAction(
  input: WorkspaceInput
): Promise<ActionResult> {
  const parsed = workspaceSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  try {
    await createWorkspace({
      name: parsed.data.name.trim(),
      type: parsed.data.type,
      description: emptyToNull(parsed.data.description),
    });
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to create workspace");
  }
}

export async function updateWorkspaceAction(
  id: string,
  input: WorkspaceInput
): Promise<ActionResult> {
  const parsed = workspaceSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  try {
    await updateWorkspace(id, {
      name: parsed.data.name.trim(),
      type: parsed.data.type,
      description: emptyToNull(parsed.data.description),
    });
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to update workspace");
  }
}

export async function deleteWorkspaceAction(id: string): Promise<ActionResult> {
  try {
    await deleteWorkspace(id);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to delete workspace");
  }
}
