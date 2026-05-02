"use client";

import { useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, ArrowRight, AlertCircle, Building2 } from "lucide-react";
import { loginAction } from "@/app/actions";
import Link from "next/link";

export function ModernLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, { error: "" });

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        background: "#040810",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow blobs */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(79,142,247,0.08)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "rgba(139,92,246,0.06)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
          pointerEvents: "none",
        }}
        aria-hidden
      />

      <motion.div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              background: "#4f8ef7",
              borderRadius: 12,
              color: "#fff",
              boxShadow:
                "0 0 0 1px rgba(79,142,247,0.3), 0 8px 24px rgba(79,142,247,0.3)",
            }}
          >
            <Building2 size={22} />
          </div>
          <div>
            <div
              style={{
                fontSize: "1.125rem",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              INNOAIVATORS
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "#4d5a78",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginTop: 1,
              }}
            >
              Employee Management System
            </div>
          </div>
        </div>

        {/* Card */}
        <motion.div
          style={{
            width: "100%",
            background: "#111827",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "2rem",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 64px rgba(0,0,0,0.5), 0 0 80px rgba(79,142,247,0.04)",
          }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {/* Card header */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                background: "rgba(79,142,247,0.12)",
                color: "#4f8ef7",
                borderRadius: 14,
                border: "1px solid rgba(79,142,247,0.2)",
                marginBottom: "1rem",
              }}
            >
              <LogIn size={20} />
            </div>
            <h1
              style={{
                fontSize: "1.375rem",
                fontWeight: 800,
                color: "#f0f4ff",
                letterSpacing: "-0.02em",
                marginBottom: "0.375rem",
              }}
            >
              Employee Login
            </h1>
            <p style={{ fontSize: "0.85rem", color: "#4d5a78" }}>
              Sign in with your Employee ID or email
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {state.error && (
              <motion.div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 10,
                  color: "#f87171",
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                  overflow: "hidden",
                }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle size={15} />
                <span>{state.error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Identifier */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label
                htmlFor="identifier"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#8b9cc4",
                }}
              >
                <Mail size={14} />
                Employee ID or Email
              </label>
              <input
                id="identifier"
                type="text"
                name="identifier"
                placeholder="e.g. EMP001 or name@company.com"
                required
                disabled={isPending}
                autoComplete="username"
                style={{
                  width: "100%",
                  background: "#1a2332",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: "0.7rem 1rem",
                  fontSize: "0.9rem",
                  color: "#f0f4ff",
                  fontFamily: "inherit",
                  outline: "none",
                  colorScheme: "dark" as const,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#4f8ef7";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(79,142,247,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label
                htmlFor="password"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#8b9cc4",
                }}
              >
                <Lock size={14} />
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                disabled={isPending}
                autoComplete="current-password"
                style={{
                  width: "100%",
                  background: "#1a2332",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: "0.7rem 1rem",
                  fontSize: "0.9rem",
                  color: "#f0f4ff",
                  fontFamily: "inherit",
                  outline: "none",
                  colorScheme: "dark" as const,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#4f8ef7";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(79,142,247,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.75rem 1.5rem",
                marginTop: "0.25rem",
                background: isPending ? "#3a7ae0" : "#4f8ef7",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontSize: "0.9375rem",
                fontWeight: 700,
                cursor: isPending ? "not-allowed" : "pointer",
                boxShadow: "0 4px 16px rgba(79,142,247,0.25)",
                fontFamily: "inherit",
                transition: "background 0.15s, box-shadow 0.2s",
                opacity: isPending ? 0.8 : 1,
              }}
            >
              {isPending ? (
                <>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              marginTop: "1.25rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              fontSize: "0.8125rem",
              color: "#4d5a78",
            }}
          >
            <span>Admin?</span>
            <Link
              href="/admin-login"
              style={{
                color: "#4f8ef7",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Go to Admin Portal →
            </Link>
          </div>
        </motion.div>

        {/* Bottom footer */}
        <p style={{ fontSize: "0.75rem", color: "#4d5a78", textAlign: "center" }}>
          © {new Date().getFullYear()} INNOAIVATORS TECHNOLOGIES. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
