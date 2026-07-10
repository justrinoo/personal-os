import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";

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
import { safeQuery } from "@/lib/safe-query";
import { listProjects } from "@/repositories/project.repository";
import { formatDate } from "@/utils/format";

export const metadata: Metadata = { title: "Projects" };

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await safeQuery(() => listProjects(), []);

  return (
    <>
      <PageHeader
        title="Projects"
        description="Every software project across your workspaces"
      />
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
                  <TableHead className="text-right">Features</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
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
                    <TableCell className="text-right tabular-nums">
                      {project._count.features}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDate(project.updatedAt)}
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
