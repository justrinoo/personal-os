"use server";

import { revalidatePath } from "next/cache";

import {
  createIncident,
  deleteIncident,
  deleteMonitor,
  resolveIncident,
  upsertKumaMonitors,
} from "@/repositories/monitoring.repository";
import {
  fetchKumaMonitors,
  UptimeKumaError,
} from "@/services/uptime-kuma.service";
import { incidentSchema, type IncidentInput } from "@/schemas/incident.schema";
import { isAuthenticated } from "@/lib/require-auth";
import { ACTION_OK, actionError, type ActionResult } from "@/types/action";
import { emptyToNull } from "@/utils/normalize";

function revalidate() {
  revalidatePath("/monitoring");
  revalidatePath("/");
}

export interface MonitorSyncResult extends ActionResult {
  synced?: number;
}

export async function syncMonitorsAction(): Promise<MonitorSyncResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    const monitors = await fetchKumaMonitors();
    const synced = await upsertKumaMonitors(monitors);
    revalidate();
    return { ok: true, synced };
  } catch (error) {
    if (error instanceof UptimeKumaError) return actionError(error.message);
    return actionError("Monitor sync failed");
  }
}

export async function deleteMonitorAction(id: string): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    await deleteMonitor(id);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to delete monitor");
  }
}

export async function createIncidentAction(
  input: IncidentInput
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  const parsed = incidentSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  try {
    await createIncident({
      title: parsed.data.title.trim(),
      severity: parsed.data.severity,
      cause: emptyToNull(parsed.data.cause),
      monitorId: parsed.data.monitorId || null,
      projectId: parsed.data.projectId || null,
      deploymentId: parsed.data.deploymentId || null,
    });
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to create incident");
  }
}

export async function resolveIncidentAction(id: string): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    await resolveIncident(id);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to resolve incident");
  }
}

export async function deleteIncidentAction(id: string): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    await deleteIncident(id);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to delete incident");
  }
}
