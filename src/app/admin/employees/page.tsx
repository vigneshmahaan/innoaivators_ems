import { requireRole } from "@/lib/auth";
import { getAdminEmployeeList } from "@/lib/data";
import { EmployeeManagementClient } from "@/components/employee-management-client";
import { getDepartments } from "@/services/employee-service";
import { Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Employees — Admin" };

export default async function AdminEmployeesPage() {
  await requireRole("admin");
  const [users, departments] = await Promise.all([
    getAdminEmployeeList(),
    getDepartments()
  ]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="page-header flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "var(--brand-dim)", color: "var(--brand)" }}
          >
            <Users size={22} />
          </div>
          <div>
            <h1 className="page-title">Employee Management</h1>
            <p className="page-subtitle">
              {users.length} employee{users.length !== 1 ? "s" : ""} in your organization
            </p>
          </div>
        </div>
      </div>

      <EmployeeManagementClient users={users} departments={departments} />
    </div>
  );
}
