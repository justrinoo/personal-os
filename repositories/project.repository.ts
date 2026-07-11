import { prisma } from "@/lib/prisma";
import type {
  Prisma,
  Project,
  ProjectStatus,
} from "@/lib/generated/prisma/client";

export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    workspace: true;
    client: true;
    _count: { select: { tasks: true; features: true } };
  };
}>;

export interface ProjectFilters {
  q?: string;
  status?: ProjectStatus;
}

export function listProjects(
  filters: ProjectFilters = {}
): Promise<ProjectWithRelations[]> {
  return prisma.project.findMany({
    where: {
      ...(filters.q
        ? { name: { contains: filters.q, mode: "insensitive" } }
        : {}),
      ...(filters.status ? { status: filters.status } : {}),
    },
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

export function listProjectOptions(): Promise<Pick<Project, "id" | "name">[]> {
  return prisma.project.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export interface ProjectData {
  name: string;
  description: string | null;
  status: ProjectStatus;
  workspaceId: string;
  repositoryUrl: string | null;
}

export function createProject(data: ProjectData): Promise<Project> {
  return prisma.project.create({ data });
}

export function updateProject(id: string, data: ProjectData): Promise<Project> {
  return prisma.project.update({ where: { id }, data });
}

export function deleteProject(id: string): Promise<Project> {
  return prisma.project.delete({ where: { id } });
}
