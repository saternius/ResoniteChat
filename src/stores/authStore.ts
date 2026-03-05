"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResoniteUser } from "@/types";

interface AuthState {
  userId: string | null;
  token: string | null;
  expiry: string | null;
  user: ResoniteUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (userId: string, token: string, expiry: string) => void;
  setUser: (user: ResoniteUser) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  isExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userId: null,
      token: null,
      expiry: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (userId, token, expiry) => {
        set({ userId, token, expiry, isAuthenticated: true });
        // Set a lightweight cookie for middleware
        document.cookie = `resonite-auth=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`;
      },

      setUser: (user) => set({ user }),

      setLoading: (isLoading) => set({ isLoading }),

      clearAuth: () => {
        set({
          userId: null,
          token: null,
          expiry: null,
          user: null,
          isAuthenticated: false,
        });
        document.cookie = "resonite-auth=; path=/; max-age=0";
      },

      isExpired: () => {
        const { expiry } = get();
        if (!expiry) return true;
        return new Date(expiry) <= new Date();
      },
    }),
    {
      name: "resonite-auth",
      partialize: (state) => ({
        userId: state.userId,
        token: state.token,
        expiry: state.expiry,
      }),
    },
  ),
);
