import type { Metadata } from "next";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Ticket } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { DbOfflineBanner } from "@/components/shared/db-offline-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SyncAllButton } from "@/features/clickup/components/sync-all-button";
import { TicketPrioritySelect } from "@/features/clickup/components/ticket-priority-select";
import { TicketStatusMenu } from "@/features/clickup/components/ticket-status-menu";
import { safeQuery } from "@/lib/safe-query";
import {
  listClickUpTickets,
  listLinkedProjects,
} from "@/repositories/clickup.repository";
import { formatDate } from "@/utils/format";

export const metadata: Metadata = { title: "ClickUp" };

export const dynamic = "force-dynamic";

export default async function ClickUpPage() {
  const [tickets, linkedProjects] = await Promise.all([
    safeQuery(() => listClickUpTickets(), []),
    safeQuery(() => listLinkedProjects(), []),
  ]);

  return (
    <>
      <PageHeader
        title="ClickUp"
        description={
          linkedProjects.data.length > 0
            ? `${tickets.data.length} tickets from ${linkedProjects.data.length} linked list(s) — changes here push to ClickUp`
            : "Your ClickUp tickets, managed from Personal OS"
        }
      >
        <SyncAllButton />
      </PageHeader>
      <main className="flex flex-col gap-6 p-4 md:p-6">
        {!tickets.ok ? <DbOfflineBanner /> : null}

        {tickets.data.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title={
              linkedProjects.data.length === 0
                ? "No ClickUp lists linked"
                : "No tickets synced yet"
            }
            description={
              linkedProjects.data.length === 0
                ? "Link a ClickUp list to a project from the Projects page, then sync."
                : 'Hit "Sync all" to pull your tickets from ClickUp.'
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>ClickUp Status</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Due</TableHead>
                  <TableHead className="text-right">Changed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.data.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="max-w-80 font-medium">
                      <span className="inline-flex max-w-full items-center gap-1.5">
                        <span className="truncate">{ticket.title}</span>
                        {ticket.clickupUrl ? (
                          <a
                            href={ticket.clickupUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="Open in ClickUp"
                            className="shrink-0 text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        ) : null}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {ticket.project?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <TicketStatusMenu
                        taskId={ticket.id}
                        currentStatus={ticket.clickupStatus}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={ticket.status} />
                    </TableCell>
                    <TableCell>
                      <TicketPrioritySelect
                        taskId={ticket.id}
                        currentPriority={ticket.priority}
                      />
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {ticket.dueDate ? formatDate(ticket.dueDate) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {ticket.clickupRemoteUpdatedAt
                        ? formatDistanceToNow(ticket.clickupRemoteUpdatedAt, {
                            addSuffix: true,
                          })
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </>
  );
}
