"use client";

import { Menu, Bell, Users, LogOut, Wifi, WifiOff } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useMessagesStore } from "@/stores/messagesStore";
import { useUIStore } from "@/stores/uiStore";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/format";

export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const totalUnread = useMessagesStore((s) => s.totalUnread);
  const { toggleLeftSidebar, toggleRightSidebar, toggleMobileMenu } = useUIStore();
  const { handleLogout } = useAuth();

  return (
    <header className="h-14 glass border-b border-surface-border flex items-center justify-between px-4 z-50 sticky top-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-hover text-text-secondary"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          onClick={toggleLeftSidebar}
          className="hidden lg:block p-2 rounded-lg hover:bg-surface-hover text-text-secondary"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <img src="/resonite-logo.png" alt="Resonite" className="h-7 w-7 rounded-lg" />
          <h1 className="font-heading text-lg font-semibold hidden sm:block">
            <span className="text-text-primary">Resonite</span>
            <span className="text-primary-light"> Dash</span>
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          className="relative p-2 rounded-lg hover:bg-surface-hover text-text-secondary transition-colors"
          title="Messages"
        >
          <Bell className="h-5 w-5" />
          {totalUnread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold rounded-full h-4 min-w-4 flex items-center justify-center px-1">
              {totalUnread > 99 ? "99+" : totalUnread}
            </span>
          )}
        </button>

        <button
          onClick={toggleRightSidebar}
          className="p-2 rounded-lg hover:bg-surface-hover text-text-secondary transition-colors"
          title="Friends"
        >
          <Users className="h-5 w-5" />
        </button>

        {user && (
          <div className="hidden sm:flex items-center gap-2 ml-2 pl-2 border-l border-surface-border">
            <span className="text-sm text-text-secondary">{user.username}</span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
