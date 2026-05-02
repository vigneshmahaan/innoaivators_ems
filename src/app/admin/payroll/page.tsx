import { requireRole } from "@/lib/auth";
import { getAdminEmployeeList } from "@/lib/data";
import { getSalaryComponents } from "@/services/payroll-service";
import { PayrollClient } from "@/components/payroll-client";

export default async function AdminPayrollPage() {
  await requireRole("admin");
  const [employees, components] = await Promise.all([
    getAdminEmployeeList(),
    getSalaryComponents(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Payroll
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Manage salary components and process payroll
        </p>
      </div>
      <PayrollClient employees={employees} components={components} />
    </div>
  );
}
