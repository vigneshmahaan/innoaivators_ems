import { requireRole } from "@/lib/auth";
import { getAdminEmployeeList } from "@/lib/data";
import { DocumentsClient } from "@/components/documents-client";

export default async function AdminDocumentsPage() {
  await requireRole("admin");
  const employees = await getAdminEmployeeList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Documents
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Manage employee documents and records
        </p>
      </div>
      <DocumentsClient employees={employees} />
    </div>
  );
}
