import { prisma } from "@/lib/prisma";
import type {
  LearningStatus,
  LearningType,
  Prisma,
} from "@/lib/generated/prisma/client";

export type LearningItemWithRelations = Prisma.LearningItemGetPayload<{
  include: {
    project: { select: { id: true; name: true } };
    activities: { select: { durationMin: true } };
  };
}>;

/** All items with linked activity durations (time invested = their sum). */
export function listLearningItems(): Promise<LearningItemWithRelations[]> {
  return prisma.learningItem.findMany({
    include: {
      project: { select: { id: true, name: true } },
      activities: { select: { durationMin: true } },
    },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });
}

export function listInProgressItems(take = 5) {
  return prisma.learningItem.findMany({
    where: { status: "IN_PROGRESS" },
    orderBy: { updatedAt: "desc" },
    take,
  });
}

/** Options for linking a LEARNING activity to an item. */
export function listLearningOptions() {
  return prisma.learningItem.findMany({
    where: { status: { in: ["BACKLOG", "IN_PROGRESS"] } },
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });
}

export interface LearningData {
  title: string;
  type: LearningType;
  status: LearningStatus;
  sourceUrl: string | null;
  progress: number;
  startedAt: Date | null;
  finishedAt: Date | null;
  notes: string | null;
  issuer: string | null;
  credentialUrl: string | null;
  expiresAt: Date | null;
  projectId: string | null;
}

export function createLearningItem(data: LearningData) {
  return prisma.learningItem.create({ data });
}

export function updateLearningItem(id: string, data: LearningData) {
  return prisma.learningItem.update({ where: { id }, data });
}

export function deleteLearningItem(id: string) {
  return prisma.learningItem.delete({ where: { id } });
}
