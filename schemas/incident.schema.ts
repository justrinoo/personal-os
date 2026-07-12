import { z } from "zod";

import { INCIDENT_SEVERITIES } from "@/constants/enums";

export const incidentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  severity: z.enum(INCIDENT_SEVERITIES),
  cause: z.string().max(2000).optional(),
  monitorId: z.string().optional(),
  projectId: z.string().optional(),
  deploymentId: z.string().optional(),
});

export type IncidentInput = z.infer<typeof incidentSchema>;
