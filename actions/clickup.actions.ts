"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  applyLocalTicketChange,
  createProjectForList,
  deleteMissingClickUpTasks,
  ensureClickUpWorkspace,
  findProjectByListId,
  getProjectClickUpLink,
  getStatusMap,
  getTaskClickUpRef,
  linkProjectToList,
  listLinkedProjects,
  markProjectSynced,
  saveStatusMapping,
  unlinkProjectFromList,
  upsertSyncedTask,
} from "@/repositories/clickup.repository";
import {
  ClickUpError,
  fetchAllListTasks,
  fetchAuthorizedUserId,
  fetchListStatuses,
  fetchMyAssignedTasks,
  guessLocalStatus,
  resolveListReference,
  updateRemoteTask,
  type DiscoveredTask,
} from "@/services/clickup.service";
import { PRIORITIES } from "@/constants/enums";
import { isAuthenticated } from "@/lib/require-auth";
import { ACTION_OK, actionError, type ActionResult } from "@/types/action";

const listReferenceSchema = z
  .string()
  .trim()
  .min(1, "Paste a ClickUp list ID, ticket ID, or URL")
  .max(300);
const prioritySchema = z.enum(PRIORITIES);
const remoteStatusSchema = z.string().trim().min(1).max(100);

function revalidate() {
  revalidatePath("/projects");
  revalidatePath("/tasks");
  revalidatePath("/clickup");
  revalidatePath("/");
}

function toActionError(error: unknown, fallback: string): ActionResult {
  if (error instanceof ClickUpError) return actionError(error.message);
  return actionError(fallback);
}

export async function linkClickUpListAction(
  projectId: string,
  listReference: string
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  const parsed = listReferenceSchema.safeParse(listReference);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid reference");
  }
  try {
    const list = await resolveListReference(parsed.data);
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
  removed?: number;
}

/**
 * Pulls only tickets assigned to the token owner, then mirrors: local
 * ClickUp rows that dropped out of the remote set are removed.
 */
async function syncProject(
  projectId: string,
  listId: string,
  assigneeId: number
): Promise<{ synced: number; removed: number }> {
  const [remoteTasks, statusMap] = await Promise.all([
    fetchAllListTasks(listId, assigneeId),
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

  const removed = await deleteMissingClickUpTasks(
    projectId,
    remoteTasks.map((task) => task.id)
  );
  await markProjectSynced(projectId);
  return { synced: remoteTasks.length, removed };
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
    const assigneeId = await fetchAuthorizedUserId();
    const result = await syncProject(projectId, link.clickupListId, assigneeId);
    revalidate();
    return { ok: true, ...result };
  } catch (error) {
    return toActionError(error, "Sync failed");
  }
}

export async function syncAllClickUpAction(): Promise<SyncResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    const projects = await listLinkedProjects();
    if (projects.length === 0) {
      return actionError("No projects have a linked ClickUp list yet");
    }
    const assigneeId = await fetchAuthorizedUserId();
    let synced = 0;
    let removed = 0;
    for (const project of projects) {
      const result = await syncProject(
        project.id,
        project.clickupListId as string,
        assigneeId
      );
      synced += result.synced;
      removed += result.removed;
    }
    revalidate();
    return { ok: true, synced, removed };
  } catch (error) {
    return toActionError(error, "Sync failed");
  }
}

export interface DiscoverResult extends SyncResult {
  createdProjects?: number;
}

/**
 * Zero-config sync: finds every ClickUp ticket assigned to me across all
 * teams, auto-creates a project per list (in the "ClickUp" workspace) when
 * none is linked yet, and mirrors tickets into those projects.
 */
export async function discoverClickUpAction(): Promise<DiscoverResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    const assigneeId = await fetchAuthorizedUserId();
    const tasks = await fetchMyAssignedTasks(assigneeId);

    const byList = new Map<string, { listName: string; tasks: DiscoveredTask[] }>();
    for (const task of tasks) {
      const group = byList.get(task.listId) ?? {
        listName: task.listName,
        tasks: [],
      };
      group.tasks.push(task);
      byList.set(task.listId, group);
    }

    const statusMap = await getStatusMap();
    const coveredProjectIds = new Set<string>();
    let createdProjects = 0;
    let synced = 0;
    let removed = 0;

    for (const [listId, group] of byList) {
      let project = await findProjectByListId(listId);
      if (!project) {
        const workspaceId = await ensureClickUpWorkspace();
        project = await createProjectForList(workspaceId, listId, group.listName);
        createdProjects++;
      }
      coveredProjectIds.add(project.id);

      for (const remote of group.tasks) {
        let status = statusMap[remote.status];
        if (!status) {
          status = guessLocalStatus(remote.status);
          await saveStatusMapping(remote.status, status);
          statusMap[remote.status] = status;
        }
        await upsertSyncedTask(project.id, remote, status);
      }

      removed += await deleteMissingClickUpTasks(
        project.id,
        group.tasks.map((task) => task.id)
      );
      await markProjectSynced(project.id);
      synced += group.tasks.length;
    }

    // Linked projects whose lists no longer hold any of my tickets:
    // clear their synced rows so the mirror stays truthful.
    for (const project of await listLinkedProjects()) {
      if (!coveredProjectIds.has(project.id)) {
        removed += await deleteMissingClickUpTasks(project.id, []);
        await markProjectSynced(project.id);
      }
    }

    revalidate();
    return { ok: true, synced, removed, createdProjects };
  } catch (error) {
    return toActionError(error, "ClickUp discovery failed");
  }
}

export interface StatusOptionsResult extends ActionResult {
  statuses?: string[];
}

/** Remote status options for the list a ticket belongs to. */
export async function getTicketStatusOptionsAction(
  taskId: string
): Promise<StatusOptionsResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    const ref = await getTaskClickUpRef(taskId);
    if (!ref?.clickupId || !ref.project?.clickupListId) {
      return actionError("Task is not linked to ClickUp");
    }
    const statuses = await fetchListStatuses(ref.project.clickupListId);
    return { ok: true, statuses };
  } catch (error) {
    return toActionError(error, "Failed to load ClickUp statuses");
  }
}

/** Pushes a status change to ClickUp, then mirrors it locally. */
export async function setTicketStatusAction(
  taskId: string,
  remoteStatus: string
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  const parsed = remoteStatusSchema.safeParse(remoteStatus);
  if (!parsed.success) return actionError("Invalid status");
  try {
    const ref = await getTaskClickUpRef(taskId);
    if (!ref?.clickupId) return actionError("Task is not linked to ClickUp");

    await updateRemoteTask(ref.clickupId, { status: parsed.data });

    const statusMap = await getStatusMap();
    let localStatus = statusMap[parsed.data.toLowerCase()];
    if (!localStatus) {
      localStatus = guessLocalStatus(parsed.data);
      await saveStatusMapping(parsed.data.toLowerCase(), localStatus);
    }
    await applyLocalTicketChange(taskId, {
      status: localStatus,
      clickupStatus: parsed.data.toLowerCase(),
    });
    revalidate();
    return ACTION_OK;
  } catch (error) {
    return toActionError(error, "Failed to update ClickUp status");
  }
}

/** Pushes a priority change to ClickUp, then mirrors it locally. */
export async function setTicketPriorityAction(
  taskId: string,
  priority: string
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  const parsed = prioritySchema.safeParse(priority);
  if (!parsed.success) return actionError("Invalid priority");
  try {
    const ref = await getTaskClickUpRef(taskId);
    if (!ref?.clickupId) return actionError("Task is not linked to ClickUp");

    await updateRemoteTask(ref.clickupId, { priority: parsed.data });
    await applyLocalTicketChange(taskId, { priority: parsed.data });
    revalidate();
    return ACTION_OK;
  } catch (error) {
    return toActionError(error, "Failed to update ClickUp priority");
  }
}
