import { prisma } from "@/lib/prisma";
import type { JournalEntry } from "@/lib/generated/prisma/client";

export function listJournalEntries(limit?: number): Promise<JournalEntry[]> {
  return prisma.journalEntry.findMany({
    orderBy: { date: "desc" },
    take: limit,
  });
}
