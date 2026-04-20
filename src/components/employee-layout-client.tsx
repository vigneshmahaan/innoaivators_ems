"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions";
import { Navigation } from "@/components/navigation";
import {
  LayoutDashboard,
  Clock,
  FileText,
  History,
  KeyRound,
  User,
  ListTodo,
} from "lucide-react";

const navigationLinks = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/attendance", label: "Attendance", icon: <Clock size={18} /> },
  { href: "/daily-log", label: "Daily Log", icon: <FileText size={18} /> },
  { href: "/tasks", label: "Tasks", icon: <ListTodo size={18} /> },
];

const dropdownLinks = [
  { href: "/profile", label: "Profile", icon: <User size={18} /> },
  { href: "/history", label: "History", icon: <History size={18} /> },
  { href: "/change-password", label: "Security", icon: <KeyRound size={18} /> },
];

export function EmployeeLayoutClient({
  user,
  children,
}: {
  user: { name: string; email: string; role?: string };
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navigation
        links={navigationLinks}
        dropdownLinks={dropdownLinks}
        userName={user.name}
        userEmail={user.email}
        userRole={user.role}
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
