"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/format";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-lg bg-base-dark border border-surface-border px-4 py-2.5",
              "text-text-primary placeholder:text-text-muted",
              "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50",
              "transition-colors duration-200",
              icon ? "pl-10" : undefined,
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500/50" : undefined,
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
