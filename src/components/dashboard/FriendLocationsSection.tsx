"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { useSessionsStore } from "@/stores/sessionsStore";
import { useContactsStore } from "@/stores/contactsStore";
import { SessionCard } from "./SessionCard";
import { SessionDetailModal } from "@/components/sessions/SessionDetailModal";
import type { ResoniteSession } from "@/types";

export function FriendLocationsSection() {
  const sessions = useSessionsStore((s) => s.sessions);
  const contacts = useContactsStore((s) => s.contacts);

  const [selectedSession, setSelectedSession] = useState<ResoniteSession | null>(null);

  const friendSessions = useMemo(() => {
    const friendIds = new Set(
      contacts
        .filter((c) => c.contactStatus === "Accepted")
        .map((c) => c.id),
    );

    if (friendIds.size === 0) return [];

    return sessions
      .filter(
        (s) =>
          !s.hasEnded &&
          s.sessionUsers?.some((u) => u.userID && friendIds.has(u.userID)),
      )
      .map((session) => {
        const friendsInSession = session.sessionUsers
          ?.filter((u) => u.userID && friendIds.has(u.userID))
          .map((u) => u.username) ?? [];
        return { session, friendNames: friendsInSession };
      })
      .sort((a, b) => b.friendNames.length - a.friendNames.length)
      .slice(0, 6);
  }, [sessions, contacts]);

  if (friendSessions.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-accent" />
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          Friend Locations
        </h2>
        <span className="text-xs text-text-muted bg-base-lighter px-2 py-0.5 rounded-full">
          {friendSessions.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {friendSessions.map(({ session, friendNames }) => (
          <SessionCard
            key={session.sessionId}
            session={session}
            showFriends={friendNames}
            onClick={setSelectedSession}
          />
        ))}
      </div>

      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </section>
  );
}
