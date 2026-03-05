import { cn } from "@/lib/utils/format";

interface BadgeProps {
  variant?: "default" | "primary" | "accent" | "success" | "warning" | "danger";
  children: React.ReactNode;
  className?: string;
}

const variants = {
  default: "bg-base-lighter text-text-secondary",
  primary: "bg-primary/20 text-primary-light border-primary/30",
  accent: "bg-accent/20 text-accent-light border-accent/30",
  success: "bg-green-500/20 text-green-400 border-green-500/30",
  warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  danger: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
