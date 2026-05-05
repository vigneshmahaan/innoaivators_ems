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
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>Attendance Monitoring</h1>
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Admin Panel / Attendance
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>Filter by Date:</span>
          <form className="flex gap-2">
            <div className="w-full" style={{ maxWidth: '220px' }}>
              <Input type="date" name="date" defaultValue={selectedDate} className="input" />
            </div>
          </form>
        </div>
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
          {data && data.length > 0 ? (
            data.map((row, idx) => (
              <ModernTableRow key={row.id} index={idx}>
                <ModernTableCell>{row.date}</ModernTableCell>
                <ModernTableCell>{(row.users as { name?: string })?.name ?? "-"}</ModernTableCell>
                <ModernTableCell>{row.login_time ?? "-"}</ModernTableCell>
                <ModernTableCell>{row.logout_time ?? "-"}</ModernTableCell>
                <ModernTableCell>{row.total_hours ?? 0}</ModernTableCell>
              </ModernTableRow>
            ))
          ) : (
            <ModernTableRow index={0}>
              <ModernTableCell className="text-center py-12" colSpan={5}>
                <div className="text-slate-500 italic">No attendance records found for this date.</div>
              </ModernTableCell>
            </ModernTableRow>
          )}
        </ModernTableBody>
      </ModernTable>
    </div>
  );
}
