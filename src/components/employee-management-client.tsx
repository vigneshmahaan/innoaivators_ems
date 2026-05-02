"use client";

import { useState, useTransition, useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, KeyRound, UserPlus, Search, Building2,
  Mail, Phone, CheckCircle, XCircle, Eye, X, ChevronDown,
  AlertTriangle, Briefcase, Calendar, User, FileText, History
} from "lucide-react";
import { createEmployeeAction, resetPasswordAction, updateEmployeeStatusAction } from "@/app/actions/auth";
import { AssignTaskModal } from "@/components/assign-task-modal";
import { getOnboardingItems, getEmploymentHistory } from "@/services/employee-service";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";
import type { UserProfile } from "@/lib/types";

const DEPARTMENTS = [
  "HR", "Finance", "IT", "Sales", "Marketing",
  "Operations", "Customer Service", "Legal", "Product", "Design",
];

function AddEmployeeModal({ onClose, departments }: { onClose: () => void; departments: string[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        className="relative z-10 w-full max-w-2xl rounded-2xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
      >
        <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--brand-dim)", color: "var(--brand)" }}>
              <UserPlus size={18} />
            </div>
            <div>
              <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>Add New Employee</h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Create a new employee account</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-icon btn-ghost" style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <form action={async (formData) => {
          startTransition(async () => {
            const result = await createEmployeeAction({}, formData);
            if (result?.error) toast.error(result.error);
            else { toast.success("Employee created successfully!"); onClose(); }
          });
        }} className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="form-group">
              <label className="label">Full Name *</label>
              <input name="name" placeholder="John Doe" required className="input" disabled={isPending} />
            </div>
            <div className="form-group">
              <label className="label">Employee ID *</label>
              <input name="employee_id" placeholder="EMP-001" required className="input" disabled={isPending} />
            </div>
            <div className="form-group sm:col-span-2">
              <label className="label">Email Address *</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input type="email" name="email" placeholder="employee@company.com" required className="input pl-9" disabled={isPending} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Temporary Password *</label>
              <input type="password" name="password" placeholder="Min 8 characters" minLength={8} required className="input" disabled={isPending} />
            </div>
            <div className="form-group">
              <label className="label">Department *</label>
              <div className="relative">
                <select name="department" required className="input" disabled={isPending}>
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Position / Job Title</label>
              <div className="relative">
                <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input name="position" placeholder="e.g. Software Engineer" className="input pl-9" disabled={isPending} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Phone Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input name="phone" placeholder="+91 98765 43210" className="input pl-9" disabled={isPending} />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-3 text-xs" style={{ background: "var(--info-dim)", color: "var(--info)", border: "1px solid rgba(6,182,212,0.2)" }}>
            The employee will use this password for their first login and will be prompted to change it. Password must be at least 8 characters.
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isPending}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? <><span className="spinner" /> Creating...</> : <><UserPlus size={15} /> Create Employee</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function ResetPasswordModal({ employee, onClose }: { employee: UserProfile; onClose: () => void }) {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, {});

  if (state.success) {
    toast.success(`Password reset for ${employee.name}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <motion.div className="relative z-10 w-full max-w-sm rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-2">
            <KeyRound size={18} style={{ color: "var(--warning)" }} />
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>Reset Password</span>
          </div>
          <button onClick={onClose} className="btn btn-icon btn-ghost"><X size={16} /></button>
        </div>
        <form action={formAction} className="p-5 space-y-4">
          <input type="hidden" name="user_id" value={employee.id} />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Setting a new password for <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{employee.name}</span>.
            They will be required to change it on next login.
          </p>
          <div className="form-group">
            <label className="label">New Password *</label>
            <input type="password" name="new_password" placeholder="Min 8 characters" minLength={8} required className="input" disabled={isPending} />
          </div>
          {state.error && (
            <div className="alert alert-error text-xs">
              <AlertTriangle size={14} />
              {state.error}
            </div>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn btn-primary flex-1" disabled={isPending}>
              {isPending ? <span className="spinner" /> : <KeyRound size={14} />}
              Reset
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function EmployeeManagementClient({ users }: { users: UserProfile[] }) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState<UserProfile | null>(null);
  const [resetEmployee, setResetEmployee] = useState<UserProfile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const departments = ["All", ...Array.from(new Set(users.map((u) => u.department).filter(Boolean)))];

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !search || u.name.toLowerCase().includes(q) || u.employee_id.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchDept = deptFilter === "All" || u.department === deptFilter;
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  async function handleStatusToggle(user: UserProfile) {
    const newStatus = user.status === "active" ? "inactive" : "active";
    const formData = new FormData();
    formData.set("user_id", user.id);
    formData.set("status", newStatus);
    startTransition(async () => {
      const result = await updateEmployeeStatusAction(formData);
      if ((result as any)?.error) toast.error((result as any).error);
      else toast.success(`${user.name} marked as ${newStatus}`);
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input type="text" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" />
          </div>
          <div className="relative">
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="input pr-8" style={{ minWidth: 140 }}>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input pr-8">
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary shrink-0">
          <UserPlus size={16} /> Add Employee
        </button>
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Showing {filtered.length} of {users.length} employees
      </p>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <User size={36} className="empty-state-icon" />
          <p className="empty-state-title">No employees found</p>
          <p className="empty-state-description">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: "var(--brand-dim)", color: "var(--brand)" }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{u.name}</div>
                        <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{u.employee_id}</div>
                        {u.position && <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{u.position}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    {u.department ? (
                      <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                        <Building2 size={13} style={{ color: "var(--text-muted)" }} />
                        {u.department}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <div className="space-y-0.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                      {u.email && <div className="flex items-center gap-1"><Mail size={11} style={{ color: "var(--text-muted)" }} />{u.email}</div>}
                      {u.phone && <div className="flex items-center gap-1"><Phone size={11} style={{ color: "var(--text-muted)" }} />{u.phone}</div>}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => handleStatusToggle(u)}
                      disabled={isPending}
                      className={`badge ${u.status === "active" ? "badge-success" : "badge-danger"} cursor-pointer`}
                      title="Click to toggle status"
                    >
                      {u.status === "active" ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {u.status}
                    </button>
                  </td>
                  <td>
                    <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                      <Calendar size={11} />
                      {format(new Date(u.hire_date ?? u.created_at), "MMM yyyy")}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => setSelectedEmployee(u)} className="btn btn-sm btn-ghost" title="Assign Task" style={{ color: "var(--brand)" }}>
                        <ClipboardList size={14} />
                      </button>
                      <Link href={`/admin/employees/${u.id}/logs`}>
                        <button className="btn btn-sm btn-ghost" title="View Logs"><Eye size={14} /></button>
                      </Link>
                      <button onClick={() => setResetEmployee(u)} className="btn btn-sm btn-ghost" title="Reset Password" style={{ color: "var(--warning)" }}>
                        <KeyRound size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} departments={DEPARTMENTS} />}
        {selectedEmployee && (
          <AssignTaskModal
            employeeId={selectedEmployee.id}
            employeeName={selectedEmployee.name}
            isOpen={true}
            onClose={() => setSelectedEmployee(null)}
          />
        )}
        {resetEmployee && (
          <ResetPasswordModal employee={resetEmployee} onClose={() => setResetEmployee(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
