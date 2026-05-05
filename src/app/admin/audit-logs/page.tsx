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
      <AuditLogsClient logs={logs} />
    </div>
  );
}
