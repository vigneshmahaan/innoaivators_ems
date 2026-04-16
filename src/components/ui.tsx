import * as React from "react";
import { cn } from "@/lib/utils";

/* Card Component */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass rounded-lg border border-slate-700 p-6 shadow-lg transition-all duration-300 hover:border-slate-600 hover:shadow-xl",
        className
      )}
      {...props}
    />
  );
}

/* Button Component with variants */
export function Button({
  className,
  variant = "default",
  size = "md",
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  const variantStyles = {
    default:
      "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-slate-500 text-slate-100 hover:bg-slate-700/50 hover:border-slate-400",
    ghost: "text-slate-300 hover:bg-slate-700/50 hover:text-slate-100",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl",
    secondary:
      "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl",
    gradient:
      "bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white hover:shadow-xl",
  };

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
}

/* Input Component */
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all duration-200",
        "focus:border-blue-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50"
      )}
      {...props}
    />
  );
}

/* Textarea Component */
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 resize-none",
        "focus:border-blue-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50"
      )}
      {...props}
    />
  );
}

/* Select Component */
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-100 transition-all duration-200",
        "focus:border-blue-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
        "[background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")]",
        "[background-position:right_1rem_center]",
        "[background-repeat:no-repeat]",
        "[padding-right:2.5rem]"
      )}
      {...props}
    />
  );
}

/* Label Component */
export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-slate-200 transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
}

/* Badge Component */
export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "success" | "warning" | "error" | "info";
}) {
  const variantStyles = {
    default: "bg-blue-500/20 text-blue-200 border border-blue-500/50",
    success: "bg-green-500/20 text-green-200 border border-green-500/50",
    warning: "bg-yellow-500/20 text-yellow-200 border border-yellow-500/50",
    error: "bg-red-500/20 text-red-200 border border-red-500/50",
    info: "bg-cyan-500/20 text-cyan-200 border border-cyan-500/50",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

/* Alert Component */
export function Alert({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "success" | "error" | "warning" | "info";
}) {
  const variantStyles = {
    default: "bg-slate-700/40 border-slate-600 text-slate-200",
    success: "bg-green-500/10 border-green-500/50 text-green-200",
    error: "bg-red-500/10 border-red-500/50 text-red-200",
    warning: "bg-yellow-500/10 border-yellow-500/50 text-yellow-200",
    info: "bg-blue-500/10 border-blue-500/50 text-blue-200",
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 animate-slide-up",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

/* Spinner Component */
export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-3 border-slate-600 border-t-blue-500",
        className
      )}
    />
  );
}

/* Success Icon */
export function SuccessIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-6 w-6 text-green-500", className)}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* Error Icon */
export function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-6 w-6 text-red-500", className)}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  );
}
