"use client";

import { useState } from "react";
import { useActionState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, LogIn, UserPlus } from "lucide-react";
import { adminLoginAction, adminSignupAction } from "@/app/actions";
import { Button, Input, Card, Alert, Spinner } from "@/components/ui";
import { Logo } from "./logo";

export function ModernAdminLoginForm() {
  const [state, formAction, isPending] = useActionState(adminLoginAction, { error: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center" variants={itemVariants}>
        <div className="mb-4 inline-flex rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3">
          <LogIn className="h-6 w-6 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Admin Login</h2>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to access admin dashboard
        </p>
      </motion.div>

      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert variant="error">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>{state.error}</span>
            </div>
          </Alert>
        </motion.div>
      )}

      <form action={formAction} className="space-y-4">
        <motion.div className="space-y-2" variants={itemVariants}>
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Mail size={16} />
            Email Address
          </label>
          <Input
            type="email"
            name="email"
            placeholder="admin@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isPending}
          />
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Lock size={16} />
            Password
          </label>
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isPending}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner className="h-4 w-4" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}

export function ModernAdminSignupForm() {
  const [state, formAction, isPending] = useActionState(adminSignupAction, {
    error: "",
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center" variants={itemVariants}>
        <div className="mb-4 inline-flex rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-3">
          <UserPlus className="h-6 w-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Create Admin Account</h2>
        <p className="mt-2 text-sm text-slate-400">
          Register the first admin account
        </p>
      </motion.div>

      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert variant="error">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>{state.error}</span>
            </div>
          </Alert>
        </motion.div>
      )}

      <form action={formAction} className="space-y-4">
        <motion.div className="space-y-2" variants={itemVariants}>
          <label className="text-sm font-medium text-slate-300">Full Name</label>
          <Input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isPending}
          />
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Mail size={16} />
            Email Address
          </label>
          <Input
            type="email"
            name="email"
            placeholder="admin@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isPending}
          />
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Lock size={16} />
            Password
          </label>
          <Input
            type="password"
            name="password"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isPending}
          />
          <p className="text-xs text-slate-500">Must be at least 6 characters</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            size="lg"
            variant="secondary"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner className="h-4 w-4" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Admin Account</span>
                <UserPlus size={18} />
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
