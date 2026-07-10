"use server";

import { revalidatePath } from "next/cache";

import {
  createProject,
  deleteProject,
  updateProject,
  type ProjectData,
} from "@/repositories/project.repository";
import { projectSchema, type ProjectInput } from "@/schemas/project.schema";
import { isAuthenticated } from "@/lib/require-auth";
import { ACTION_OK, actionError, type ActionResult } from "@/types/action";
import { emptyToNull } from "@/utils/normalize";

function revalidate() {
  revalidatePath("/projects");
  revalidatePath("/workspaces");
  revalidatePath("/tasks");
  revalidatePath("/");
}

function toProjectData(input: ProjectInput): ProjectData {
  return {
    name: input.name.trim(),
    description: emptyToNull(input.description),
    status: input.status,
    workspaceId: input.workspaceId,
    repositoryUrl: emptyToNull(input.repositoryUrl),
  };
}

export async function createProjectAction(
  input: ProjectInput
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  try {
    await createProject(toProjectData(parsed.data));
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to create project");
  }
}

export async function updateProjectAction(
  id: string,
  input: ProjectInput
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  try {
    await updateProject(id, toProjectData(parsed.data));
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to update project");
  }
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    await deleteProject(id);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to delete project");
  }
}
