"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Trash2, Download, Search } from "lucide-react";
import { toast } from "sonner";
import { addDocument, deleteDocument } from "@/services/employee-service";
import type { UserProfile } from "@/lib/types";

export function DocumentsClient({ employees }: { employees: UserProfile[] }) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.employee_id.toLowerCase().includes(search.toLowerCase())
  );

  async function handleUpload(formData: FormData) {
    startTransition(async () => {
      try {
        await addDocument({
          user_id: String(formData.get("user_id")),
          name: String(formData.get("name")),
          file_url: String(formData.get("file_url")),
          category: String(formData.get("category")) as any,
          description: String(formData.get("description") || ""),
        });
        toast.success("Document uploaded!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      }
    });
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="input-icon-wrapper flex-1">
          <Search size={16} className="input-icon-left" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-with-icon"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-2">
          <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            Employees
          </h3>
          <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {filteredEmployees.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedEmployee(e.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedEmployee === e.id
                    ? "font-semibold"
                    : ""
                }`}
                style={{
                  background: selectedEmployee === e.id ? "var(--brand-dim)" : "transparent",
                  color: selectedEmployee === e.id ? "var(--brand)" : "var(--text-secondary)",
                }}
              >
                <div className="font-medium">{e.name}</div>
                <div className="text-xs opacity-70">{e.employee_id}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedEmployee ? (
            <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="card">
                <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                  Upload Document
                </h3>
                <form action={handleUpload} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="hidden" name="user_id" value={selectedEmployee} />
                  <div className="form-group">
                    <label className="label">Document Name</label>
                    <input name="name" required className="input" placeholder="e.g. Contract 2024" />
                  </div>
                  <div className="form-group">
                    <label className="label">Category</label>
                    <select name="category" required className="input">
                      <option value="contract">Contract</option>
                      <option value="id_proof">ID Proof</option>
                      <option value="address_proof">Address Proof</option>
                      <option value="education">Education</option>
                      <option value="experience">Experience</option>
                      <option value="payslip">Payslip</option>
                      <option value="tax">Tax</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group sm:col-span-2">
                    <label className="label">File URL</label>
                    <input name="file_url" required className="input" placeholder="https://..." />
                  </div>
                  <div className="form-group sm:col-span-2">
                    <label className="label">Description</label>
                    <textarea name="description" className="input" rows={2} />
                  </div>
                  <div className="sm:col-span-2">
                    <button type="submit" className="btn btn-primary" disabled={isPending}>
                      {isPending ? <span className="spinner" /> : <Upload size={14} />}
                      Upload Document
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            <div className="card empty-state">
              <FileText size={36} className="empty-state-icon" />
              <p className="empty-state-title">Select an employee</p>
              <p className="empty-state-description">Choose an employee from the list to manage documents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
