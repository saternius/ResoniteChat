import { api } from "./client";
import type { ResoniteMessage } from "@/types";

export async function getMessages(
  userId: string,
  params?: { unread?: boolean; fromTime?: string; maxItems?: number; user?: string },
): Promise<ResoniteMessage[]> {
  return api.get<ResoniteMessage[]>(`/users/${userId}/messages`, params as Record<string, string | number | boolean | undefined>);
}

export async function getMessagesWith(
  userId: string,
  contactId: string,
  params?: { maxItems?: number; fromTime?: string },
): Promise<ResoniteMessage[]> {
  return getMessages(userId, { ...params, user: contactId });
}
