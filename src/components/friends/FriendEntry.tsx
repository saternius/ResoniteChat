"use client";

import { Avatar, StatusDot } from "@/components/ui";
import type { ResoniteContact, OnlineStatus, UserStatus } from "@/types";
import { cn } from "@/lib/utils/format";

interface FriendEntryProps {
  contact: ResoniteContact;
  status: OnlineStatus;
  userStatus?: UserStatus;
  compact?: boolean;
}

export function FriendEntry({ contact, status, userStatus, compact }: FriendEntryProps) {
  const sessionName = userStatus?.activeSessions?.[0]?.sessionId;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg",
        "hover:bg-surface-hover transition-colors cursor-pointer group",
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar src={contact.profile?.iconUrl} alt={contact.contactUsername} size="sm" />
        <StatusDot
          status={status}
          size="sm"
          className="absolute -bottom-0.5 -right-0.5 ring-2 ring-base-darker"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary truncate">
          {contact.contactUsername}
        </p>
        {!compact && (
          <p className="text-xs text-text-muted truncate">
            {status === "Online" && userStatus?.activeSessions?.length
              ? "In session"
              : status === "Online"
                ? "Online"
                : status === "Away"
                  ? "Away"
                  : status === "Busy"
                    ? "Busy"
                    : "Offline"}
          </p>
        )}
      </div>
    </div>
  );
}
