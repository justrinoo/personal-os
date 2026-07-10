import { z } from "zod";

import { JOURNAL_TYPES } from "@/constants/enums";

const entryField = z.string().max(2000).optional();

export const journalSchema = z
  .object({
    type: z.enum(JOURNAL_TYPES),
    // From <input type="date">.
    date: z.string().min(1, "Date is required"),
    // Morning
    goals: entryField,
    focus: entryField,
    // Night
    reflection: entryField,
    wins: entryField,
    problems: entryField,
    lessons: entryField,
    tomorrow: entryField,
  })
  .refine(
    (entry) =>
      entry.type === "MORNING"
        ? Boolean(entry.goals?.trim() || entry.focus?.trim())
        : Boolean(
            entry.reflection?.trim() ||
              entry.wins?.trim() ||
              entry.problems?.trim() ||
              entry.lessons?.trim() ||
              entry.tomorrow?.trim()
          ),
    { message: "Write at least one field", path: ["type"] }
  );

export type JournalInput = z.infer<typeof journalSchema>;
