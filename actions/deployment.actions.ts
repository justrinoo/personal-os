"use server";

import { revalidatePath } from "next/cache";

import {
  createDeployment,
  deleteDeployment,
} from "@/repositories/deployment.repository";
import {
  deploymentSchema,
  type DeploymentInput,
} from "@/schemas/deployment.schema";
import { isAuthenticated } from "@/lib/require-auth";
import { ACTION_OK, actionError, type ActionResult } from "@/types/action";
import { emptyToNull } from "@/utils/normalize";

function revalidate() {
  revalidatePath("/deployments");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function createDeploymentAction(
  input: DeploymentInput
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  const parsed = deploymentSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  try {
    await createDeployment({
      version: parsed.data.version.trim(),
      environment: parsed.data.environment,
      projectId: parsed.data.projectId,
      commitHash: emptyToNull(parsed.data.commitHash),
      releaseNotes: emptyToNull(parsed.data.releaseNotes),
      success: parsed.data.success,
      rollbackOfId: parsed.data.rollbackOfId || null,
    });
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to record deployment");
  }
}

export async function deleteDeploymentAction(id: string): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    await deleteDeployment(id);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to delete deployment");
  }
}
