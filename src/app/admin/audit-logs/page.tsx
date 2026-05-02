import { requireRole } from "@/lib/auth";
import { getAuditLogs } from "@/services/audit-service";
import { AuditLogsClient } from "@/components/audit-logs-client";
import { ClipboardList } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Audit Logs — Admin" };

export default async function AdminAuditLogsPage() {
  await requireRole("admin");
  const logs = await getAuditLogs({ limit: 200 });

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "var(--info-dim)", color: "var(--info)" }}
          >
            <ClipboardList size={22} />
          </div>
          <div>
            <h1 className="page-title">Audit Logs</h1>
            <p className="page-subtitle">
              {logs.length} log{logs.length !== 1 ? "s" : ""} recorded
            </p>
          </div>
        </div>
      </div>

      <AuditLogsClient logs={logs} />
    </div>
  );
}
