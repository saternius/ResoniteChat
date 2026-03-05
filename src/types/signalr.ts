import type { OnlineStatus } from "./user";
import type { ResoniteMessage } from "./message";

export interface StatusUpdate {
  userId: string;
  onlineStatus: OnlineStatus;
  lastStatusChange: string;
  currentSessionAccessLevel?: number;
  currentSessionHidden?: boolean;
  currentHosting?: boolean;
  activeSessions?: {
    accessLevel: number;
    sessionId: string;
    isHost: boolean;
  }[];
  outputDevice?: string;
  isMobile?: boolean;
  compatibilityHash?: string;
  appVersion?: string;
}

export interface SignalREvents {
  ReceiveStatusUpdate: (update: StatusUpdate) => void;
  ReceiveMessage: (message: ResoniteMessage) => void;
  ReceiveSessionUpdate: (sessionId: string) => void;
  MessageSent: (message: ResoniteMessage) => void;
}

export type SignalRConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";
