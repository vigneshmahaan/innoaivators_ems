import { requireRole } from "@/lib/auth";
import { getDepartments } from "@/services/employee-service";
import { DepartmentsClient } from "@/components/departments-client";

export default async function AdminDepartmentsPage() {
  await requireRole("admin");
  const departments = await getDepartments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Departments
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Manage organization departments
        </p>
      </div>
      <DepartmentsClient departments={departments} />
    </div>
  );
}
