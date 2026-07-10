import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    workspace: true;
    client: true;
    _count: { select: { tasks: true; features: true } };
  };
}>;

export function listProjects(): Promise<ProjectWithRelations[]> {
  return prisma.project.findMany({
    include: {
      workspace: true,
      client: true,
      _count: { select: { tasks: true, features: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function countActiveProjects(): Promise<number> {
  return prisma.project.count({ where: { status: "ACTIVE" } });
}
