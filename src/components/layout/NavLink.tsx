"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/format";
import type { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  onClick?: () => void;
}

export function NavLink({ href, label, icon: Icon, badge, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/15 text-primary-light border border-primary/30 glow-primary"
          : "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
      )}
    >
      <Icon className="h-4.5 w-4.5 flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-primary text-white text-xs font-bold rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}
