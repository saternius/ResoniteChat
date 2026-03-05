"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useContactsStore } from "@/stores/contactsStore";
import { useMessagesStore } from "@/stores/messagesStore";
import {
  startConnection,
  stopConnection,
  onStatusUpdate,
  onMessageReceived,
} from "@/lib/signalr/connection";

export function useSignalR() {
  const userId = useAuthStore((s) => s.userId);
  const token = useAuthStore((s) => s.token);
  const updateStatus = useContactsStore((s) => s.updateStatus);
  const addMessage = useMessagesStore((s) => s.addMessage);
  const connected = useRef(false);

  useEffect(() => {
    if (!userId || !token) return;

    let cancelled = false;
    let cleanupStatus: (() => void) | undefined;
    let cleanupMessage: (() => void) | undefined;

    const connect = async () => {
      try {
        await startConnection(userId, token);
        if (cancelled) {
          stopConnection();
          return;
        }

        cleanupStatus = onStatusUpdate((update) => {
          updateStatus(update.userId, {
            onlineStatus: update.onlineStatus,
            lastStatusChange: update.lastStatusChange,
            currentSessionAccessLevel: update.currentSessionAccessLevel ?? 0,
            currentSessionHidden: update.currentSessionHidden ?? false,
            currentHosting: update.currentHosting ?? false,
            isMobile: update.isMobile ?? false,
            activeSessions: update.activeSessions,
          });
        });

        cleanupMessage = onMessageReceived((message) => {
          addMessage(message);
        });
      } catch (err) {
        if (!cancelled) {
          console.error("SignalR failed to connect:", err);
        }
      }
    };

    connect();

    return () => {
      cancelled = true;
      cleanupStatus?.();
      cleanupMessage?.();
      stopConnection();
    };
  }, [userId, token, updateStatus, addMessage]);
}
