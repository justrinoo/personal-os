import { z } from "zod";

import { WORKSPACE_TYPES } from "@/constants/enums";

export const workspaceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: z.enum(WORKSPACE_TYPES),
  description: z.string().max(500).optional(),
});

export type WorkspaceInput = z.infer<typeof workspaceSchema>;
