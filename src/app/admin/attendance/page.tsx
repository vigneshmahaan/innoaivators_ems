import { Card, Input } from "@/components/ui";
import { ModernTable, ModernTableHeader, ModernTableBody, ModernTableRow, ModernTableCell } from "@/components/modern-table";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requireRole("admin");
  const params = await searchParams;
  const selectedDate = params.date;
  const supabase = await createClient();

  let query = supabase
    .from("attendance")
    .select("id,date,login_time,logout_time,total_hours,users(name,employee_id)")
    .order("date", { ascending: false })
    .limit(100);
  if (selectedDate) query = query.eq("date", selectedDate);
  const { data } = await query;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance Monitoring</h1>
      <Card>
        <form className="flex gap-2">
          <Input type="date" name="date" defaultValue={selectedDate} />
        </form>
      </Card>
      <ModernTable>
        <ModernTableHeader>
          <tr>
            <ModernTableCell header>Date</ModernTableCell>
            <ModernTableCell header>Employee</ModernTableCell>
            <ModernTableCell header>Login</ModernTableCell>
            <ModernTableCell header>Logout</ModernTableCell>
            <ModernTableCell header>Hours</ModernTableCell>
          </tr>
        </ModernTableHeader>
        <ModernTableBody>
          {(data ?? []).map((row, idx) => (
            <ModernTableRow key={row.id} index={idx}>
              <ModernTableCell>{row.date}</ModernTableCell>
              <ModernTableCell>{(row.users as { name?: string })?.name ?? "-"}</ModernTableCell>
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
