"use client";

import { useEffect, useState, useCallback } from "react";
import { Map, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { getUserRecords } from "@/lib/api/records";
import { Card, Badge, Button, Skeleton } from "@/components/ui";
import { getThumbnailUrl } from "@/lib/utils/resonite-urls";
import { formatRelativeTime } from "@/lib/utils/format";
import type { ResoniteRecord } from "@/types";

export default function MyWorldsPage() {
  const userId = useAuthStore((s) => s.userId);
  const [worlds, setWorlds] = useState<ResoniteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const records = await getUserRecords(userId);
      setWorlds(records.filter((r) => r.recordType === "world"));
    } catch (err) {
      console.error("Failed to load worlds:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="h-6 w-6 text-primary-light" />
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            My Worlds
          </h1>
          <span className="text-sm text-text-muted">({worlds.length})</span>
        </div>
        <Button variant="secondary" size="sm" onClick={load} loading={loading}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          : worlds.map((record) => (
              <Card key={record.id} hover className="overflow-hidden p-0">
                <div className="h-40 bg-base-dark overflow-hidden">
                  <img
                    src={getThumbnailUrl(record.thumbnailUri)}
                    alt={record.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).className = "hidden";
                    }}
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-heading text-base font-semibold text-text-primary truncate">
                    {record.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span>{formatRelativeTime(record.lastModificationTime)}</span>
                    {record.isPublic && <Badge variant="accent">Public</Badge>}
                    {record.visits > 0 && (
                      <span>{record.visits} visits</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
      </div>

      {!loading && worlds.length === 0 && (
        <div className="glass rounded-xl p-12 text-center text-text-muted">
          <Map className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No worlds found</p>
        </div>
      )}
    </div>
  );
}
