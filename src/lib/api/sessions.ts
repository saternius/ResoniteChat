import { api } from "./client";
import type { ResoniteSession } from "@/types";

export async function getSessions(params?: {
  name?: string;
  minActiveUsers?: number;
  includeEmptyHeadless?: boolean;
}): Promise<ResoniteSession[]> {
  return api.get<ResoniteSession[]>("/sessions", params as Record<string, string | number | boolean | undefined>);
}

export async function getSession(sessionId: string): Promise<ResoniteSession> {
  return api.get<ResoniteSession>(`/sessions/${sessionId}`);
}
