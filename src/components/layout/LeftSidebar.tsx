"use client";

import { NAV_ITEMS } from "@/lib/constants";
import { useUIStore } from "@/stores/uiStore";
import { useMessagesStore } from "@/stores/messagesStore";
import { ProfileCard } from "./ProfileCard";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils/format";
import { X } from "lucide-react";

export function LeftSidebar() {
  const { leftSidebarOpen, mobileMenuOpen, closeMobileMenu } = useUIStore();
  const totalUnread = useMessagesStore((s) => s.totalUnread);

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 lg:top-14 left-0 h-screen lg:h-[calc(100vh-3.5rem)] w-64 z-40",
          "bg-base-darker lg:bg-transparent border-r border-surface-border",
          "flex flex-col overflow-y-auto",
          "transition-transform duration-300 ease-in-out",
          // Desktop
          !leftSidebarOpen && "lg:-translate-x-full lg:w-0 lg:border-0",
          // Mobile
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-heading text-lg font-semibold text-primary-light">Menu</span>
          <button
            onClick={closeMobileMenu}
            className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ProfileCard />

        <nav className="flex-1 px-3 pb-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              badge={item.label === "Messages" ? totalUnread : undefined}
              onClick={closeMobileMenu}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
