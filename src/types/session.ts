export interface ResoniteSession {
  name: string;
  description?: string;
  correspondingWorldId?: RecordId;
  tags?: string[];
  sessionId: string;
  normalizedSessionId: string;
  hostUserId?: string;
  hostUsername?: string;
  hostMachineId?: string;
  hostSessionId?: string;
  compatibilityHash?: string;
  universeId?: string;
  appVersion?: string;
  headlessHost: boolean;
  sessionURLs?: string[];
  parentSessionIds?: string[];
  nestedSessionIds?: string[];
  sessionUsers?: SessionUser[];
  thumbnailUrl?: string;
  joinedUsers: number;
  activeUsers: number;
  totalJoinedUsers: number;
  totalActiveUsers: number;
  maxUsers: number;
  mobileFriendly: boolean;
  sessionBeginTime: string;
  lastUpdate: string;
  accessLevel: SessionAccessLevel;
  hideFromListing: boolean;
  hasEnded: boolean;
  isValid: boolean;
}

export interface SessionUser {
  username: string;
  userID?: string;
  isPresent: boolean;
  outputDevice?: number;
}

export interface RecordId {
  recordId: string;
  ownerId: string;
}

export type SessionAccessLevel =
  | "Private"
  | "LAN"
  | "Contacts"
  | "ContactsPlus"
  | "RegisteredUsers"
  | "Anyone";

export interface SessionFilters {
  name?: string;
  minActiveUsers?: number;
  includeEmptyHeadless?: boolean;
}
