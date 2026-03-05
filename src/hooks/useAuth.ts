"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useContactsStore } from "@/stores/contactsStore";
import { useSessionsStore } from "@/stores/sessionsStore";
import { useMessagesStore } from "@/stores/messagesStore";
import * as authApi from "@/lib/api/auth";
import * as contactsApi from "@/lib/api/contacts";
import * as sessionsApi from "@/lib/api/sessions";
import { stopConnection } from "@/lib/signalr/connection";

export function useAuth() {
  const router = useRouter();
  const {
    setAuth,
    setUser,
    setLoading,
    clearAuth,
    userId,
    token,
    isAuthenticated,
  } = useAuthStore();

  const handleLogin = useCallback(
    async (username: string, password: string, totp?: string) => {
      setLoading(true);
      try {
        const session = await authApi.login(username, password, totp);
        setAuth(session.userId, session.token, session.expire);

        // Fetch user profile
        const user = await authApi.getCurrentUser(session.userId);
        setUser(user);

        router.push("/");
        return { success: true };
      } catch (error: unknown) {
        const apiError = error as { status?: number; body?: { message?: string } };
        if (apiError.status === 403) {
          return { success: false, needsTotp: true };
        }
        return {
          success: false,
          error: apiError.body?.message || "Login failed",
        };
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setUser, setLoading, router],
  );

  const handleLogout = useCallback(async () => {
    if (userId && token) {
      try {
        await authApi.logout(userId, token);
      } catch {
        // ignore
      }
    }
    await stopConnection();
    clearAuth();
    useContactsStore.getState().setContacts([]);
    useSessionsStore.getState().setSessions([]);
    useMessagesStore.getState().setConversations([]);
    router.push("/login");
  }, [userId, token, clearAuth, router]);

  const loadUserData = useCallback(async () => {
    if (!userId) return;
    try {
      const user = await authApi.getCurrentUser(userId);
      setUser(user);
    } catch {
      // Token might be expired
      clearAuth();
      router.push("/login");
    }
  }, [userId, setUser, clearAuth, router]);

  return { handleLogin, handleLogout, loadUserData, isAuthenticated, userId };
}
