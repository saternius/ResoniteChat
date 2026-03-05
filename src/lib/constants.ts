import {
  Home,
  Globe,
  Map,
  Box,
  MessageSquare,
  Users,
  UserCircle,
  Settings,
  Download,
} from "lucide-react";

export const API_BASE = "/api/resonite";
export const RESONITE_API = "https://api.resonite.com";
export const ASSETS_BASE = "/api/assets";

export const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Sessions", href: "/sessions", icon: Globe },
  { label: "My Worlds", href: "/my-worlds", icon: Map },
  { label: "Inventory", href: "/inventory", icon: Box },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Groups", href: "/groups", icon: Users },
  { label: "Contacts", href: "/contacts", icon: UserCircle },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Download", href: "/download", icon: Download },
] as const;

export const STATUS_COLORS: Record<string, string> = {
  Online: "bg-status-online",
  Away: "bg-status-away",
  Busy: "bg-status-busy",
  Offline: "bg-status-offline",
  Invisible: "bg-status-offline",
};

export const STATUS_LABELS: Record<string, string> = {
  Online: "Online",
  Away: "Away",
  Busy: "Busy",
  Offline: "Offline",
  Invisible: "Offline",
};

export const ACCESS_LEVEL_LABELS: Record<string, string> = {
  Private: "Private",
  LAN: "LAN",
  Contacts: "Contacts",
  ContactsPlus: "Contacts+",
  RegisteredUsers: "Registered",
  Anyone: "Public",
};
