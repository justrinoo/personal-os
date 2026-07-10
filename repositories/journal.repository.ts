import { prisma } from "@/lib/prisma";
import type {
  JournalEntry,
  JournalType,
} from "@/lib/generated/prisma/client";

export function listJournalEntries(limit?: number): Promise<JournalEntry[]> {
  return prisma.journalEntry.findMany({
    orderBy: { date: "desc" },
    take: limit,
  });
}

export interface JournalData {
  type: JournalType;
  date: Date;
  goals: string | null;
  focus: string | null;
  reflection: string | null;
  wins: string | null;
  problems: string | null;
  lessons: string | null;
  tomorrow: string | null;
}

export function createJournalEntry(data: JournalData): Promise<JournalEntry> {
  return prisma.journalEntry.create({ data });
}

export function deleteJournalEntry(id: string): Promise<JournalEntry> {
  return prisma.journalEntry.delete({ where: { id } });
}
