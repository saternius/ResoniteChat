export interface ResoniteContact {
  id: string;
  contactUsername: string;
  alternateUsernames?: string[];
  contactStatus: ContactStatus;
  isAccepted: boolean;
  profile?: ContactProfile;
  latestMessageTime: string;
  ownerId: string;
  isMigrated?: boolean;
}

export type ContactStatus =
  | "None"
  | "Ignored"
  | "Blocked"
  | "Requested"
  | "Accepted"
  | "SearchResult"
  | "HeadlessHost";

export interface ContactProfile {
  iconUrl?: string;
  displayBadges?: string[];
  tagline?: string;
}

export interface ContactWithStatus extends ResoniteContact {
  userStatus?: import("./user").UserStatus;
}
