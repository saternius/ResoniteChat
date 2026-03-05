export interface ResoniteUser {
  id: string;
  username: string;
  normalizedUsername: string;
  email?: string;
  registrationDate: string;
  isVerified: boolean;
  quotaBytes: number;
  usedBytes: number;
  isLocked: boolean;
  suppressBanEvasion: boolean;
  "2fa_login": boolean;
  profile?: UserProfile;
  entitlements?: Entitlement[];
  migratedData?: Record<string, unknown>;
  tags?: string[];
}

export interface UserProfile {
  iconUrl?: string;
  displayBadges?: string[];
  tagline?: string;
  description?: string;
  profileWorldUrl?: string;
}

export interface Entitlement {
  $type: string;
  name?: string;
  group?: string;
  badgeType?: string;
  badgeCount?: number;
  friendlyDescription?: string;
  entitlementOrigins?: string[];
}

export interface UserStatus {
  onlineStatus: OnlineStatus;
  lastStatusChange: string;
  currentSessionAccessLevel: number;
  currentSessionHidden: boolean;
  currentHosting: boolean;
  compatibilityHash?: string;
  neosVersion?: string;
  outputDevice?: string;
  isMobile: boolean;
  activeSessions?: ActiveSession[];
}

export interface ActiveSession {
  accessLevel: number;
  sessionId: string;
  isHost: boolean;
}

export type OnlineStatus = "Online" | "Away" | "Busy" | "Offline" | "Invisible";

export interface LoginCredentials {
  username: string;
  password: string;
  totp?: string;
}

export interface AuthSession {
  userId: string;
  token: string;
  created: string;
  expire: string;
  rememberMe: boolean;
  secretMachineIdHash: string;
  secretMachineIdSalt: string;
  uid: string;
  partitionKey: string;
  isMigratedSession: boolean;
}
