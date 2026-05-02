import { requireRole } from "@/lib/auth";
import { getCompanySettings } from "@/services/settings-service";
import { getDepartments, getDesignations } from "@/services/employee-service";
import { SettingsClient } from "@/components/settings-client";
import { Settings } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings — Admin" };

export default async function AdminSettingsPage() {
  await requireRole("admin");

  const [settings, departments, designations] = await Promise.all([
    getCompanySettings(),
    getDepartments(),
    getDesignations(),
  ]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="page-header flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "var(--brand-dim)", color: "var(--brand)" }}
          >
            <Settings size={22} />
          </div>
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">
              Manage company profile, departments, and designations
            </p>
          </div>
        </div>
      </div>

      <SettingsClient
        settings={settings}
        departments={departments}
        designations={designations}
      />
    </div>
  );
}
