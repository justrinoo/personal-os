import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

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

export function listTasks(): Promise<TaskWithProject[]> {
  return prisma.task.findMany({
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
