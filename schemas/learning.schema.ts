import { z } from "zod";

import { LEARNING_STATUSES, LEARNING_TYPES } from "@/constants/enums";

export const learningSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  type: z.enum(LEARNING_TYPES),
  status: z.enum(LEARNING_STATUSES),
  sourceUrl: z.string().max(500).optional(),
  progress: z.coerce.number<number>().int().min(0).max(100),
  startedAt: z.string().optional(),
  finishedAt: z.string().optional(),
  notes: z.string().max(2000).optional(),
  issuer: z.string().max(200).optional(),
  credentialUrl: z.string().max(500).optional(),
  expiresAt: z.string().optional(),
  projectId: z.string().optional(),
});

export type LearningInput = z.infer<typeof learningSchema>;
