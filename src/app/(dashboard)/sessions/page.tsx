"use client";

import { useEffect, useCallback, useState } from "react";
import { Globe, Search, RefreshCw } from "lucide-react";
import { useSessionsStore } from "@/stores/sessionsStore";
import { SessionCard } from "@/components/dashboard/SessionCard";
import { SessionDetailModal } from "@/components/sessions/SessionDetailModal";
import { SessionCardSkeleton } from "@/components/ui";
import { Button, Input } from "@/components/ui";
import { useSessions } from "@/hooks/useSessions";
import type { ResoniteSession } from "@/types";

export default function SessionsPage() {
  const { loadSessions, isLoading } = useSessions();
  const { filters, setFilters, getFilteredSessions } = useSessionsStore();
  const filtered = getFilteredSessions();
  const [searchInput, setSearchInput] = useState(filters.name);
  const [selectedSession, setSelectedSession] = useState<ResoniteSession | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ name: searchInput });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-accent" />
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            Active Sessions
          </h1>
          <span className="text-sm text-text-muted">({filtered.length})</span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => loadSessions()}
          loading={isLoading}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search sessions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex gap-2">
          {[0, 2, 5, 10].map((min) => (
            <Button
              key={min}
              variant={filters.minActiveUsers === min ? "primary" : "secondary"}
              size="sm"
              onClick={() => setFilters({ minActiveUsers: min })}
            >
              {min === 0 ? "All" : `${min}+`}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => (
              <SessionCardSkeleton key={i} />
            ))
          : filtered.map((session) => (
              <SessionCard key={session.sessionId} session={session} onClick={setSelectedSession} />
            ))}
      </div>

      {!isLoading && filtered.length === 0 && (
        <div className="glass rounded-xl p-12 text-center text-text-muted">
          <Globe className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No sessions match your filters</p>
        </div>
      )}

      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}
