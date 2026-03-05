"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useMessagesStore } from "@/stores/messagesStore";
import { useContactsStore } from "@/stores/contactsStore";
import * as messagesApi from "@/lib/api/messages";
import { sendSignalRMessage, markMessagesRead } from "@/lib/signalr/connection";
import type { Conversation, ResoniteMessage } from "@/types";

export function useMessages() {
  const userId = useAuthStore((s) => s.userId);
  const {
    conversations,
    activeMessages,
    activeContactId,
    isLoading,
    failedMessageIds,
    setConversations,
    setActiveMessages,
    setActiveContactId,
    setLoading,
    setError,
    markMessageFailed,
  } = useMessagesStore();
  const contacts = useContactsStore((s) => s.contacts);
  const loadingThreadRef = useRef<string | null>(null);

  const loadConversations = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const messages = await messagesApi.getMessages(userId, { maxItems: 100 });

      // Group by contact
      const convMap = new Map<string, { messages: ResoniteMessage[]; unread: number }>();
      for (const msg of messages) {
        const contactId = msg.senderId === userId ? msg.recipientId : msg.senderId;
        if (!convMap.has(contactId)) {
          convMap.set(contactId, { messages: [], unread: 0 });
        }
        const conv = convMap.get(contactId)!;
        conv.messages.push(msg);
        if (!msg.readTime && msg.senderId !== userId) {
          conv.unread++;
        }
      }

      const convList: Conversation[] = [];
      for (const [contactId, { messages: msgs, unread }] of convMap) {
        const sorted = msgs.sort(
          (a, b) => new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime(),
        );
        const contact = contacts.find((c) => c.id === contactId);
        convList.push({
          contactId,
          contactUsername: contact?.contactUsername ?? contactId,
          lastMessage: sorted[0],
          unreadCount: unread,
        });
      }

      convList.sort(
        (a, b) =>
          new Date(b.lastMessage?.sendTime ?? 0).getTime() -
          new Date(a.lastMessage?.sendTime ?? 0).getTime(),
      );

      setConversations(convList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [userId, contacts, setConversations, setLoading, setError]);

  const loadThread = useCallback(
    async (contactId: string) => {
      if (!userId) return;
      // Dedup: skip if already loading this same contact
      if (loadingThreadRef.current === contactId) return;
      loadingThreadRef.current = contactId;
      setActiveContactId(contactId);
      setLoading(true);
      try {
        const msgs = await messagesApi.getMessagesWith(userId, contactId, {
          maxItems: 100,
        });
        setActiveMessages(
          msgs.sort(
            (a, b) =>
              new Date(a.sendTime).getTime() - new Date(b.sendTime).getTime(),
          ),
        );

        // Mark unread as read via SignalR
        const unread = msgs.filter((m) => !m.readTime && m.senderId !== userId);
        if (unread.length > 0) {
          markMessagesRead(
            contactId,
            unread.map((m) => m.id),
          ).catch(() => {});
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load thread");
      } finally {
        loadingThreadRef.current = null;
        setLoading(false);
      }
    },
    [userId, setActiveMessages, setActiveContactId, setLoading, setError],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!userId || !activeContactId) return;
      const now = new Date().toISOString();
      const optimisticMsg: ResoniteMessage = {
        id: `MSG-${crypto.randomUUID()}`,
        senderId: userId,
        recipientId: activeContactId,
        ownerId: userId,
        messageType: "Text",
        content,
        sendTime: now,
        lastUpdateTime: now,
      };
      // Optimistically append to active messages
      setActiveMessages([...activeMessages, optimisticMsg]);
      try {
        await sendSignalRMessage(userId, activeContactId, content);
      } catch {
        markMessageFailed(optimisticMsg.id);
      }
    },
    [userId, activeContactId, activeMessages, setActiveMessages, markMessageFailed],
  );

  return {
    conversations,
    activeMessages,
    activeContactId,
    isLoading,
    failedMessageIds,
    loadConversations,
    loadThread,
    sendMessage,
  };
}
