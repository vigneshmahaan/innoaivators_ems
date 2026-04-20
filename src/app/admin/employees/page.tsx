import { AddEmployeeForm } from "@/components/add-employee-form";
import { Card } from "@/components/ui";
import { EmployeeManagementClient } from "@/components/employee-management-client";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminEmployeesPage() {
  await requireRole("admin");
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("users")
    .select("id,employee_id,name,email,role,department,status")
    .eq("role", "employee")
    .order("name");

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-100">
          Employee Management
        </h1>
        <p className="text-slate-400">Add, manage and assign tasks to your workforce.</p>
      </div>

      <Card className="border-blue-500/20 bg-blue-500/5">
        <h2 className="mb-4 text-xl font-bold text-slate-100">Add New Employee</h2>
        <AddEmployeeForm />
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">Active Employees</h2>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400 border border-slate-700">
            {users?.length || 0} Total
          </span>
        </div>
        <EmployeeManagementClient users={users || []} />
      </div>
    </div>
  );
}
