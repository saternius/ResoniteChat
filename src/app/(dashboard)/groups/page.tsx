"use client";

import { Users } from "lucide-react";

export default function GroupsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-primary-light" />
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Groups
        </h1>
      </div>

      <div className="glass rounded-xl p-12 text-center text-text-muted">
        <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="text-lg font-heading font-semibold mb-1">Coming Soon</p>
        <p className="text-sm">
          Group management features are being developed.
          Check back soon for group browsing, membership management, and more.
        </p>
      </div>
    </div>
  );
}
