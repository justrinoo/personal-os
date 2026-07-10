import { prisma } from "@/lib/prisma";
import type {
  Prisma,
  Workspace,
  WorkspaceType,
} from "@/lib/generated/prisma/client";

export type WorkspaceWithCounts = Prisma.WorkspaceGetPayload<{
  include: { _count: { select: { projects: true; clients: true } } };
}>;

export interface WorkspaceData {
  name: string;
  type: WorkspaceType;
  description: string | null;
}

export function listWorkspacesWithCounts(): Promise<WorkspaceWithCounts[]> {
  return prisma.workspace.findMany({
    include: { _count: { select: { projects: true, clients: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export function listWorkspaceOptions(): Promise<
  Pick<Workspace, "id" | "name">[]
> {
  return prisma.workspace.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export function createWorkspace(data: WorkspaceData): Promise<Workspace> {
  return prisma.workspace.create({ data });
}

export function updateWorkspace(
  id: string,
  data: WorkspaceData
): Promise<Workspace> {
  return prisma.workspace.update({ where: { id }, data });
}

export function deleteWorkspace(id: string): Promise<Workspace> {
  return prisma.workspace.delete({ where: { id } });
}
