import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Card, Badge, Button } from "@/components/ui";
import { ModernTable, ModernTableHeader, ModernTableBody, ModernTableRow, ModernTableCell } from "@/components/modern-table";
import { format } from "date-fns";
import { FileText, Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EmployeeLogsPage({ params }: { params: { id: string } }) {
  await requireRole("admin");
  const { id } = await params;
  const supabase = await createClient();

  // Fetch employee details
  const { data: employee } = await supabase
    .from("users")
    .select("name, employee_id")
    .eq("id", id)
    .maybeSingle();

  if (!employee) {
    return notFound();
  }

  // Fetch logs
  const { data: logs } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", id)
    .order("date", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/employees">
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <FileText size={32} className="text-blue-500" />
            Daily Logs
          </h1>
          <p className="text-slate-400">
            Viewing history for <span className="font-semibold text-blue-400">{employee.name}</span> ({employee.employee_id})
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {(logs ?? []).length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <FileText size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No logs submitted yet.</p>
            <p className="text-sm">This employee hasn't logged any daily updates.</p>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 shadow-xl">
            <ModernTable>
              <ModernTableHeader>
                <tr>
                  <ModernTableCell header>Date</ModernTableCell>
                  <ModernTableCell header>Task Title</ModernTableCell>
                  <ModernTableCell header>Description</ModernTableCell>
                  <ModernTableCell header>Hours</ModernTableCell>
                  <ModernTableCell header>Status</ModernTableCell>
                </tr>
              </ModernTableHeader>
              <ModernTableBody>
                {(logs ?? []).map((log, idx) => (
                  <ModernTableRow key={log.id} index={idx}>
                    <ModernTableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Calendar size={14} className="text-purple-400" />
                        {format(new Date(log.date), "MMM dd, yyyy")}
                      </div>
                    </ModernTableCell>
                    <ModernTableCell className="font-bold text-slate-100 italic">
                      {log.task_title}
                    </ModernTableCell>
                    <ModernTableCell className="max-w-md">
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {log.description || "-"}
                      </p>
                    </ModernTableCell>
                    <ModernTableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={14} className="text-blue-400" />
                        {log.hours_spent}h
                      </div>
                    </ModernTableCell>
                    <ModernTableCell>
                      <Badge variant={log.status === "Completed" ? "success" : "info"}>
                        {log.status}
                      </Badge>
                    </ModernTableCell>
                  </ModernTableRow>
                ))}
              </ModernTableBody>
            </ModernTable>
          </div>
        )}
      </div>
    </div>
  );
}
