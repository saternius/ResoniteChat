"use client";

import * as signalR from "@microsoft/signalr";
import type { StatusUpdate, SignalRConnectionState } from "@/types";
import type { ResoniteMessage } from "@/types";

const HUB_URL = "/api/resonite/hub";

let connection: signalR.HubConnection | null = null;
let connectionVersion = 0;
let connectionState: SignalRConnectionState = "disconnected";
const stateListeners = new Set<(state: SignalRConnectionState) => void>();

function notifyStateChange(state: SignalRConnectionState) {
  connectionState = state;
  stateListeners.forEach((fn) => fn(state));
}

export function onConnectionStateChange(
  fn: (state: SignalRConnectionState) => void,
) {
  stateListeners.add(fn);
  return () => stateListeners.delete(fn);
}

export function getConnectionState(): SignalRConnectionState {
  return connectionState;
}

export function getConnection(): signalR.HubConnection | null {
  return connection;
}

export async function startConnection(
  userId: string,
  token: string,
): Promise<signalR.HubConnection> {
  // Bump version so any previous stopConnection call won't affect this connection
  const version = ++connectionVersion;

  if (connection) {
    const old = connection;
    connection = null;
    try { await old.stop(); } catch { /* ignore */ }
  }

  notifyStateChange("connecting");

  const newConnection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => `res ${userId}:${token}`,
      skipNegotiation: false,
      transport: signalR.HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(signalR.LogLevel.None)
    .build();

  connection = newConnection;

  newConnection.onreconnecting(() => notifyStateChange("reconnecting"));
  newConnection.onreconnected(() => notifyStateChange("connected"));
  newConnection.onclose(() => {
    if (connectionVersion === version) {
      notifyStateChange("disconnected");
    }
  });

  try {
    await newConnection.start();

    // Check if this connection was superseded while starting
    if (connectionVersion !== version) {
      try { await newConnection.stop(); } catch { /* ignore */ }
      throw new Error("Connection superseded");
    }

    notifyStateChange("connected");
    await newConnection.invoke("InitializeStatus");
  } catch (err) {
    if (connectionVersion === version) {
      notifyStateChange("disconnected");
    }
    throw err;
  }

  return newConnection;
}

export async function stopConnection(): Promise<void> {
  connectionVersion++;
  if (connection) {
    const old = connection;
    connection = null;
    try {
      await old.stop();
    } catch {
      // ignore
    }
    notifyStateChange("disconnected");
  }
}

export function onStatusUpdate(
  handler: (update: StatusUpdate) => void,
): () => void {
  if (!connection) return () => {};
  connection.on("ReceiveStatusUpdate", handler);
  return () => connection?.off("ReceiveStatusUpdate", handler);
}

export function onMessageReceived(
  handler: (message: ResoniteMessage) => void,
): () => void {
  if (!connection) return () => {};
  connection.on("ReceiveMessage", handler);
  return () => connection?.off("ReceiveMessage", handler);
}

export async function requestStatus(userIds: string[]): Promise<void> {
  if (!connection) return;

  // Batch to avoid rate limits - 10 at a time with 100ms delay
  for (let i = 0; i < userIds.length; i += 10) {
    const batch = userIds.slice(i, i + 10);
    await Promise.all(
      batch.map((id) =>
        connection!.invoke("RequestStatus", id).catch(() => {}),
      ),
    );
    if (i + 10 < userIds.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
}

export async function markMessagesRead(
  senderId: string,
  ids: string[],
): Promise<void> {
  if (!connection) throw new Error("Not connected");
  await connection.invoke("MarkMessagesRead", {
    senderId,
    readTime: new Date().toISOString(),
    ids,
  });
}

export async function sendSignalRMessage(
  recipientId: string,
  content: string,
  messageType = "Text",
): Promise<void> {
  if (!connection) throw new Error("Not connected");
  await connection.invoke("SendMessage", {
    recipientId,
    messageType,
    content,
  });
}
