"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions";
import { Navigation } from "@/components/navigation";
import {
  LayoutDashboard,
  Users,
  Clock,
  BarChart3,
  Shield,
} from "lucide-react";

const navigationLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/employees", label: "Employees", icon: <Users size={18} /> },
  { href: "/admin/attendance", label: "Attendance", icon: <Clock size={18} /> },
  { href: "/admin/reports", label: "Reports", icon: <BarChart3 size={18} /> },
];

export function AdminLayoutClient({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/admin-login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation
        links={navigationLinks}
        showLogout={true}
        onLogout={handleLogout}
      >
        <div className="flex items-center gap-3 rounded-lg border border-slate-600 bg-slate-700/30 px-4 py-2 text-sm text-slate-200">
          <Shield size={16} className="text-purple-400" />
          <span className="font-medium">{user.name}</span>
          <span className="text-xs text-slate-500">(Admin)</span>
        </div>
      </Navigation>

      <main className="flex-1">
        <div className="container-app py-8 animate-fade-in">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} INNOAIVATORS TECHNOLOGIES. All rights reserved.
      </footer>
    </div>
  );
}
