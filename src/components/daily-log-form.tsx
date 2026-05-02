"use client";

import { useActionState } from "react";
import { Card, Input, Select, Textarea } from "@/components/ui";
import { submitDailyLogAction } from "@/app/actions";
import { AlertTriangle, CheckCircle } from "lucide-react";

export function DailyLogForm() {
  const [state, formAction, isPending] = useActionState(submitDailyLogAction, {});

  return (
    <Card>
      <form action={formAction} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm">Task title</label>
          <Input name="task_title" required disabled={isPending} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Description</label>
          <Textarea name="description" disabled={isPending} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Status</label>
          <Select name="status" disabled={isPending}>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm">Hours spent</label>
          <Input name="hours_spent" type="number" min="0.1" step="0.5" required disabled={isPending} />
        </div>

        {state.error && (
          <div className="alert alert-error text-xs flex items-center gap-2">
            <AlertTriangle size={14} /> {state.error}
          </div>
        )}
        {state.success && (
          <div className="alert alert-success text-xs flex items-center gap-2">
            <CheckCircle size={14} /> Log submitted successfully!
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? <span className="spinner" /> : "Submit Log"}
        </button>
      </form>
    </Card>
  );
}
