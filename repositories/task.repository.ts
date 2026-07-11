import { prisma } from "@/lib/prisma";
import type {
  Priority,
  Prisma,
  Task,
  TaskStatus,
  TaskType,
} from "@/lib/generated/prisma/client";

export type TaskWithProject = Prisma.TaskGetPayload<{
  include: { project: true };
}>;

const OPEN_STATUSES = [
  "BACKLOG",
  "PLANNING",
  "READY",
  "DEVELOPMENT",
  "REVIEW",
  "TESTING",
] as const;

export interface TaskFilters {
  q?: string;
  status?: TaskStatus;
  priority?: Priority;
}

export function listTasks(filters: TaskFilters = {}): Promise<TaskWithProject[]> {
  return prisma.task.findMany({
    where: {
      ...(filters.q
        ? { title: { contains: filters.q, mode: "insensitive" } }
        : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.priority ? { priority: filters.priority } : {}),
    },
    include: { project: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function listRecentTasks(limit = 5): Promise<TaskWithProject[]> {
  return prisma.task.findMany({
    where: { status: { in: [...OPEN_STATUSES] } },
    include: { project: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

export function countOpenTasks(): Promise<number> {
  return prisma.task.count({
    where: { status: { in: [...OPEN_STATUSES] } },
  });
}

export interface TaskData {
  title: string;
  description: string | null;
  type: TaskType;
  status: TaskStatus;
  priority: Priority;
  dueDate: Date | null;
  projectId: string | null;
  gitBranch: string | null;
}

export function createTask(data: TaskData): Promise<Task> {
  return prisma.task.create({ data });
}

export function updateTask(id: string, data: TaskData): Promise<Task> {
  return prisma.task.update({ where: { id }, data });
}

export function deleteTask(id: string): Promise<Task> {
  return prisma.task.delete({ where: { id } });
}
