"use client";

import { useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useContacts } from "@/hooks/useContacts";
import { useSessions } from "@/hooks/useSessions";
import { useSignalR } from "@/hooks/useSignalR";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loadUserData, userId } = useAuth();

  // Load user data on mount
  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId, loadUserData]);

  // Initialize contacts, sessions, and SignalR
  useContacts();
  useSessions();
  useSignalR();

  return (
    <div className="min-h-screen bg-base-darkest cosmic-bg">
      <TopBar />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 min-w-0 p-4 lg:p-6">{children}</main>
        <RightSidebar />
      </div>
    </div>
  );
}
