import type { Metadata } from "next";
import { Boxes, Pencil, Plus } from "lucide-react";

import { deleteWorkspaceAction } from "@/actions/workspace.actions";
import { PageHeader } from "@/components/layout/page-header";
import { DbOfflineBanner } from "@/components/shared/db-offline-banner";
import { DeleteButton } from "@/components/shared/delete-button";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkspaceFormDialog } from "@/features/workspaces/components/workspace-form-dialog";
import { safeQuery } from "@/lib/safe-query";
import { listWorkspacesWithCounts } from "@/repositories/workspace.repository";
import { formatDate } from "@/utils/format";

export const metadata: Metadata = { title: "Workspaces" };

export const dynamic = "force-dynamic";

export default async function WorkspacesPage() {
  const workspaces = await safeQuery(() => listWorkspacesWithCounts(), []);

  return (
    <>
      <PageHeader
        title="Workspaces"
        description="Work environments — office, freelance, personal, open source"
      >
        <WorkspaceFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" />
              New Workspace
            </Button>
          }
        />
      </PageHeader>
      <main className="flex flex-col gap-6 p-4 md:p-6">
        {!workspaces.ok ? <DbOfflineBanner /> : null}

        {workspaces.data.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title="No workspaces yet"
            description="Workspaces group your clients and projects. Start with one — e.g. Office or Personal."
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Projects</TableHead>
                  <TableHead className="text-right">Clients</TableHead>
                  <TableHead className="text-right">Created</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaces.data.map((workspace) => (
                  <TableRow key={workspace.id}>
                    <TableCell className="font-medium">
                      {workspace.name}
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={workspace.type} />
                    </TableCell>
                    <TableCell className="max-w-64 truncate text-muted-foreground">
                      {workspace.description ?? "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {workspace._count.projects}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {workspace._count.clients}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDate(workspace.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end">
                        <WorkspaceFormDialog
                          workspace={workspace}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Edit workspace"
                            >
                              <Pencil className="size-4 text-muted-foreground" />
                            </Button>
                          }
                        />
                        <DeleteButton
                          action={deleteWorkspaceAction.bind(
                            null,
                            workspace.id
                          )}
                          title="Delete workspace?"
                          description={`"${workspace.name}" and everything in it (clients, projects, tasks) will be permanently removed.`}
                        />
                      </div>
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
