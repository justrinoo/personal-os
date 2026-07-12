import { prisma } from "@/lib/prisma";
import type {
  IncidentSeverity,
  Prisma,
} from "@/lib/generated/prisma/client";
import type { KumaMonitorStatus } from "@/services/uptime-kuma.service";

export type MonitorWithProject = Prisma.MonitorGetPayload<{
  include: { project: true };
}>;

export type IncidentWithRelations = Prisma.IncidentGetPayload<{
  include: { monitor: true; project: true; deployment: true };
}>;

export function listMonitors(): Promise<MonitorWithProject[]> {
  return prisma.monitor.findMany({
    include: { project: true },
    orderBy: { name: "asc" },
  });
}

export async function upsertKumaMonitors(
  monitors: KumaMonitorStatus[]
): Promise<number> {
  for (const monitor of monitors) {
    const fields = {
      name: monitor.name,
      url: monitor.url,
      status: monitor.status,
      lastCheckedAt: monitor.lastCheckedAt,
    };
    await prisma.monitor.upsert({
      where: { kumaId: monitor.kumaId },
      update: fields,
      create: { ...fields, kumaId: monitor.kumaId },
    });
  }
  return monitors.length;
}

export function deleteMonitor(id: string) {
  return prisma.monitor.delete({ where: { id } });
}

export function assignMonitorProject(id: string, projectId: string | null) {
  return prisma.monitor.update({ where: { id }, data: { projectId } });
}

export interface IncidentData {
  title: string;
  severity: IncidentSeverity;
  cause: string | null;
  monitorId: string | null;
  projectId: string | null;
  deploymentId: string | null;
}

export function createIncident(data: IncidentData) {
  return prisma.incident.create({ data });
}

export function resolveIncident(id: string) {
  return prisma.incident.update({
    where: { id },
    data: { resolvedAt: new Date() },
  });
}

export function deleteIncident(id: string) {
  return prisma.incident.delete({ where: { id } });
}

export function listIncidents(take = 50): Promise<IncidentWithRelations[]> {
  return prisma.incident.findMany({
    include: { monitor: true, project: true, deployment: true },
    orderBy: [{ resolvedAt: { sort: "asc", nulls: "first" } }, { startedAt: "desc" }],
    take,
  });
}

export function listProjectIncidents(projectId: string, take = 10) {
  return prisma.incident.findMany({
    where: { projectId },
    include: { deployment: true },
    orderBy: { startedAt: "desc" },
    take,
  });
}

/** Dashboard health summary: monitor counts + active incidents. */
export async function getHealthSummary() {
  const [up, down, unknown, activeIncidents] = await Promise.all([
    prisma.monitor.count({ where: { status: "up" } }),
    prisma.monitor.count({ where: { status: "down" } }),
    prisma.monitor.count({ where: { status: "unknown" } }),
    prisma.incident.count({ where: { resolvedAt: null } }),
  ]);
  return { up, down, unknown, activeIncidents };
}
