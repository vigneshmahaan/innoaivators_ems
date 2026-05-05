"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Building2,
  Briefcase,
  Award,
  Plus,
  Pencil,
  X,
  Save,
  Search,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import type { CompanySettings, Department, Designation } from "@/lib/types";
import {
  updateCompanySettingsAction,
  createDepartmentAction,
  updateDepartmentAction,
  createDesignationAction,
} from "@/app/actions/settings";

type Tab = "company" | "departments" | "designations";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "company", label: "Company Profile", icon: <Building2 size={16} /> },
  { key: "departments", label: "Departments", icon: <Briefcase size={16} /> },
  { key: "designations", label: "Designations", icon: <Award size={16} /> },
];

/* ─── Company Profile Tab ─────────────────────────────────── */

function CompanyProfileForm({ settings }: { settings: CompanySettings | null }) {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await updateCompanySettingsAction({}, formData);
    setIsPending(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Company settings updated successfully!");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="card">
        <h3
          className="text-[11px] font-extrabold uppercase tracking-[0.12em] mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          Basic Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="form-group sm:col-span-2">
            <label className="label">Company Name *</label>
            <div className="input-icon-wrapper">
              <Building2
                size={14}
                className="input-icon-left"
              />
              <input
                name="company_name"
                defaultValue={settings?.company_name ?? ""}
                placeholder="Acme Corporation"
                required
                className="input input-with-icon"
                disabled={isPending}
              />
            </div>
          </div>
          <div className="form-group sm:col-span-2">
            <label className="label">Address</label>
            <div className="input-icon-wrapper">
              <MapPin
                size={14}
                className="input-icon-left"
              />
              <input
                name="address"
                defaultValue={settings?.address ?? ""}
                placeholder="123 Business Street"
                className="input input-with-icon"
                disabled={isPending}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="label">City</label>
            <input
              name="city"
              defaultValue={settings?.city ?? ""}
              placeholder="New York"
              className="input"
              disabled={isPending}
            />
          </div>
          <div className="form-group">
            <label className="label">State</label>
            <input
              name="state"
              defaultValue={settings?.state ?? ""}
              placeholder="NY"
              className="input"
              disabled={isPending}
            />
          </div>
          <div className="form-group">
            <label className="label">Country</label>
            <input
              name="country"
              defaultValue={settings?.country ?? ""}
              placeholder="USA"
              className="input"
              disabled={isPending}
            />
          </div>
          <div className="form-group">
            <label className="label">ZIP Code</label>
            <input
              name="zip_code"
              defaultValue={settings?.zip_code ?? ""}
              placeholder="10001"
              className="input"
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="card">
        <h3
          className="text-[11px] font-extrabold uppercase tracking-[0.12em] mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          Contact Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="form-group">
            <label className="label">Phone</label>
            <div className="input-icon-wrapper">
              <Phone
                size={14}
                className="input-icon-left"
              />
              <input
                name="phone"
                defaultValue={settings?.phone ?? ""}
                placeholder="+1 (555) 123-4567"
                className="input input-with-icon"
                disabled={isPending}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <div className="input-icon-wrapper">
              <Mail
                size={14}
                className="input-icon-left"
              />
              <input
                type="email"
                name="email"
                defaultValue={settings?.email ?? ""}
                placeholder="contact@company.com"
                className="input input-with-icon"
                disabled={isPending}
              />
            </div>
          </div>
          <div className="form-group sm:col-span-2">
            <label className="label">Website</label>
            <div className="input-icon-wrapper">
              <Globe
                size={14}
                className="input-icon-left"
              />
              <input
                name="website"
                defaultValue={settings?.website ?? ""}
                placeholder="https://www.company.com"
                className="input input-with-icon"
                disabled={isPending}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Work Configuration */}
      <div className="card">
        <h3
          className="text-[11px] font-extrabold uppercase tracking-[0.12em] mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          Work Configuration
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="form-group">
            <label className="label">Timezone *</label>
            <input
              name="timezone"
              defaultValue={settings?.timezone ?? "UTC"}
              placeholder="UTC"
              required
              className="input"
              disabled={isPending}
            />
          </div>
          <div className="form-group">
            <label className="label">Currency *</label>
            <input
              name="currency"
              defaultValue={settings?.currency ?? "USD"}
              placeholder="USD"
              required
              className="input"
              disabled={isPending}
            />
          </div>
          <div className="form-group">
            <label className="label">Currency Symbol *</label>
            <div className="input-icon-wrapper">
              <DollarSign
                size={14}
                className="input-icon-left"
              />
              <input
                name="currency_symbol"
                defaultValue={settings?.currency_symbol ?? "$"}
                placeholder="$"
                required
                className="input input-with-icon"
                disabled={isPending}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Work Start Time *</label>
            <div className="input-icon-wrapper">
              <Clock
                size={14}
                className="input-icon-left"
              />
              <input
                type="time"
                name="work_start_time"
                defaultValue={settings?.work_start_time ?? "09:00"}
                required
                className="input input-with-icon"
                disabled={isPending}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Work End Time *</label>
            <div className="input-icon-wrapper">
              <Clock
                size={14}
                className="input-icon-left"
              />
              <input
                type="time"
                name="work_end_time"
                defaultValue={settings?.work_end_time ?? "18:00"}
                required
                className="input input-with-icon"
                disabled={isPending}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Grace Period (minutes) *</label>
            <input
              type="number"
              name="grace_period_minutes"
              defaultValue={settings?.grace_period_minutes ?? 15}
              min={0}
              max={120}
              required
              className="input"
              disabled={isPending}
            />
          </div>
          <div className="form-group">
            <label className="label">Half Day Hours *</label>
            <input
              type="number"
              name="half_day_hours"
              defaultValue={settings?.half_day_hours ?? 4}
              min={0}
              max={12}
              step={0.5}
              required
              className="input"
              disabled={isPending}
            />
          </div>
          <div className="form-group">
            <label className="label">Full Day Hours *</label>
            <input
              type="number"
              name="full_day_hours"
              defaultValue={settings?.full_day_hours ?? 8}
              min={0}
              max={24}
              step={0.5}
              required
              className="input"
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className="spinner" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* ─── Department Modals ───────────────────────────────────── */

function DepartmentModal({
  department,
  onClose,
}: {
  department?: Department;
  onClose: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const isEdit = !!department;

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const action = isEdit ? updateDepartmentAction : createDepartmentAction;
    if (isEdit && department) {
      formData.set("id", department.id);
    }
    const result = await action({}, formData);
    setIsPending(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(
        isEdit
          ? "Department updated successfully!"
          : "Department created successfully!"
      );
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        className="relative z-10 w-full max-w-md rounded-2xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
      >
        <div
          className="flex items-center justify-between p-5"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "var(--brand-dim)", color: "var(--brand)" }}
            >
              {isEdit ? <Pencil size={18} /> : <Plus size={18} />}
            </div>
            <div>
              <h2
                className="font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {isEdit ? "Edit Department" : "Add Department"}
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {isEdit
                  ? "Update department details"
                  : "Create a new department"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-icon btn-ghost"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        <form action={handleSubmit} className="p-5 space-y-4">
          <div className="form-group">
            <label className="label">Name *</label>
            <input
              name="name"
              defaultValue={department?.name ?? ""}
              placeholder="e.g. Engineering"
              required
              className="input"
              disabled={isPending}
            />
          </div>
          <div className="form-group">
            <label className="label">Code</label>
            <input
              name="code"
              defaultValue={department?.code ?? ""}
              placeholder="e.g. ENG"
              className="input"
              disabled={isPending}
            />
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea
              name="description"
              defaultValue={department?.description ?? ""}
              placeholder="Brief description of the department"
              className="input"
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="spinner" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save size={15} />
                  {isEdit ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Designation Modal ───────────────────────────────────── */

function DesignationModal({
  departments,
  onClose,
}: {
  departments: Department[];
  onClose: () => void;
}) {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await createDesignationAction({}, formData);
    setIsPending(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Designation created successfully!");
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        className="relative z-10 w-full max-w-md rounded-2xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
      >
        <div
          className="flex items-center justify-between p-5"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "var(--brand-dim)", color: "var(--brand)" }}
            >
              <Plus size={18} />
            </div>
            <div>
              <h2
                className="font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Add Designation
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Create a new designation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-icon btn-ghost"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        <form action={handleSubmit} className="p-5 space-y-4">
          <div className="form-group">
            <label className="label">Title *</label>
            <input
              name="title"
              placeholder="e.g. Senior Software Engineer"
              required
              className="input"
              disabled={isPending}
            />
          </div>
          <div className="form-group">
            <label className="label">Department</label>
            <div className="relative">
              <select
                name="department_id"
                className="input"
                disabled={isPending}
              >
                <option value="">Select department (optional)</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea
              name="description"
              placeholder="Brief description of the designation"
              className="input"
              disabled={isPending}
            />
          </div>
          <div className="form-group">
            <label className="label">Level</label>
            <input
              type="number"
              name="level"
              defaultValue={1}
              min={1}
              max={100}
              className="input"
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="spinner" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Create
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Departments Tab ─────────────────────────────────────── */

function DepartmentsTab({
  departments: initialDepartments,
}: {
  departments: Department[];
}) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState<Department | undefined>();

  const filtered = initialDepartments.filter((d) => {
    const q = search.toLowerCase();
    return (
      !search ||
      d.name.toLowerCase().includes(q) ||
      (d.code ?? "").toLowerCase().includes(q) ||
      (d.description ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="input-icon-wrapper flex-1 max-w-sm">
          <Search
            size={14}
            className="input-icon-left"
          />
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-with-icon"
          />
        </div>
        <button
          onClick={() => {
            setEditDept(undefined);
            setShowModal(true);
          }}
          className="btn btn-primary shrink-0"
        >
          <Plus size={16} />
          Add Department
        </button>
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Showing {filtered.length} of {initialDepartments.length} departments
      </p>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <Briefcase size={36} className="empty-state-icon" />
          <p className="empty-state-title">No departments found</p>
          <p className="empty-state-description">
            Try adjusting your search or add a new department.
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Description</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, idx) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                        style={{
                          background: "var(--brand-dim)",
                          color: "var(--brand)",
                        }}
                      >
                        {d.name.charAt(0).toUpperCase()}
                      </div>
                      <span
                        className="font-semibold text-sm"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {d.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    {d.code ? (
                      <span
                        className="text-xs font-mono"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {d.code}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <span
                      className="text-sm truncate max-w-[200px] block"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {d.description || "—"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        d.status === "active"
                          ? "badge-success"
                          : "badge-danger"
                      }`}
                    >
                      {d.status === "active" ? (
                        <CheckCircle size={10} />
                      ) : (
                        <AlertTriangle size={10} />
                      )}
                      {d.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditDept(d);
                          setShowModal(true);
                        }}
                        className="btn btn-sm btn-ghost"
                        title="Edit Department"
                        style={{ color: "var(--brand)" }}
                      >
                        <Pencil size={14} />
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
        {showModal && (
          <DepartmentModal
            department={editDept}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Designations Tab ────────────────────────────────────── */

function DesignationsTab({
  designations: initialDesignations,
  departments,
}: {
  designations: Designation[];
  departments: Department[];
}) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = initialDesignations.filter((d) => {
    const q = search.toLowerCase();
    return (
      !search ||
      d.title.toLowerCase().includes(q) ||
      (d.department_name ?? "").toLowerCase().includes(q) ||
      (d.description ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="input-icon-wrapper flex-1 max-w-sm">
          <Search
            size={14}
            className="input-icon-left"
          />
          <input
            type="text"
            placeholder="Search designations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-with-icon"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary shrink-0"
        >
          <Plus size={16} />
          Add Designation
        </button>
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Showing {filtered.length} of {initialDesignations.length} designations
      </p>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <Award size={36} className="empty-state-icon" />
          <p className="empty-state-title">No designations found</p>
          <p className="empty-state-description">
            Try adjusting your search or add a new designation.
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Level</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, idx) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                        style={{
                          background: "var(--accent-dim)",
                          color: "var(--accent)",
                        }}
                      >
                        {d.title.charAt(0).toUpperCase()}
                      </div>
                      <span
                        className="font-semibold text-sm"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {d.title}
                      </span>
                    </div>
                  </td>
                  <td>
                    {d.department_name ? (
                      <span
                        className="flex items-center gap-1.5 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Briefcase
                          size={13}
                          style={{ color: "var(--text-muted)" }}
                        />
                        {d.department_name}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      L{d.level}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        d.status === "active"
                          ? "badge-success"
                          : "badge-danger"
                      }`}
                    >
                      {d.status === "active" ? (
                        <CheckCircle size={10} />
                      ) : (
                        <AlertTriangle size={10} />
                      )}
                      {d.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className="text-sm truncate max-w-[200px] block"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {d.description || "—"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <DesignationModal
            departments={departments}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Settings Client ────────────────────────────────── */

export function SettingsClient({
  settings,
  departments,
  designations,
}: {
  settings: CompanySettings | null;
  departments: Department[];
  designations: Designation[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("company");

  return (
    <div className="space-y-10">
      {/* Tab Bar */}
      <div
        className="flex gap-1 p-1 rounded-xl"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`btn btn-sm flex-1 ${
              activeTab === tab.key ? "btn-primary" : "btn-ghost"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "company" && <CompanyProfileForm settings={settings} />}
          {activeTab === "departments" && (
            <DepartmentsTab departments={departments} />
          )}
          {activeTab === "designations" && (
            <DesignationsTab
              designations={designations}
              departments={departments}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
