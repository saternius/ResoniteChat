import { api } from "./client";
import type { ResoniteRecord } from "@/types";

export async function getUserRecords(
  userId: string,
  path?: string,
): Promise<ResoniteRecord[]> {
  return api.get<ResoniteRecord[]>(`/users/${userId}/records`, path ? { path } : undefined);
}

export async function getRecord(
  ownerId: string,
  recordId: string,
): Promise<ResoniteRecord> {
  return api.get<ResoniteRecord>(`/users/${ownerId}/records/${recordId}`);
}

export async function searchRecords(
  query: string,
  recordType?: string,
): Promise<ResoniteRecord[]> {
  return api.get<ResoniteRecord[]>("/records", {
    name: query,
    recordType,
  });
}
