"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Award, Plus, Search, Building2 } from "lucide-react";
import { toast } from "sonner";
import { createDesignationAction } from "@/app/actions/settings";
import type { Designation, Department } from "@/lib/types";

export function DesignationsClient({
  designations,
  departments,
}: {
  designations: Designation[];
  departments: Department[];
}) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = designations.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createDesignationAction({}, formData);
      if (result?.error) toast.error(result.error);
      else toast.success("Designation created!");
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search designations..." className="input pl-9" />
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>Add Designation</h3>
        <form action={handleCreate} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input name="title" placeholder="Title" required className="input" />
          <select name="department_id" className="input">
            <option value="">No Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <input name="level" type="number" defaultValue={1} className="input" />
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
              <th>Title</th>
              <th>Department</th>
              <th>Level</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <td className="font-medium">{d.title}</td>
                <td>
                  <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <Building2 size={12} />
                    {d.department_name || "—"}
                  </span>
                </td>
                <td>{d.level}</td>
                <td>
                  <span className={`badge ${d.status === "active" ? "badge-success" : "badge-danger"}`}>
                    {d.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
