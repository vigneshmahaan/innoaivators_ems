"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, Search, Pencil, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { createDepartmentAction, updateDepartmentAction } from "@/app/actions/settings";
import type { Department } from "@/lib/types";

export function DepartmentsClient({ departments }: { departments: Department[] }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Department | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createDepartmentAction({}, formData);
      if (result?.error) toast.error(result.error);
      else toast.success("Department created!");
    });
  }

  async function handleUpdate(formData: FormData) {
    startTransition(async () => {
      const result = await updateDepartmentAction({}, formData);
      if (result?.error) toast.error(result.error);
      else { toast.success("Department updated!"); setEditing(null); }
    });
  }

  return (
    <div className="space-y-10">
      <div 
        className="flex flex-col gap-6 sm:flex-row mb-4"
      >
        <div className="input-icon-wrapper flex-1">
          <Search size={16} className="input-icon-left" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search departments..." className="input input-with-icon" />
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>Add Department</h3>
        <form action={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <input name="name" placeholder="Department Name" required className="input" />
          <input name="code" placeholder="Code (optional)" className="input" />
          <button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? <span className="spinner" /> : <Plus size={14} />}
            Add
          </button>
        </form>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <td className="font-medium">{d.name}</td>
                <td className="text-sm" style={{ color: "var(--text-muted)" }}>{d.code || "—"}</td>
                <td>
                  <span className={`badge ${d.status === "active" ? "badge-success" : "badge-danger"}`}>
                    {d.status === "active" ? <CheckCircle size={10} /> : <XCircle size={10} />}
                    {d.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => setEditing(d)} className="btn btn-sm btn-ghost" style={{ color: "var(--info)" }}>
                    <Pencil size={13} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <motion.div className="relative z-10 w-full max-w-md rounded-2xl card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="p-5">
              <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>Edit Department</h3>
              <form action={handleUpdate} className="space-y-4">
                <input type="hidden" name="id" value={editing.id} />
                <input name="name" defaultValue={editing.name} required className="input" />
                <input name="code" defaultValue={editing.code || ""} className="input" />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditing(null)} className="btn btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn btn-primary flex-1" disabled={isPending}>Save</button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
