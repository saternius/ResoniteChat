import { api } from "./client";
import type { ResoniteContact } from "@/types";

export async function getContacts(userId: string): Promise<ResoniteContact[]> {
  return api.get<ResoniteContact[]>(`/users/${userId}/contacts`);
}

export async function getContact(userId: string, contactId: string): Promise<ResoniteContact> {
  return api.get<ResoniteContact>(`/users/${userId}/contacts/${contactId}`);
}
