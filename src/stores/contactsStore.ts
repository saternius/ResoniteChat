"use client";

import { create } from "zustand";
import type { ResoniteContact, UserStatus, OnlineStatus } from "@/types";

interface ContactsState {
  contacts: ResoniteContact[];
  statusMap: Record<string, UserStatus>;
  isLoading: boolean;
  error: string | null;

  setContacts: (contacts: ResoniteContact[]) => void;
  updateStatus: (userId: string, status: UserStatus) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  getOnlineContacts: () => ResoniteContact[];
  getContactStatus: (contactId: string) => OnlineStatus;
  getContactsByStatus: () => Record<OnlineStatus, ResoniteContact[]>;
}

export const useContactsStore = create<ContactsState>()((set, get) => ({
  contacts: [],
  statusMap: {},
  isLoading: false,
  error: null,

  setContacts: (contacts) => set({ contacts, error: null }),

  updateStatus: (userId, status) =>
    set((state) => ({
      statusMap: { ...state.statusMap, [userId]: status },
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  getOnlineContacts: () => {
    const { contacts, statusMap } = get();
    return contacts.filter((c) => {
      const status = statusMap[c.id]?.onlineStatus;
      return status === "Online" || status === "Away" || status === "Busy";
    });
  },

  getContactStatus: (contactId) => {
    return get().statusMap[contactId]?.onlineStatus ?? "Offline";
  },

  getContactsByStatus: () => {
    const { contacts, statusMap } = get();
    const grouped: Record<OnlineStatus, ResoniteContact[]> = {
      Online: [],
      Away: [],
      Busy: [],
      Offline: [],
      Invisible: [],
    };
    for (const contact of contacts) {
      if (contact.contactStatus !== "Accepted") continue;
      const status = statusMap[contact.id]?.onlineStatus ?? "Offline";
      grouped[status].push(contact);
    }
    return grouped;
  },
}));
