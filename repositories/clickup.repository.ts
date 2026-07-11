import { prisma } from "@/lib/prisma";
import type {
  Priority,
  Prisma,
  TaskStatus,
} from "@/lib/generated/prisma/client";
import type { RemoteTask } from "@/services/clickup.service";

export function linkProjectToList(
  projectId: string,
  listId: string,
  listName: string
) {
  return prisma.project.update({
    where: { id: projectId },
    data: {
      clickupListId: listId,
      clickupListName: listName,
      clickupSyncedAt: null,
    },
  });
}

export function unlinkProjectFromList(projectId: string) {
  return prisma.project.update({
    where: { id: projectId },
    data: {
      clickupListId: null,
      clickupListName: null,
      clickupSyncedAt: null,
    },
  });
}

export function getProjectClickUpLink(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, clickupListId: true, clickupListName: true },
  });
}

/** Loads the remote→local status map as a lookup object. */
export async function getStatusMap(): Promise<Record<string, TaskStatus>> {
  const rows = await prisma.clickUpStatusMap.findMany();
  return Object.fromEntries(rows.map((row) => [row.remoteStatus, row.localStatus]));
}

/** Persists a guessed mapping so it becomes editable configuration. */
export function saveStatusMapping(remoteStatus: string, localStatus: TaskStatus) {
  return prisma.clickUpStatusMap.upsert({
    where: { remoteStatus },
    update: {},
    create: { remoteStatus, localStatus },
  });
}

/**
 * Idempotent upsert of a synced ClickUp task. Only remote-owned fields are
 * updated on existing rows — local type stays untouched.
 */
export function upsertSyncedTask(
  projectId: string,
  remote: RemoteTask,
  status: TaskStatus
) {
  const remoteFields = {
    title: remote.name,
    description: remote.description,
    status,
    priority: remote.priority,
    dueDate: remote.dueDate,
    clickupUrl: remote.url,
    clickupStatus: remote.status,
    clickupRemoteUpdatedAt: remote.remoteUpdatedAt,
  };
  return prisma.task.upsert({
    where: { clickupId: remote.id },
    update: remoteFields,
    create: {
      ...remoteFields,
      clickupId: remote.id,
      projectId,
      type: "DEVELOPMENT",
    },
  });
}

export function markProjectSynced(projectId: string) {
  return prisma.project.update({
    where: { id: projectId },
    data: { clickupSyncedAt: new Date() },
  });
}

/**
 * Mirror cleanup: removes synced ClickUp tasks that are no longer in the
 * remote result set (deleted, or no longer assigned to me). Never touches
 * manually created local tasks (clickupId null).
 */
export async function deleteMissingClickUpTasks(
  projectId: string,
  keepClickUpIds: string[]
): Promise<number> {
  const result = await prisma.task.deleteMany({
    where: {
      projectId,
      clickupId: { not: null, notIn: keepClickUpIds },
    },
  });
  return result.count;
}

export type ClickUpTicket = Prisma.TaskGetPayload<{
  include: { project: true };
}>;

/** All locally synced ClickUp tickets, newest remote change first. */
export function listClickUpTickets(): Promise<ClickUpTicket[]> {
  return prisma.task.findMany({
    where: { clickupId: { not: null } },
    include: { project: true },
    orderBy: { clickupRemoteUpdatedAt: "desc" },
  });
}

/** Projects that have a ClickUp list linked. */
export function listLinkedProjects() {
  return prisma.project.findMany({
    where: { clickupListId: { not: null } },
    select: {
      id: true,
      name: true,
      clickupListId: true,
      clickupSyncedAt: true,
    },
    orderBy: { name: "asc" },
  });
}

/** Resolves a local task to its ClickUp reference and the linked list. */
export function getTaskClickUpRef(taskId: string) {
  return prisma.task.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      clickupId: true,
      project: { select: { clickupListId: true } },
    },
  });
}

/** Applies a change that was successfully pushed to ClickUp to the local row. */
export function applyLocalTicketChange(
  taskId: string,
  change: { status?: TaskStatus; clickupStatus?: string; priority?: Priority }
) {
  return prisma.task.update({
    where: { id: taskId },
    data: { ...change, clickupRemoteUpdatedAt: new Date() },
  });
}
