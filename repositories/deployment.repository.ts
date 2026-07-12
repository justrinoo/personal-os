import { prisma } from "@/lib/prisma";
import type {
  DeployEnvironment,
  Prisma,
} from "@/lib/generated/prisma/client";

export type DeploymentWithProject = Prisma.DeploymentGetPayload<{
  include: { project: true; rollbackOf: true };
}>;

export interface DeploymentData {
  version: string;
  environment: DeployEnvironment;
  projectId: string;
  commitHash: string | null;
  releaseNotes: string | null;
  success: boolean;
  rollbackOfId: string | null;
}

export function listDeployments(take = 100): Promise<DeploymentWithProject[]> {
  return prisma.deployment.findMany({
    include: { project: true, rollbackOf: true },
    orderBy: { deployedAt: "desc" },
    take,
  });
}

export function listProjectDeployments(projectId: string, take = 20) {
  return prisma.deployment.findMany({
    where: { projectId },
    include: { rollbackOf: true },
    orderBy: { deployedAt: "desc" },
    take,
  });
}

export async function createDeployment(data: DeploymentData) {
  const deployment = await prisma.deployment.create({ data });
  // Recording a rollback marks the reverted deployment.
  if (data.rollbackOfId) {
    await prisma.deployment.update({
      where: { id: data.rollbackOfId },
      data: { rolledBack: true },
    });
  }
  return deployment;
}

export function deleteDeployment(id: string) {
  return prisma.deployment.delete({ where: { id } });
}

/** Recent deployments of a project, for the rollback-of select. */
export function listRollbackTargets(projectId: string) {
  return prisma.deployment.findMany({
    where: { projectId },
    select: { id: true, version: true, environment: true, deployedAt: true },
    orderBy: { deployedAt: "desc" },
    take: 20,
  });
}
