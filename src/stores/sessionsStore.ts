"use client";

import { create } from "zustand";
import type { ResoniteSession } from "@/types";

interface SessionsState {
  sessions: ResoniteSession[];
  isLoading: boolean;
  error: string | null;
  filters: {
    name: string;
    minActiveUsers: number;
  };

  setSessions: (sessions: ResoniteSession[]) => void;
  patchThumbnail: (sessionId: string, thumbnailUrl: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<SessionsState["filters"]>) => void;

  getFeaturedSessions: () => ResoniteSession[];
  getSessionsWithFriends: (friendIds: Set<string>) => ResoniteSession[];
  getFilteredSessions: () => ResoniteSession[];
}

export const useSessionsStore = create<SessionsState>()((set, get) => ({
  sessions: [],
  isLoading: false,
  error: null,
  filters: { name: "", minActiveUsers: 0 },

  setSessions: (sessions) => set({ sessions, error: null }),
  patchThumbnail: (sessionId, thumbnailUrl) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.sessionId === sessionId ? { ...s, thumbnailUrl } : s,
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  getFeaturedSessions: () => {
    return [...get().sessions]
      .filter((s) => !s.hasEnded && s.activeUsers > 0)
      .sort((a, b) => b.activeUsers - a.activeUsers)
      .slice(0, 12);
  },

  getSessionsWithFriends: (friendIds) => {
    return get().sessions.filter(
      (s) =>
        !s.hasEnded &&
        s.sessionUsers?.some((u) => u.userID && friendIds.has(u.userID)),
    );
  },

  getFilteredSessions: () => {
    const { sessions, filters } = get();
    return sessions.filter((s) => {
      if (s.hasEnded) return false;
      if (filters.minActiveUsers && s.activeUsers < filters.minActiveUsers) return false;
      if (filters.name && !s.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      return true;
    });
  },
}));
