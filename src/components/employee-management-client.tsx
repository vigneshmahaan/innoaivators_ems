"use client";

import { useState } from "react";
import { ModernTable, ModernTableHeader, ModernTableBody, ModernTableRow, ModernTableCell } from "@/components/modern-table";
import { Badge, Button, Input } from "@/components/ui";
import { AssignTaskModal } from "@/components/assign-task-modal";
import { resetPasswordAction } from "@/app/actions";
import Link from "next/link";
import { ClipboardList, ExternalLink, KeyRound } from "lucide-react";

interface User {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
}

export function EmployeeManagementClient({ users }: { users: User[] }) {
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 shadow-xl">
        <ModernTable>
          <ModernTableHeader>
            <tr>
              <ModernTableCell header>ID</ModernTableCell>
              <ModernTableCell header>Name</ModernTableCell>
              <ModernTableCell header>Department</ModernTableCell>
              <ModernTableCell header>Status</ModernTableCell>
              <ModernTableCell header>Quick Actions</ModernTableCell>
              <ModernTableCell header>Security</ModernTableCell>
            </tr>
          </ModernTableHeader>
          <ModernTableBody>
            {(users ?? []).map((u, idx) => (
              <ModernTableRow key={u.id} index={idx}>
                <ModernTableCell className="font-mono text-xs">{u.employee_id}</ModernTableCell>
                <ModernTableCell className="font-semibold">{u.name}</ModernTableCell>
                <ModernTableCell>{u.department || "-"}</ModernTableCell>
                <ModernTableCell>
                  <Badge variant={u.status === "active" ? "success" : "error"}>
                    {u.status}
                  </Badge>
                </ModernTableCell>
                <ModernTableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 text-xs border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      onClick={() => setSelectedEmployee(u)}
                    >
                      <ClipboardList size={14} className="mr-1" />
                      Assign Task
                    </Button>
                    <Link href={`/admin/employees/${u.id}/logs`}>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 text-xs text-slate-400 hover:text-white"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Logs
                      </Button>
                    </Link>
                  </div>
                </ModernTableCell>
                <ModernTableCell>
                  <form action={resetPasswordAction} className="flex gap-2">
                    <input type="hidden" name="user_id" value={u.id} />
                    <Input name="new_password" placeholder="New pass" required className="h-8 text-[10px] w-24" />
                    <Button type="submit" variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <KeyRound size={14} />
                    </Button>
                  </form>
                </ModernTableCell>
              </ModernTableRow>
            ))}
          </ModernTableBody>
        </ModernTable>
      </div>

      <AssignTaskModal 
        employeeId={selectedEmployee?.id || ""}
        employeeName={selectedEmployee?.name || ""}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
}
