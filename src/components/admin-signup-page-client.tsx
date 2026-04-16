"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import { ModernAdminSignupForm } from "@/components/modern-admin-forms";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AdminSignupPageClient() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, delay: 4 }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <motion.div className="mb-10 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Logo size="lg" showText={true} href="/" />
        </motion.div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-slate-700 shadow-2xl">
            <ModernAdminSignupForm />
          </Card>
        </motion.div>

        {/* Back to Login Link */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/admin-login"
            className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Login
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.p
        className="absolute bottom-4 text-center text-sm text-slate-600 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        © {new Date().getFullYear()} INNOAIVATORS TECHNOLOGIES. All rights reserved.
      </motion.p>
    </div>
  );
}
