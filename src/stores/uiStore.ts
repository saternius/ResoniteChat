"use client";

import { create } from "zustand";

interface UIState {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  mobileMenuOpen: boolean;

  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  mobileMenuOpen: false,

  toggleLeftSidebar: () =>
    set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen })),
  toggleRightSidebar: () =>
    set((s) => ({ rightSidebarOpen: !s.rightSidebarOpen })),
  toggleMobileMenu: () =>
    set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));
