"use client";

import { useAuthStore } from "@/stores/authStore";
import { getGreeting } from "@/lib/utils/format";

export function GreetingHeader() {
  const user = useAuthStore((s) => s.user);
  const greeting = getGreeting();

  return (
    <div className="space-y-1">
      <h1 className="font-heading text-3xl font-bold text-text-primary">
        {greeting},{" "}
        <span className="text-primary-light glow-text-primary">
          {user?.username ?? "User"}
        </span>
      </h1>
      <p className="text-text-muted text-sm">
        Here&apos;s what&apos;s happening in Resonite right now
      </p>
    </div>
  );
}
