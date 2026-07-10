import { z } from "zod";

import { PROJECT_STATUSES } from "@/constants/enums";

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(1000).optional(),
  status: z.enum(PROJECT_STATUSES),
  workspaceId: z.string().min(1, "Workspace is required"),
  repositoryUrl: z
    .union([z.url("Must be a valid URL"), z.literal("")])
    .optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
