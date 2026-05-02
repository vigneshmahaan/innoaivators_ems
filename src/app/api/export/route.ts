import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const admin = createAdminClient();

    let data: unknown[] = [];
    let filename = "export.xlsx";

    switch (type) {
      case "employees": {
        const { data: employees } = await admin
          .from("users")
          .select("employee_id,name,email,department,position,phone,status,hire_date")
          .eq("role", "employee");
        data = employees ?? [];
        filename = "employees.xlsx";
        break;
      }
      case "attendance": {
        const month = searchParams.get("month") || new Date().toISOString().slice(0, 7);
        const { data: attendance } = await admin
          .from("attendance")
          .select("*, users(name,employee_id)")
          .gte("date", `${month}-01`)
          .lte("date", `${month}-31`);
        data = (attendance ?? []).map((a: Record<string, unknown>) => ({
          employee_id: (a.users as Record<string, string> | null)?.employee_id,
          name: (a.users as Record<string, string> | null)?.name,
          date: a.date,
          login_time: a.login_time,
          logout_time: a.logout_time,
          total_hours: a.total_hours,
        }));
        filename = `attendance_${month}.xlsx`;
        break;
      }
      case "tasks": {
        const { data: tasks } = await admin
          .from("tasks")
          .select("*, employee:employee_id(name,employee_id)")
          .order("assign_date", { ascending: false });
        data = (tasks ?? []).map((t: Record<string, unknown>) => ({
          title: t.title,
          employee: (t.employee as Record<string, string> | null)?.name,
          priority: t.priority,
          status: t.status,
          deadline: t.deadline,
          assign_date: t.assign_date,
        }));
        filename = "tasks.xlsx";
        break;
      }
      case "payroll": {
        const month = searchParams.get("month") || new Date().toISOString().slice(0, 7);
        const { data: payroll } = await admin
          .from("salary_records")
          .select("*, users(name,employee_id)")
          .eq("month", `${month}-01`);
        data = (payroll ?? []).map((p: Record<string, unknown>) => ({
          employee_id: (p.users as Record<string, string> | null)?.employee_id,
          name: (p.users as Record<string, string> | null)?.name,
          month: p.month,
          base_salary: p.base_salary,
          gross_salary: p.gross_salary,
          tax_amount: p.tax_amount,
          pf_amount: p.pf_amount,
          esi_amount: p.esi_amount,
          deductions: p.deductions,
          net_salary: p.net_salary,
          status: p.status,
        }));
        filename = `payroll_${month}.xlsx`;
        break;
      }
      default:
        return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Export failed" },
      { status: 500 }
    );
  }
}
