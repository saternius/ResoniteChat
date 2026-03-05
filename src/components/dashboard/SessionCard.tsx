"use client";

import { Users, Globe, Monitor } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { getThumbnailUrl } from "@/lib/utils/resonite-urls";
import { ACCESS_LEVEL_LABELS } from "@/lib/constants";
import type { ResoniteSession } from "@/types";

interface SessionCardProps {
  session: ResoniteSession;
  showFriends?: string[];
  onClick?: (session: ResoniteSession) => void;
}

export function SessionCard({ session, showFriends, onClick }: SessionCardProps) {
  const thumbnailUrl = getThumbnailUrl(session.thumbnailUrl);

  return (
    <Card hover className="overflow-hidden p-0 group" onClick={() => onClick?.(session)}>
      {/* Thumbnail */}
      <div className="relative h-40 bg-base-dark overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={session.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "";
            (e.target as HTMLImageElement).className = "hidden";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-darkest/80 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-text-primary">
            <Users className="h-3.5 w-3.5" />
            <span className="font-medium">
              {session.activeUsers}/{session.maxUsers}
            </span>
          </div>
          <Badge variant={session.accessLevel === "Anyone" ? "accent" : "default"}>
            {ACCESS_LEVEL_LABELS[session.accessLevel] ?? session.accessLevel}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-heading text-base font-semibold text-text-primary truncate">
          {session.name}
        </h3>

        {session.hostUsername && (
          <p className="text-xs text-text-muted flex items-center gap-1.5">
            <Monitor className="h-3 w-3" />
            {session.hostUsername}
            {session.headlessHost && (
              <Badge variant="primary" className="ml-1">Headless</Badge>
            )}
          </p>
        )}

        {showFriends && showFriends.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {showFriends.map((name) => (
              <Badge key={name} variant="accent">{name}</Badge>
            ))}
          </div>
        )}

        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {session.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-text-muted bg-base-lighter px-1.5 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
