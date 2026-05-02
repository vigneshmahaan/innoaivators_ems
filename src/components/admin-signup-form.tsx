"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle } from "lucide-react";
import { adminSignupAction } from "@/app/actions/auth";

export function AdminSignupForm() {
  const [state, formAction, isPending] = useActionState(adminSignupAction, {});

  return (
    <motion.div
      className="w-full max-w-md rounded-2xl card p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 text-center">
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: "var(--brand-dim)", color: "var(--brand)" }}
        >
          <Shield size={28} />
        </div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Create Admin Account
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Set up your admin portal access
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="form-group">
          <label className="label">Full Name</label>
          <input name="name" placeholder="John Doe" required className="input" disabled={isPending} />
        </div>
        <div className="form-group">
          <label className="label">Email Address</label>
          <input type="email" name="email" placeholder="admin@company.com" required className="input" disabled={isPending} />
        </div>
        <div className="form-group">
          <label className="label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Min 8 characters, uppercase, lowercase, number, symbol"
            minLength={8}
            required
            className="input"
            disabled={isPending}
          />
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Must be at least 8 characters with uppercase, lowercase, number, and special character.
          </p>
        </div>

        {state.error && (
          <div className="alert alert-error text-xs">
            <AlertTriangle size={14} />
            {state.error}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
          {isPending ? <span className="spinner" /> : "Create Admin Account"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Already have an account?{" "}
        <a href="/admin-login" className="font-medium hover:underline" style={{ color: "var(--brand)" }}>
          Sign in
        </a>
      </p>
    </motion.div>
  );
}
