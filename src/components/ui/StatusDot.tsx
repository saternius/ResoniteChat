import { cn } from "@/lib/utils/format";
import type { OnlineStatus } from "@/types";

interface StatusDotProps {
  status: OnlineStatus;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

const statusColors: Record<OnlineStatus, string> = {
  Online: "bg-status-online",
  Away: "bg-status-away",
  Busy: "bg-status-busy",
  Offline: "bg-status-offline",
  Invisible: "bg-status-offline",
};

const statusShadows: Record<OnlineStatus, string> = {
  Online: "shadow-[0_0_6px_var(--color-status-online)]",
  Away: "shadow-[0_0_6px_var(--color-status-away)]",
  Busy: "shadow-[0_0_6px_var(--color-status-busy)]",
  Offline: "",
  Invisible: "",
};

const sizes = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

export function StatusDot({
  status,
  size = "md",
  pulse,
  className,
}: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full",
        statusColors[status],
        statusShadows[status],
        sizes[size],
        pulse && status === "Online" && "animate-pulse",
        className,
      )}
      title={status}
    />
  );
}
