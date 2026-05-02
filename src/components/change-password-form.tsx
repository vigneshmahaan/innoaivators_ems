"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { KeyRound, AlertTriangle, CheckCircle } from "lucide-react";
import { changePasswordAction } from "@/app/actions/auth";

export function ChangePasswordForm({ isFirst }: { isFirst?: boolean }) {
  const [state, formAction, isPending] = useActionState(changePasswordAction, {});

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {state.success ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "var(--success-dim)", color: "var(--success)" }}
          >
            <CheckCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              Password Updated
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Your password has been changed successfully.
            </p>
          </div>
          <a href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </a>
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          {isFirst && (
            <div
              className="rounded-lg p-3 text-xs"
              style={{
                background: "var(--warning-dim)",
                color: "var(--warning)",
                border: "1px solid rgba(234,179,8,0.2)",
              }}
            >
              <AlertTriangle size={14} className="inline mr-1" />
              For security, you must change your temporary password before accessing the system.
            </div>
          )}

          <div className="form-group">
            <label className="label flex items-center gap-2">
              <KeyRound size={14} style={{ color: "var(--text-muted)" }} />
              {isFirst ? "Temporary Password" : "Current Password"}
            </label>
            <input
              type="password"
              name="old_password"
              required
              className="input"
              placeholder="Enter current password"
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label className="label">New Password</label>
            <input
              type="password"
              name="new_password"
              required
              minLength={8}
              className="input"
              placeholder="Min 8 characters, uppercase, lowercase, number, symbol"
              disabled={isPending}
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Must be at least 8 characters with uppercase, lowercase, number, and special character.
            </p>
          </div>

          <div className="form-group">
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              name="confirm_password"
              required
              className="input"
              placeholder="Re-enter new password"
              disabled={isPending}
            />
          </div>

          {state.error && (
            <div className="alert alert-error text-xs">
              <AlertTriangle size={14} />
              {state.error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
            {isPending ? (
              <>
                <span className="spinner" />
                Updating...
              </>
            ) : (
              <>
                <KeyRound size={15} />
                {isFirst ? "Set Password" : "Update Password"}
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
}
