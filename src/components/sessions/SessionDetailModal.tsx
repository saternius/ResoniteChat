"use client";

import { useEffect, useCallback } from "react";
import {
  X,
  Users,
  Monitor,
  Smartphone,
  Clock,
  Hash,
  Server,
  ExternalLink,
} from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { getThumbnailUrl } from "@/lib/utils/resonite-urls";
import { ACCESS_LEVEL_LABELS } from "@/lib/constants";
import { formatSessionTime } from "@/lib/utils/format";
import type { ResoniteSession } from "@/types";

interface SessionDetailModalProps {
  session: ResoniteSession;
  onClose: () => void;
}

export function SessionDetailModal({
  session,
  onClose,
}: SessionDetailModalProps) {
  const thumbnailUrl = getThumbnailUrl(session.thumbnailUrl);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [handleEscape]);

  function handleJoin() {
    window.open("steam://run/2519830");
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-[10vh] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-base-darkest/60 hover:bg-base-darkest/80 text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with thumbnail */}
        <div className="relative h-56 overflow-hidden rounded-t-2xl">
          <img
            src={thumbnailUrl}
            alt={session.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "";
              (e.target as HTMLImageElement).className = "hidden";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-darkest via-base-darkest/40 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <h2 className="font-heading text-xl font-bold text-text-primary mb-2">
              {session.name}
            </h2>
            <Badge
              variant={
                session.accessLevel === "Anyone" ? "accent" : "default"
              }
            >
              {ACCESS_LEVEL_LABELS[session.accessLevel] ??
                session.accessLevel}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Users className="h-4 w-4 text-primary-light" />
              <span className="font-medium">
                {session.activeUsers} / {session.maxUsers}
              </span>
              <span className="text-text-muted">users</span>
            </div>
            {session.mobileFriendly && (
              <Badge variant="success">
                <Smartphone className="h-3 w-3" />
                Mobile Friendly
              </Badge>
            )}
            {session.headlessHost && (
              <Badge variant="primary">
                <Server className="h-3 w-3" />
                Headless
              </Badge>
            )}
          </div>

          {/* Host */}
          {session.hostUsername && (
            <div className="flex items-center gap-2 text-sm">
              <Monitor className="h-4 w-4 text-text-muted" />
              <span className="text-text-muted">Host:</span>
              <span className="text-text-primary font-medium">
                {session.hostUsername}
              </span>
            </div>
          )}

          {/* Description */}
          {session.description && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Description
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {session.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {session.tags && session.tags.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {session.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-text-muted bg-base-lighter px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Users list */}
          {session.sessionUsers && session.sessionUsers.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Users ({session.sessionUsers.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {session.sessionUsers.map((user, i) => (
                  <div
                    key={user.userID ?? i}
                    className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg bg-base-light/50"
                  >
                    <span
                      className={`h-2 w-2 rounded-full flex-shrink-0 ${
                        user.isPresent
                          ? "bg-status-online"
                          : "bg-status-offline"
                      }`}
                    />
                    <span className="text-text-secondary truncate">
                      {user.username}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-muted">
              {session.appVersion && (
                <div className="flex items-center gap-1.5">
                  <Hash className="h-3 w-3" />
                  Version: {session.appVersion}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Started: {formatSessionTime(session.sessionBeginTime)}
              </div>
              <div className="flex items-center gap-1.5 col-span-full">
                <Hash className="h-3 w-3" />
                <span className="truncate">ID: {session.sessionId}</span>
              </div>
            </div>
          </div>

          {/* Join button */}
          <div className="space-y-2 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleJoin}
            >
              <ExternalLink className="h-4 w-4" />
              Join Now
            </Button>
            <p className="text-center text-xs text-text-muted">
              Don&apos;t have Resonite?{" "}
              <a
                href="https://store.steampowered.com/app/2519830/Resonite/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-light hover:underline"
              >
                Get it on Steam
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
