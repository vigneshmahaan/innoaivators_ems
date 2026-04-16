import { AttendanceButtons } from "@/components/attendance-buttons";
import { Card } from "@/components/ui";
import { ModernTable, ModernTableHeader, ModernTableBody, ModernTableRow, ModernTableCell } from "@/components/modern-table";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AttendancePage() {
  const user = await requireRole("employee");
  const supabase = await createClient();
  const { data } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance</h1>
      <Card>
        <AttendanceButtons />
      </Card>
      <ModernTable>
        <ModernTableHeader>
          <tr>
            <ModernTableCell header>Date</ModernTableCell>
            <ModernTableCell header>Login</ModernTableCell>
            <ModernTableCell header>Logout</ModernTableCell>
            <ModernTableCell header>Total Hours</ModernTableCell>
          </tr>
        </ModernTableHeader>
        <ModernTableBody>
          {(data ?? []).map((row, idx) => (
            <ModernTableRow key={row.id} index={idx}>
              <ModernTableCell>{row.date}</ModernTableCell>
              <ModernTableCell>{row.login_time ?? "-"}</ModernTableCell>
              <ModernTableCell>{row.logout_time ?? "-"}</ModernTableCell>
              <ModernTableCell>{row.total_hours ?? 0}</ModernTableCell>
            </ModernTableRow>
          ))}
        </ModernTableBody>
      </ModernTable>
    </div>
  );
}
