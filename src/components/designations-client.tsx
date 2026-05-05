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
    <div className="space-y-10">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="input-icon-wrapper flex-1">
          <Search size={16} className="input-icon-left" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search designations..." className="input input-with-icon" />
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>Add Designation</h3>
        <form action={handleCreate} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-4">
            <input name="title" placeholder="Title" required className="input" />
          </div>
          <div className="sm:col-span-4">
            <select name="department_id" className="input">
              <option value="">No Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <input name="level" type="number" defaultValue={1} className="input" placeholder="Level" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
              {isPending ? <span className="spinner" /> : <Plus size={14} />}
              Add
            </button>
          </div>
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
