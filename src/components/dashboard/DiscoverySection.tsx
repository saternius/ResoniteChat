"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { useSessionsStore } from "@/stores/sessionsStore";
import { SessionCard } from "./SessionCard";
import { SessionDetailModal } from "@/components/sessions/SessionDetailModal";
import { SessionCardSkeleton } from "@/components/ui";
import type { ResoniteSession } from "@/types";

export function DiscoverySection() {
  const isLoading = useSessionsStore((s) => s.isLoading);
  const sessions = useSessionsStore((s) => s.sessions);

  const [selectedSession, setSelectedSession] = useState<ResoniteSession | null>(null);

  const featured = useMemo(
    () =>
      [...sessions]
        .filter((s) => !s.hasEnded && s.activeUsers > 0)
        .sort((a, b) => b.activeUsers - a.activeUsers)
        .slice(0, 12),
    [sessions],
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary-light" />
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          Featured Sessions
        </h2>
        <span className="text-xs text-text-muted bg-base-lighter px-2 py-0.5 rounded-full">
          Most Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SessionCardSkeleton key={i} />
            ))
          : featured.map((session) => (
              <SessionCard key={session.sessionId} session={session} onClick={setSelectedSession} />
            ))}
      </div>

      {!isLoading && featured.length === 0 && (
        <div className="glass rounded-xl p-8 text-center text-text-muted">
          No active sessions found
        </div>
      )}

      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </section>
  );
}
