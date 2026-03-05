"use client";

import { Settings, User, Shield, HardDrive, Bell } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Avatar, Badge, Card, Button } from "@/components/ui";
import { formatBytes } from "@/lib/utils/format";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const usagePercent = user.quotaBytes
    ? Math.round((user.usedBytes / user.quotaBytes) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary-light" />
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Settings
        </h1>
      </div>

      {/* Profile Section */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary-light" />
          <h2 className="font-heading text-lg font-semibold">Profile</h2>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <Avatar src={user.profile?.iconUrl} alt={user.username} size="xl" />
          <div>
            <h3 className="text-xl font-heading font-bold text-text-primary">
              {user.username}
            </h3>
            <p className="text-sm text-text-muted">{user.id}</p>
            {user.profile?.tagline && (
              <p className="text-sm text-text-secondary mt-1">
                {user.profile.tagline}
              </p>
            )}
          </div>
        </div>
        {user.profile?.description && (
          <p className="text-sm text-text-secondary bg-base-dark rounded-lg p-3">
            {user.profile.description}
          </p>
        )}
      </Card>

      {/* Account Info */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-accent" />
          <h2 className="font-heading text-lg font-semibold">Account</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Email</span>
            <span className="text-text-primary">{user.email ?? "Not set"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Registered</span>
            <span className="text-text-primary">
              {new Date(user.registrationDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Verified</span>
            <Badge variant={user.isVerified ? "success" : "warning"}>
              {user.isVerified ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">2FA</span>
            <Badge variant={user["2fa_login"] ? "success" : "default"}>
              {user["2fa_login"] ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          {(() => {
            const display = user.profile?.displayBadges;
            let badges: string[];
            if (display && display.length > 0) {
              badges = display;
            } else if (user.entitlements && user.entitlements.length > 0) {
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
              <div className="flex justify-between text-sm items-start">
                <span className="text-text-muted">Entitlements</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {badges.map((badge, i) => (
                    <Badge key={i} variant="primary">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      </Card>

      {/* Storage */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="h-5 w-5 text-accent" />
          <h2 className="font-heading text-lg font-semibold">Storage</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Used</span>
            <span className="text-text-primary">{formatBytes(user.usedBytes)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Quota</span>
            <span className="text-text-primary">{formatBytes(user.quotaBytes)}</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-3 bg-base-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-text-muted text-right">{usagePercent}% used</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
