import { z } from "zod";

import { DEPLOY_ENVIRONMENTS } from "@/constants/enums";

export const deploymentSchema = z.object({
  version: z.string().min(1, "Version is required").max(100),
  environment: z.enum(DEPLOY_ENVIRONMENTS),
  projectId: z.string().min(1, "Project is required"),
  commitHash: z.string().max(64).optional(),
  releaseNotes: z.string().max(2000).optional(),
  success: z.boolean(),
  // When set, this deployment is a rollback of the referenced one.
  rollbackOfId: z.string().optional(),
});

export type DeploymentInput = z.infer<typeof deploymentSchema>;
