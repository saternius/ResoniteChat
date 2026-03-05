"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useContactsStore } from "@/stores/contactsStore";
import * as contactsApi from "@/lib/api/contacts";
import { requestStatus } from "@/lib/signalr/connection";

export function useContacts() {
  const userId = useAuthStore((s) => s.userId);
  const { contacts, isLoading, setContacts, setLoading, setError } =
    useContactsStore();

  const loadContacts = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await contactsApi.getContacts(userId);
      setContacts(data);

      // Request status for all accepted contacts
      const acceptedIds = data
        .filter((c) => c.contactStatus === "Accepted")
        .map((c) => c.id);
      if (acceptedIds.length > 0) {
        requestStatus(acceptedIds).catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [userId, setContacts, setLoading, setError]);

  useEffect(() => {
    if (userId && contacts.length === 0) {
      loadContacts();
    }
  }, [userId, contacts.length, loadContacts]);

  return { contacts, isLoading, loadContacts };
}
