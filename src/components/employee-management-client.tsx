"use client";

import { useState, useTransition, useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, KeyRound, UserPlus, Search, Building2,
  Mail, Phone, CheckCircle, XCircle, Eye, X, ChevronDown,
  AlertTriangle, Briefcase, Calendar, User, FileText, History,
  Fingerprint
} from "lucide-react";
import { createEmployeeAction, resetPasswordAction, updateEmployeeStatusAction } from "@/app/actions/auth";
import { AssignTaskModal } from "@/components/assign-task-modal";
import { getOnboardingItems, getEmploymentHistory } from "@/services/employee-service";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";
import type { UserProfile, Department } from "@/lib/types";

function AddEmployeeModal({ onClose, departments }: { onClose: () => void; departments: Department[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Ultra-premium Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      
      {/* Slide-over Panel */}
      <motion.div
        className="relative w-full max-w-3xl flex flex-col"
        style={{ 
          background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
          height: "100vh",
          borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "-40px 0 80px -20px rgba(0, 0, 0, 1)",
          position: "relative"
        }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 220 }}
      >
        {/* Premium Header */}
        <div className="relative px-10 py-10 shrink-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]">
                <UserPlus size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white">Onboard Talent</h2>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1 opacity-70">New Personnel Registration</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="group h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-all"
            >
              <X size={24} className="text-slate-600 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Premium Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
          <form id="add-employee-form" action={async (formData) => {
            startTransition(async () => {
              const result = await createEmployeeAction({}, formData);
              if (result?.error) toast.error(result.error);
              else { toast.success("Employee created successfully!"); onClose(); }
            });
          }} className="space-y-12">
            
            {/* CORE INFORMATION */}
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-indigo-500/80 uppercase tracking-[0.4em] whitespace-nowrap">Identity & Contact</span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-indigo-500/20 to-transparent" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="form-group">
                  <label className="premium-label">Full Legal Name</label>
                  <input name="name" placeholder="Johnathan Doe" required className="premium-input" disabled={isPending} />
                </div>
                <div className="form-group">
                  <label className="premium-label">Professional Email</label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input type="email" name="email" placeholder="john.doe@company.com" required className="premium-input premium-input-icon-left" disabled={isPending} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="premium-label">Phone Number</label>
                  <div className="relative group">
                    <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input name="phone" placeholder="+1 (555) 000-0000" className="premium-input premium-input-icon-left" disabled={isPending} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="premium-label">Corporate ID</label>
                  <div className="relative group">
                    <Fingerprint size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input name="employee_id" placeholder="EMP-XXXX" required className="premium-input premium-input-icon-left" disabled={isPending} />
                  </div>
                </div>
              </div>
            </div>

            {/* ORGANIZATIONAL PLACEMENT */}
            <div className="space-y-8 animate-fade-in stagger-1">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-[0.4em] whitespace-nowrap">Role & Placement</span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="form-group">
                  <label className="premium-label">Department Unit</label>
                  <div className="relative group">
                    <Building2 size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                    <select name="department" required className="premium-input premium-input-icon-left appearance-none bg-transparent cursor-pointer pr-12" disabled={isPending}>
                      <option value="" className="bg-[#0f172a]">Select Placement</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id} className="bg-[#0f172a]">{d.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="premium-label">Designated Title</label>
                  <div className="relative group">
                    <Briefcase size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                    <input name="position" placeholder="e.g. Lead Developer" className="premium-input premium-input-icon-left" disabled={isPending} />
                  </div>
                </div>
              </div>
            </div>

            {/* ACCESS & SECURITY */}
            <div className="space-y-8 animate-fade-in stagger-2">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-amber-500/80 uppercase tracking-[0.4em] whitespace-nowrap">Security Protocol</span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-amber-500/20 to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
                <div className="form-group">
                  <label className="premium-label">System Access Password</label>
                  <div className="relative group">
                    <KeyRound size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-400 transition-colors" />
                    <input type="password" name="password" placeholder="••••••••" minLength={8} required className="premium-input premium-input-icon-left" disabled={isPending} />
                  </div>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 flex gap-4">
                  <AlertTriangle size={20} className="text-amber-500 shrink-0" />
                  <p className="text-[11px] text-amber-500/70 leading-relaxed font-bold uppercase tracking-wider">
                    Policy: Mandatory password reset required upon initial authentication.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Premium Sticky Footer */}
        <div className="px-10 py-10 shrink-0 bg-black/40 backdrop-blur-2xl border-t border-white/5">
          <div className="flex gap-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-8 h-14 rounded-2xl border border-white/10 text-slate-400 font-bold text-sm hover:text-white hover:bg-white/5 transition-all"
              disabled={isPending}
            >
              Cancel
            </button>
            <button 
              form="add-employee-form" 
              type="submit" 
              className="flex-[2] px-8 h-14 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-[0_15px_30px_-10px_rgba(79,142,247,0.4)] hover:bg-indigo-500 hover:shadow-[0_20px_40px_-10px_rgba(79,142,247,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Personnel...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Complete Onboarding</span>
                </>
              )}
            </button>
          </div>
        </div>
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

export function EmployeeManagementClient({ 
  users, 
  departments 
}: { 
  users: UserProfile[];
  departments: Department[];
}) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState<UserProfile | null>(null);
  const [resetEmployee, setResetEmployee] = useState<UserProfile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPending, startTransition] = useTransition();

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
    <div className="flex flex-col gap-10">
      <div 
        className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div style={{ display: "flex", flex: 1, flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
          <div className="input-icon-wrapper flex-1 min-w-[200px]">
            <Search size={16} className="input-icon-left" />
            <input type="text" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="input input-with-icon" />
          </div>
          <div className="relative">
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="input" style={{ minWidth: 160, paddingRight: "2.75rem" }}>
              <option value="All">All Departments</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input" style={{ paddingRight: "2.75rem" }}>
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary shrink-0">
          <UserPlus size={18} /> Add Employee
        </button>
      </div>

      <div className="mb-2">
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)", letterSpacing: "0.02em" }}>
          Showing <span style={{ color: "var(--text-primary)" }}>{filtered.length}</span> of <span style={{ color: "var(--text-primary)" }}>{users.length}</span> employees
        </p>
      </div>

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
              {filtered.map((u, idx) => {
                const userDept = departments.find(d => d.id === u.department);
                return (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: "var(--brand-dim)", color: "var(--brand)" }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{u.name}</div>
                          <div className="text-xs font-mono mt-1" style={{ color: "var(--text-muted)" }}>{u.employee_id}</div>
                          {u.position && <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{u.position}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      {userDept ? (
                        <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <Building2 size={13} style={{ color: "var(--text-muted)" }} />
                          {userDept.name}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>{u.department || "—"}</span>
                      )}
                    </td>
                    <td>
                      <div className="space-y-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                        {u.email && <div className="flex items-center gap-1.5"><Mail size={12} style={{ color: "var(--text-muted)" }} />{u.email}</div>}
                        {u.phone && <div className="flex items-center gap-1.5"><Phone size={12} style={{ color: "var(--text-muted)" }} />{u.phone}</div>}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} departments={departments} />}
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
