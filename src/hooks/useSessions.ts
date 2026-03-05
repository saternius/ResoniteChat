"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useSessionsStore } from "@/stores/sessionsStore";
import * as sessionsApi from "@/lib/api/sessions";
import * as recordsApi from "@/lib/api/records";
import { resdbToHttps } from "@/lib/utils/resonite-urls";
import type { ResoniteSession } from "@/types";

// Cache resolved thumbnails across re-renders so we don't refetch
const thumbnailCache = new Map<string, string | null>();
// Cache record lookups by ownerId:recordId to avoid duplicate requests for the same record
const recordCache = new Map<string, Promise<string | null>>();

const BATCH_SIZE = 6;

function fetchRecordThumbnail(ownerId: string, recordId: string): Promise<string | null> {
  const key = `${ownerId}:${recordId}`;
  const cached = recordCache.get(key);
  if (cached) return cached;

  const promise = recordsApi
    .getRecord(ownerId, recordId)
    .then((record) => {
      if (record.thumbnailUri) {
        return resdbToHttps(record.thumbnailUri) ?? null;
      }
      return null;
    })
    .catch(() => null);

  recordCache.set(key, promise);
  return promise;
}

async function resolveThumbnails(
  sessions: ResoniteSession[],
  patchThumbnail: (sessionId: string, thumbnailUrl: string) => void,
) {
  const missing = sessions.filter(
    (s) =>
      !s.thumbnailUrl &&
      s.correspondingWorldId &&
      !thumbnailCache.has(s.sessionId),
  );

  if (missing.length === 0) return;

  // Process in batches to avoid hammering the API
  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = missing.slice(i, i + BATCH_SIZE);
    await Promise.allSettled(
      batch.map(async (session) => {
        const { ownerId, recordId } = session.correspondingWorldId!;
        const url = await fetchRecordThumbnail(ownerId, recordId);
        thumbnailCache.set(session.sessionId, url);
        if (url) {
          patchThumbnail(session.sessionId, url);
        }
      }),
    );
  }
}

export function useSessions() {
  const userId = useAuthStore((s) => s.userId);
  const { sessions, isLoading, setSessions, patchThumbnail, setLoading, setError } =
    useSessionsStore();
  const resolvingRef = useRef(false);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sessionsApi.getSessions({ minActiveUsers: 1 });
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, [setSessions, setLoading, setError]);

  useEffect(() => {
    if (userId && sessions.length === 0) {
      loadSessions();
    }
  }, [userId, sessions.length, loadSessions]);

  // Resolve missing thumbnails in background after sessions load
  useEffect(() => {
    if (sessions.length === 0 || isLoading || resolvingRef.current) return;
    resolvingRef.current = true;

    // Apply cached thumbnails immediately
    for (const s of sessions) {
      if (!s.thumbnailUrl && thumbnailCache.has(s.sessionId)) {
        const cached = thumbnailCache.get(s.sessionId);
        if (cached) patchThumbnail(s.sessionId, cached);
      }
    }

    resolveThumbnails(sessions, patchThumbnail).finally(() => {
      resolvingRef.current = false;
    });
  }, [sessions, isLoading, patchThumbnail]);

  return { sessions, isLoading, loadSessions };
}
