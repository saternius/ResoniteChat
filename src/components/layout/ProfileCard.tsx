"use client";

import { useAuthStore } from "@/stores/authStore";
import { Avatar, Badge } from "@/components/ui";
import { formatBytes } from "@/lib/utils/format";

export function ProfileCard() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const usagePercent = user.quotaBytes
    ? Math.round((user.usedBytes / user.quotaBytes) * 100)
    : 0;

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Avatar src={user.profile?.iconUrl} alt={user.username} size="lg" />
        <div className="min-w-0">
          <h3 className="font-heading text-lg font-semibold text-text-primary truncate">
            {user.username}
          </h3>
          {user.profile?.tagline && (
            <p className="text-xs text-text-muted truncate">
              {user.profile.tagline}
            </p>
          )}
        </div>
      </div>

      {(() => {
        const display = user.profile?.displayBadges;
        let badges: string[];
        if (display && display.length > 0) {
          badges = display;
        } else if (user.entitlements && user.entitlements.length > 0) {
          // Derive badges from entitlement origins and types
          const origins = new Set<string>();
          const types: string[] = [];
          for (const e of user.entitlements) {
            e.entitlementOrigins?.forEach((o) => origins.add(o));
            if (e.$type === "badge") types.push("Badge");
            if (e.$type === "headless") types.push("Headless");
          }
          badges = [...origins, ...types];
        } else {
          badges = [];
        }
        return badges.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge, i) => (
              <Badge key={i} variant="primary">
                {badge}
              </Badge>
            ))}
          </div>
        ) : null;
      })()}

      {user.quotaBytes > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-text-muted">
            <span>Storage</span>
            <span>
              {formatBytes(user.usedBytes)} / {formatBytes(user.quotaBytes)}
            </span>
          </div>
          <div className="h-1.5 bg-base-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
