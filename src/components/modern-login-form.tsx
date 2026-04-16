"use client";

import { useState } from "react";
import { useActionState } from "react";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";
import { loginAction } from "@/app/actions";
import { Button, Input, Card, Alert, Spinner } from "@/components/ui";
import { Logo } from "./logo";

export function ModernLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, { error: "" });
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, delay: 4 }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div className="mb-8 text-center" variants={itemVariants}>
          <Logo size="lg" showText={true} href="/" />
        </motion.div>

        {/* Card */}
        <Card className="border-slate-700 shadow-2xl">
          <motion.div className="space-y-6" variants={containerVariants}>
            {/* Header */}
            <motion.div className="text-center" variants={itemVariants}>
              <div className="mb-4 inline-flex rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3">
                <LogIn className="h-6 w-6 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-100">Employee Login</h1>
              <p className="mt-2 text-sm text-slate-400">
                Sign in with your Employee ID or Email
              </p>
            </motion.div>

            {/* Error Alert */}
            {state.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
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

            {/* Form */}
            <form action={formAction} className="space-y-4">
              {/* Employee ID / Email Input */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Mail size={16} />
                  Employee ID or Email
                </label>
                <Input
                  type="text"
                  name="identifier"
                  placeholder="Enter your Employee ID or Email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  disabled={isPending}
                />
              </motion.div>

              {/* Password Input */}
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

              {/* Submit Button */}
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

            {/* Divider */}
          

            {/* Admin Portal Link */}
          
          </motion.div>
        </Card>

        {/* Footer */}
        <motion.p
          className="mt-6 text-center text-sm text-slate-500"
          variants={itemVariants}
        >
          © {new Date().getFullYear()} INNOAIVATORS TECHNOLOGIES. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}
