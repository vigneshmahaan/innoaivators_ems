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
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navigation
        links={navigationLinks}
        userName={user.name}
        userEmail={user.email}
        userRole="Administrator"
        showLogout={true}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        <div className="container-app py-8 animate-fade-in">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/50 py-6 text-center text-xs text-slate-600 tracking-wider">
        © {new Date().getFullYear()} INNOAIVATORS TECHNOLOGIES. All rights reserved.
      </footer>
    </div>
  );
}
