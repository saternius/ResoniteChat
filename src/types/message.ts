export interface ResoniteMessage {
  id: string;
  senderId: string;
  senderUsername?: string;
  recipientId: string;
  recipientUsername?: string;
  messageType: MessageType;
  content: string;
  sendTime: string;
  lastUpdateTime: string;
  readTime?: string;
  isMigrated?: boolean;
  ownerId: string;
}

export type MessageType =
  | "Text"
  | "Object"
  | "Sound"
  | "SessionInvite"
  | "CreditTransfer"
  | "SugarCubes";

export interface Conversation {
  contactId: string;
  contactUsername: string;
  lastMessage?: ResoniteMessage;
  unreadCount: number;
}
