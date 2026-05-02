import { requireRole } from "@/lib/auth";
import { getDesignations, getDepartments } from "@/services/employee-service";
import { DesignationsClient } from "@/components/designations-client";

export default async function AdminDesignationsPage() {
  await requireRole("admin");
  const [designations, departments] = await Promise.all([
    getDesignations(),
    getDepartments(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Designations
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Manage job titles and positions
        </p>
      </div>
      <DesignationsClient designations={designations} departments={departments} />
    </div>
  );
}
