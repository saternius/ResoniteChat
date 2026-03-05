"use client";

import { create } from "zustand";
import type { ResoniteMessage, Conversation } from "@/types";

interface MessagesState {
  conversations: Conversation[];
  activeMessages: ResoniteMessage[];
  activeContactId: string | null;
  isLoading: boolean;
  error: string | null;
  totalUnread: number;
  failedMessageIds: Set<string>;

  setConversations: (conversations: Conversation[]) => void;
  setActiveMessages: (messages: ResoniteMessage[]) => void;
  setActiveContactId: (contactId: string | null) => void;
  addMessage: (message: ResoniteMessage) => void;
  markMessageFailed: (messageId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUnreadCount: () => void;
}

export const useMessagesStore = create<MessagesState>()((set, get) => ({
  conversations: [],
  activeMessages: [],
  activeContactId: null,
  isLoading: false,
  error: null,
  totalUnread: 0,
  failedMessageIds: new Set(),

  setConversations: (conversations) => {
    set({ conversations });
    get().updateUnreadCount();
  },

  setActiveMessages: (activeMessages) => set({ activeMessages }),

  setActiveContactId: (activeContactId) => set({ activeContactId }),

  addMessage: (message) =>
    set((state) => {
      const newMessages = [...state.activeMessages, message];
      // Update conversation list
      const convIdx = state.conversations.findIndex(
        (c) =>
          c.contactId === message.senderId ||
          c.contactId === message.recipientId,
      );
      const updated = [...state.conversations];
      if (convIdx >= 0) {
        updated[convIdx] = {
          ...updated[convIdx],
          lastMessage: message,
          unreadCount: message.readTime
            ? updated[convIdx].unreadCount
            : updated[convIdx].unreadCount + 1,
        };
      }
      return { activeMessages: newMessages, conversations: updated };
    }),

  markMessageFailed: (messageId) =>
    set((state) => {
      const next = new Set(state.failedMessageIds);
      next.add(messageId);
      return { failedMessageIds: next };
    }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  updateUnreadCount: () => {
    const total = get().conversations.reduce(
      (sum, c) => sum + c.unreadCount,
      0,
    );
    set({ totalUnread: total });
  },
}));
