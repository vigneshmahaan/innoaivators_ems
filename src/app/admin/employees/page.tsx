import { resetPasswordAction } from "@/app/actions";
import { AddEmployeeForm } from "@/components/add-employee-form";
import { Button, Card, Input, Badge } from "@/components/ui";
import { ModernTable, ModernTableHeader, ModernTableBody, ModernTableRow, ModernTableCell } from "@/components/modern-table";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminEmployeesPage() {
  await requireRole("admin");
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("users")
    .select("id,employee_id,name,email,role,department,status")
    .order("name");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Employee Management</h1>
      <Card>
        <h2 className="mb-4 text-lg font-semibold">Add Employee</h2>
        <AddEmployeeForm />
      </Card>
      <div>
        <h2 className="mb-4 text-lg font-semibold">Employees</h2>
        <ModernTable>
          <ModernTableHeader>
            <tr>
              <ModernTableCell header>ID</ModernTableCell>
              <ModernTableCell header>Name</ModernTableCell>
              <ModernTableCell header>Email</ModernTableCell>
              <ModernTableCell header>Department</ModernTableCell>
              <ModernTableCell header>Status</ModernTableCell>
              <ModernTableCell header>Reset Password</ModernTableCell>
            </tr>
          </ModernTableHeader>
          <ModernTableBody>
            {(users ?? []).map((u, idx) => (
              <ModernTableRow key={u.id} index={idx}>
                <ModernTableCell>{u.employee_id}</ModernTableCell>
                <ModernTableCell>{u.name}</ModernTableCell>
                <ModernTableCell className="text-xs">{u.email}</ModernTableCell>
                <ModernTableCell>{u.department || "-"}</ModernTableCell>
                <ModernTableCell>
                  <Badge variant={u.status === "active" ? "success" : "error"}>
                    {u.status}
                  </Badge>
                </ModernTableCell>
                <ModernTableCell>
                  <form action={resetPasswordAction} className="flex gap-2">
                    <input type="hidden" name="user_id" value={u.id} />
                    <Input name="new_password" placeholder="New password" required className="h-8 text-xs" />
                    <Button type="submit" variant="outline" size="sm">Reset</Button>
                  </form>
                </ModernTableCell>
              </ModernTableRow>
            ))}
          </ModernTableBody>
        </ModernTable>
      </div>
    </div>
  );
}
