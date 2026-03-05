import { api } from "./client";
import type { ResoniteUser, UserStatus } from "@/types";

export async function getUser(userId: string): Promise<ResoniteUser> {
  return api.get<ResoniteUser>(`/users/${userId}`);
}

export async function getUserStatus(userId: string): Promise<UserStatus> {
  return api.get<UserStatus>(`/users/${userId}/status`);
}

export async function searchUsers(query: string): Promise<ResoniteUser[]> {
  return api.get<ResoniteUser[]>("/users", { name: query });
}

export async function updateUserProfile(
  userId: string,
  profile: Partial<ResoniteUser["profile"]>,
): Promise<void> {
  await api.put(`/users/${userId}/profile`, profile);
}
