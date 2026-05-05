import { requireRole } from "@/lib/auth";
import { getAdminLeaveRequests } from "@/lib/data";
import { AdminLeavesClient } from "@/components/admin-leaves-client";
import { Calendar } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Leave Requests — Admin" };

export default async function AdminLeavesPage() {
  await requireRole("admin");
  const leaves = await getAdminLeaveRequests();

  const pending = leaves.filter((l) => l.status === "Pending").length;

  return (
    <div className="flex flex-col gap-10 animate-fade-up">
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
          >
            <Calendar size={22} />
          </div>
          <div>
            <h1 className="page-title">Leave Requests</h1>
            <p className="page-subtitle">
              {pending > 0 ? `${pending} pending approval` : "All caught up!"}
            </p>
          </div>
        </div>
        {pending > 0 && (
          <span
            className="rounded-full px-3 py-1 text-sm font-bold"
            style={{ background: "var(--warning-dim)", color: "var(--warning)" }}
          >
            {pending} Pending
          </span>
        )}
      </div>

      <AdminLeavesClient leaves={leaves} />
    </div>
  );
}
