"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createDeploymentAction } from "@/actions/deployment.actions";
import { FieldError } from "@/components/shared/field-error";
import { EnumSelect } from "@/components/shared/enum-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEPLOY_ENVIRONMENTS } from "@/constants/enums";
import {
  deploymentSchema,
  type DeploymentInput,
} from "@/schemas/deployment.schema";
import { formatEnumLabel } from "@/utils/format";

interface ProjectOption {
  id: string;
  name: string;
}

interface RollbackTarget {
  id: string;
  version: string;
  environment: string;
  projectId: string;
}

interface DeploymentFormDialogProps {
  projects: ProjectOption[];
  rollbackTargets: RollbackTarget[];
  trigger: React.ReactNode;
}

const NONE = "__none__";

export function DeploymentFormDialog({
  projects,
  rollbackTargets,
  trigger,
}: DeploymentFormDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeploymentInput>({
    resolver: zodResolver(deploymentSchema),
    defaultValues: {
      version: "",
      environment: "PRODUCTION",
      projectId: "",
      commitHash: "",
      releaseNotes: "",
      success: true,
      rollbackOfId: "",
    },
  });

  const selectedProject = watch("projectId");
  const targets = rollbackTargets.filter(
    (target) => target.projectId === selectedProject
  );

  async function onSubmit(values: DeploymentInput) {
    const result = await createDeploymentAction(values);
    if (result.ok) {
      toast.success("Deployment recorded");
      setOpen(false);
      reset();
    } else {
      toast.error(result.error ?? "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Deployment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Project</Label>
              <Controller
                control={control}
                name="projectId"
                render={({ field }) => (
                  <EnumSelect
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    options={projects.map((project) => ({
                      value: project.id,
                      label: project.name,
                    }))}
                  />
                )}
              />
              <FieldError message={errors.projectId?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Environment</Label>
              <Controller
                control={control}
                name="environment"
                render={({ field }) => (
                  <EnumSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={DEPLOY_ENVIRONMENTS}
                  />
                )}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="deploy-version">Version</Label>
              <Input
                id="deploy-version"
                {...register("version")}
                placeholder="v1.2.0"
              />
              <FieldError message={errors.version?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="deploy-commit">Commit hash</Label>
              <Input
                id="deploy-commit"
                {...register("commitHash")}
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Result</Label>
              <Controller
                control={control}
                name="success"
                render={({ field }) => (
                  <EnumSelect
                    value={field.value ? "true" : "false"}
                    onChange={(value) => field.onChange(value === "true")}
                    options={[
                      { value: "true", label: "Success" },
                      { value: "false", label: "Failed" },
                    ]}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Rollback of</Label>
              <Controller
                control={control}
                name="rollbackOfId"
                render={({ field }) => (
                  <EnumSelect
                    value={field.value || NONE}
                    onChange={(value) =>
                      field.onChange(value === NONE ? "" : value)
                    }
                    options={[
                      { value: NONE, label: "Not a rollback" },
                      ...targets.map((target) => ({
                        value: target.id,
                        label: `${target.version} (${formatEnumLabel(target.environment)})`,
                      })),
                    ]}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="deploy-notes">Release notes</Label>
            <Textarea
              id="deploy-notes"
              {...register("releaseNotes")}
              placeholder="Optional"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Record deployment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
