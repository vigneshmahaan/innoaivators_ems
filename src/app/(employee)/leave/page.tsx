import { requireRole } from "@/lib/auth";
import { getEmployeeLeaveData } from "@/lib/data";
import { LeaveRequestClient } from "@/components/leave-request-client";
import { Calendar } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Leave Requests" };

export default async function LeavePage() {
  const user = await requireRole("employee");
  const leaves = await getEmployeeLeaveData(user.id);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
          >
            <Calendar size={22} />
          </div>
          <div>
            <h1 className="page-title">Leave Requests</h1>
            <p className="page-subtitle">Apply for leave and track your requests</p>
          </div>
        </div>
      </div>
      <LeaveRequestClient leaves={leaves} />
    </div>
  );
}
