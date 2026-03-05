"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Folder, ChevronRight, ArrowLeft, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { getUserRecords } from "@/lib/api/records";
import { Card, Button, Skeleton } from "@/components/ui";
import { getThumbnailUrl } from "@/lib/utils/resonite-urls";
import { formatRelativeTime } from "@/lib/utils/format";
import type { ResoniteRecord } from "@/types";

export default function InventoryPage() {
  const userId = useAuthStore((s) => s.userId);
  const [records, setRecords] = useState<ResoniteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState("Inventory");
  const [pathHistory, setPathHistory] = useState<string[]>(["Inventory"]);

  const load = useCallback(
    async (path: string) => {
      if (!userId) return;
      setLoading(true);
      try {
        const data = await getUserRecords(userId, path);
        setRecords(data);
        setCurrentPath(path);
      } catch (err) {
        console.error("Failed to load inventory:", err);
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    load("Inventory");
  }, [load]);

  const navigateTo = (path: string) => {
    setPathHistory((prev) => [...prev, path]);
    load(path);
  };

  const goBack = () => {
    if (pathHistory.length <= 1) return;
    const newHistory = pathHistory.slice(0, -1);
    setPathHistory(newHistory);
    load(newHistory[newHistory.length - 1]);
  };

  const pathParts = currentPath.split("\\").filter(Boolean);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box className="h-6 w-6 text-accent" />
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            Inventory
          </h1>
        </div>
        <Button variant="secondary" size="sm" onClick={() => load(currentPath)} loading={loading}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm flex-wrap">
        {pathHistory.length > 1 && (
          <button
            onClick={goBack}
            className="p-1 rounded hover:bg-surface-hover text-text-muted hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        {pathParts.map((part, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 text-text-muted" />}
            <span
              className={
                i === pathParts.length - 1
                  ? "text-primary-light font-medium"
                  : "text-text-muted cursor-pointer hover:text-text-secondary"
              }
              onClick={() => {
                if (i < pathParts.length - 1) {
                  const newPath = pathParts.slice(0, i + 1).join("\\");
                  navigateTo(newPath);
                }
              }}
            >
              {part}
            </span>
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <Skeleton className="aspect-square w-full rounded-none" />
                <div className="p-3 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))
          : records.map((record) => (
              <Card
                key={record.id}
                hover
                className="overflow-hidden p-0 cursor-pointer"
                onClick={() => {
                  if (record.recordType === "directory" && record.path) {
                    navigateTo(record.path + "\\" + record.name);
                  }
                }}
              >
                <div className="aspect-square bg-base-dark overflow-hidden flex items-center justify-center">
                  {record.recordType === "directory" ? (
                    <Folder className="h-16 w-16 text-primary/30" />
                  ) : (
                    <img
                      src={getThumbnailUrl(record.thumbnailUri)}
                      alt={record.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).className = "hidden";
                      }}
                    />
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="text-sm font-medium text-text-primary truncate flex items-center gap-1.5">
                    {record.recordType === "directory" && (
                      <Folder className="h-3.5 w-3.5 text-primary-light flex-shrink-0" />
                    )}
                    {record.name}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {formatRelativeTime(record.lastModificationTime)}
                  </p>
                </div>
              </Card>
            ))}
      </div>

      {!loading && records.length === 0 && (
        <div className="glass rounded-xl p-12 text-center text-text-muted">
          <Box className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>This folder is empty</p>
        </div>
      )}
    </div>
  );
}
