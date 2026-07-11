import { prisma } from "@/lib/prisma";
import type { TaskStatus } from "@/lib/generated/prisma/client";
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
