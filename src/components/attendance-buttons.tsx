"use client";

import { useActionState } from "react";
import { startWorkAction, endWorkAction } from "@/app/actions";
import { Button } from "@/components/ui";

const initialState: { error?: string } = {};

export function AttendanceButtons() {
  const [startState, startFormAction, startPending] = useActionState(startWorkAction, initialState);
  const [endState, endFormAction, endPending] = useActionState(endWorkAction, initialState);

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <form action={startFormAction} className="flex-1">
          <Button disabled={startPending} type="submit" className="w-full">
            {startPending ? "Starting..." : "Start Work"}
          </Button>
        </form>
        <form action={endFormAction} className="flex-1">
          <Button disabled={endPending} type="submit" variant="outline" className="w-full">
            {endPending ? "Ending..." : "End Work"}
          </Button>
        </form>
      </div>
      {startState.error && <p className="text-sm text-red-600">{startState.error}</p>}
      {endState.error && <p className="text-sm text-red-600">{endState.error}</p>}
    </div>
  );
}
