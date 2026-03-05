import { api, apiRequest } from "./client";
import type { AuthSession, ResoniteUser } from "@/types";

function generateMachineId(): string {
  return crypto.randomUUID();
}

async function generateUID(): Promise<string> {
  const data = new TextEncoder().encode(crypto.randomUUID());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

export async function login(
  username: string,
  password: string,
  totp?: string,
): Promise<AuthSession> {
  const uid = await generateUID();
  const headers: Record<string, string> = { UID: uid };
  if (totp) headers["TOTP"] = totp;

  const body = {
    username,
    authentication: {
      $type: "password",
      password,
    },
    secretMachineId: generateMachineId(),
    rememberMe: true,
  };

  const res = await apiRequest<{ entity: AuthSession }>("/userSessions", {
    method: "POST",
    body,
    headers,
  });
  return res.entity;
}

export async function logout(userId: string, token: string): Promise<void> {
  await api.delete(`/userSessions/${userId}/${token}`);
}

export async function getCurrentUser(userId: string): Promise<ResoniteUser> {
  return api.get<ResoniteUser>(`/users/${userId}`);
}

export async function getUserByName(username: string): Promise<ResoniteUser> {
  return api.get<ResoniteUser>(`/users/${username}`);
}

export async function getUser(userId: string): Promise<ResoniteUser> {
  return api.get<ResoniteUser>(`/users/${userId}`);
}
