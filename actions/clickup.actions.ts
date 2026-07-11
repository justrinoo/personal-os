"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  getProjectClickUpLink,
  getStatusMap,
  linkProjectToList,
  markProjectSynced,
  saveStatusMapping,
  unlinkProjectFromList,
  upsertSyncedTask,
} from "@/repositories/clickup.repository";
import {
  ClickUpError,
  fetchAllListTasks,
  fetchList,
  guessLocalStatus,
} from "@/services/clickup.service";
import { isAuthenticated } from "@/lib/require-auth";
import { ACTION_OK, actionError, type ActionResult } from "@/types/action";

const listIdSchema = z.string().trim().min(1, "List ID is required").max(50);

function revalidate() {
  revalidatePath("/projects");
  revalidatePath("/tasks");
  revalidatePath("/");
}

function toActionError(error: unknown, fallback: string): ActionResult {
  if (error instanceof ClickUpError) return actionError(error.message);
  return actionError(fallback);
}

export async function linkClickUpListAction(
  projectId: string,
  listId: string
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  const parsed = listIdSchema.safeParse(listId);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid list ID");
  }
  try {
    const list = await fetchList(parsed.data);
    await linkProjectToList(projectId, list.id, list.name);
    revalidate();
    return ACTION_OK;
  } catch (error) {
    return toActionError(error, "Failed to link ClickUp list");
  }
}

export async function unlinkClickUpListAction(
  projectId: string
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    await unlinkProjectFromList(projectId);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to unlink ClickUp list");
  }
}

export interface SyncResult extends ActionResult {
  synced?: number;
}

export async function syncClickUpAction(
  projectId: string
): Promise<SyncResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    const link = await getProjectClickUpLink(projectId);
    if (!link?.clickupListId) {
      return actionError("Project has no linked ClickUp list");
    }

    const [remoteTasks, statusMap] = await Promise.all([
      fetchAllListTasks(link.clickupListId),
      getStatusMap(),
    ]);

    for (const remote of remoteTasks) {
      let status = statusMap[remote.status];
      if (!status) {
        status = guessLocalStatus(remote.status);
        await saveStatusMapping(remote.status, status);
        statusMap[remote.status] = status;
      }
      await upsertSyncedTask(projectId, remote, status);
    }

    await markProjectSynced(projectId);
    revalidate();
    return { ok: true, synced: remoteTasks.length };
  } catch (error) {
    return toActionError(error, "Sync failed");
  }
}
