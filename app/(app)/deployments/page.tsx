import type { Metadata } from "next";
import { CircleCheck, CircleX, Plus, Rocket, Undo2 } from "lucide-react";

import { deleteDeploymentAction } from "@/actions/deployment.actions";
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
import { DeploymentFormDialog } from "@/features/deployments/components/deployment-form-dialog";
import { safeQuery } from "@/lib/safe-query";
import {
  listDeployments,
} from "@/repositories/deployment.repository";
import { listProjectOptions } from "@/repositories/project.repository";
import { formatDateTime } from "@/utils/format";

export const metadata: Metadata = { title: "Deployments" };

export const dynamic = "force-dynamic";

export default async function DeploymentsPage() {
  const [deployments, projects] = await Promise.all([
    safeQuery(() => listDeployments(), []),
    safeQuery(() => listProjectOptions(), []),
  ]);

  const rollbackTargets = deployments.data.map((deployment) => ({
    id: deployment.id,
    version: deployment.version,
    environment: deployment.environment,
    projectId: deployment.projectId,
  }));

  return (
    <>
      <PageHeader
        title="Deployments"
        description="Every release across environments — recorded, never orchestrated"
      >
        <DeploymentFormDialog
          projects={projects.data}
          rollbackTargets={rollbackTargets}
          trigger={
            <Button size="sm">
              <Plus className="size-4" />
              Record
            </Button>
          }
        />
      </PageHeader>
      <main className="flex flex-col gap-6 p-4 md:p-6">
        {!deployments.ok ? <DbOfflineBanner /> : null}

        {deployments.data.length === 0 ? (
          <EmptyState
            icon={Rocket}
            title="No deployments recorded"
            description="Record releases manually or point the Coolify webhook at /api/webhooks/coolify."
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Commit</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="text-right">Deployed</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {deployments.data.map((deployment) => (
                  <TableRow key={deployment.id}>
                    <TableCell className="font-medium">
                      {deployment.project.name}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2">
                        {deployment.version}
                        {deployment.rollbackOf ? (
                          <span
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                            title={`Rollback of ${deployment.rollbackOf.version}`}
                          >
                            <Undo2 className="size-3.5" />
                            {deployment.rollbackOf.version}
                          </span>
                        ) : null}
                        {deployment.rolledBack ? (
                          <span className="text-xs text-destructive">
                            rolled back
                          </span>
                        ) : null}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={deployment.environment} />
                    </TableCell>
                    <TableCell>
                      {deployment.commitHash ? (
                        <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                          {deployment.commitHash.slice(0, 7)}
                        </code>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {deployment.success ? (
                        <span className="inline-flex items-center gap-1 text-sm text-emerald-700 dark:text-emerald-400">
                          <CircleCheck className="size-4" /> success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm text-destructive">
                          <CircleX className="size-4" /> failed
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDateTime(deployment.deployedAt)}
                    </TableCell>
                    <TableCell>
                      <DeleteButton
                        action={deleteDeploymentAction.bind(null, deployment.id)}
                        title="Delete deployment record?"
                        description={`"${deployment.version}" on ${deployment.environment.toLowerCase()} will be removed from history.`}
                      />
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
