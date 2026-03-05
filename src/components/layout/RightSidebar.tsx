"use client";

import { useUIStore } from "@/stores/uiStore";
import { FriendsList } from "@/components/friends/FriendsList";
import { cn } from "@/lib/utils/format";

export function RightSidebar() {
  const rightSidebarOpen = useUIStore((s) => s.rightSidebarOpen);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col w-72 border-l border-surface-border",
        "sticky top-14 h-[calc(100vh-3.5rem)]",
        "transition-all duration-300",
        !rightSidebarOpen && "lg:w-0 lg:border-0 lg:overflow-hidden",
      )}
    >
      {rightSidebarOpen && <FriendsList />}
    </aside>
  );
}
