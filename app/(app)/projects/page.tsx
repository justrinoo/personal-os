import type { Metadata } from "next";
import { FolderKanban, Pencil, Plus } from "lucide-react";

import { deleteProjectAction } from "@/actions/project.actions";
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
import { ClickUpCell } from "@/features/clickup/components/clickup-cell";
import { DiscoverButton } from "@/features/clickup/components/discover-button";
import { ProjectFormDialog } from "@/features/projects/components/project-form-dialog";
import { safeQuery } from "@/lib/safe-query";
import { listProjects } from "@/repositories/project.repository";
import { listWorkspaceOptions } from "@/repositories/workspace.repository";
import { formatDate } from "@/utils/format";

export const metadata: Metadata = { title: "Projects" };

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [projects, workspaces] = await Promise.all([
    safeQuery(() => listProjects(), []),
    safeQuery(() => listWorkspaceOptions(), []),
  ]);

  return (
    <>
      <PageHeader
        title="Projects"
        description="Every software project across your workspaces"
      >
        <DiscoverButton />
        <ProjectFormDialog
          workspaces={workspaces.data}
          trigger={
            <Button size="sm">
              <Plus className="size-4" />
              New Project
            </Button>
          }
        />
      </PageHeader>
      <main className="flex flex-col gap-6 p-4 md:p-6">
        {!projects.ok ? <DbOfflineBanner /> : null}

        {projects.data.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to start tracking features, tasks, and deployments."
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Tasks</TableHead>
                  <TableHead>ClickUp</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.data.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.name}
                    </TableCell>
                    <TableCell>{project.workspace.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {project.client?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={project.status} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {project._count.tasks}
                    </TableCell>
                    <TableCell>
                      <ClickUpCell
                        projectId={project.id}
                        listId={project.clickupListId}
                        listName={project.clickupListName}
                        syncedAt={project.clickupSyncedAt}
                      />
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDate(project.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end">
                        <ProjectFormDialog
                          workspaces={workspaces.data}
                          project={project}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Edit project"
                            >
                              <Pencil className="size-4 text-muted-foreground" />
                            </Button>
                          }
                        />
                        <DeleteButton
                          action={deleteProjectAction.bind(null, project.id)}
                          title="Delete project?"
                          description={`"${project.name}" and its sprints, features, tasks, and deployments will be permanently removed.`}
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
