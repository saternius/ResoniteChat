"use client";

import { cn } from "@/lib/utils/format";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const variants = {
  primary:
    "bg-primary hover:bg-primary-dark text-white glow-primary hover:shadow-[0_0_30px_var(--color-primary-glow)]",
  secondary:
    "bg-base-light hover:bg-base-lighter border border-surface-border text-text-primary",
  ghost:
    "bg-transparent hover:bg-surface-hover text-text-secondary hover:text-text-primary",
  danger:
    "bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 hover:text-red-300",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
