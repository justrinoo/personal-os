"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createIncidentAction } from "@/actions/monitoring.actions";
import { EnumSelect } from "@/components/shared/enum-select";
import { FieldError } from "@/components/shared/field-error";
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
import { INCIDENT_SEVERITIES } from "@/constants/enums";
import { incidentSchema, type IncidentInput } from "@/schemas/incident.schema";

interface Option {
  id: string;
  name: string;
}

interface IncidentFormDialogProps {
  monitors: Option[];
  projects: Option[];
  trigger: React.ReactNode;
}

const NONE = "__none__";

export function IncidentFormDialog({
  monitors,
  projects,
  trigger,
}: IncidentFormDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IncidentInput>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      title: "",
      severity: "MEDIUM",
      cause: "",
      monitorId: "",
      projectId: "",
      deploymentId: "",
    },
  });

  async function onSubmit(values: IncidentInput) {
    const result = await createIncidentAction(values);
    if (result.ok) {
      toast.success("Incident opened");
      setOpen(false);
      reset();
    } else {
      toast.error(result.error ?? "Something went wrong");
    }
  }

  function optional(options: Option[], placeholder: string) {
    return [
      { value: NONE, label: placeholder },
      ...options.map((option) => ({ value: option.id, label: option.name })),
    ];
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Open Incident</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="incident-title">Title</Label>
            <Input
              id="incident-title"
              {...register("title")}
              placeholder="API returns 500 on login"
            />
            <FieldError message={errors.title?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Severity</Label>
              <Controller
                control={control}
                name="severity"
                render={({ field }) => (
                  <EnumSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={INCIDENT_SEVERITIES}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Monitor</Label>
              <Controller
                control={control}
                name="monitorId"
                render={({ field }) => (
                  <EnumSelect
                    value={field.value || NONE}
                    onChange={(value) =>
                      field.onChange(value === NONE ? "" : value)
                    }
                    options={optional(monitors, "No monitor")}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Project</Label>
            <Controller
              control={control}
              name="projectId"
              render={({ field }) => (
                <EnumSelect
                  value={field.value || NONE}
                  onChange={(value) =>
                    field.onChange(value === NONE ? "" : value)
                  }
                  options={optional(projects, "No project")}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="incident-cause">Cause / notes</Label>
            <Textarea
              id="incident-cause"
              {...register("cause")}
              placeholder="Optional"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Open incident"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
