"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import { ModernAdminLoginForm } from "@/components/modern-admin-forms";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export function AdminLoginPageClient() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, delay: 4 }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <motion.div className="mb-10 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Logo size="lg" showText={true} href="/" />
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-slate-800 shadow-2xl bg-slate-900">
            <ModernAdminLoginForm />
          </Card>
        </motion.div>

        {/* Create Admin Link */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/admin-signup"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-6 py-3 font-semibold text-slate-200 border border-slate-700 transition-all hover:bg-slate-700 hover:text-white"
          >
            <UserPlus className="h-5 w-5" />
            Create New Admin
          </Link>
        </motion.div>

        {/* Employee Portal Link */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-slate-400">
            Are you an employee?{" "}
            <a
              href="/login"
              className="font-semibold text-blue-400 transition-colors hover:text-blue-300"
            >
              Go to Employee Login
            </a>
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="mt-6 text-center text-sm text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          © {new Date().getFullYear()} INNOAIVATORS TECHNOLOGIES. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
}
