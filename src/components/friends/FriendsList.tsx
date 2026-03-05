"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useContactsStore } from "@/stores/contactsStore";
import { FriendEntry } from "./FriendEntry";
import { FriendEntrySkeleton } from "@/components/ui";
import type { OnlineStatus } from "@/types";

const STATUS_ORDER: OnlineStatus[] = ["Online", "Away", "Busy", "Offline"];

export function FriendsList() {
  const [search, setSearch] = useState("");
  const { contacts, statusMap, isLoading } = useContactsStore();

  const grouped = useMemo(() => {
    const accepted = contacts.filter((c) => c.contactStatus === "Accepted");
    const filtered = search
      ? accepted.filter((c) =>
          c.contactUsername.toLowerCase().includes(search.toLowerCase()),
        )
      : accepted;

    const groups: Record<OnlineStatus, typeof filtered> = {
      Online: [],
      Away: [],
      Busy: [],
      Offline: [],
      Invisible: [],
    };

    for (const contact of filtered) {
      const raw = statusMap[contact.id]?.onlineStatus ?? "Offline";
      const status = raw in groups ? raw : "Offline";
      groups[status].push(contact);
    }

    return groups;
  }, [contacts, statusMap, search]);

  const onlineCount =
    grouped.Online.length + grouped.Away.length + grouped.Busy.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-surface-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading text-sm font-semibold text-text-primary uppercase tracking-wider">
            Friends
          </h2>
          <span className="text-xs text-accent-light font-medium">
            {onlineCount} online
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search friends..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-base-dark border border-surface-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-1 py-1">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <FriendEntrySkeleton key={i} />
          ))
        ) : (
          STATUS_ORDER.map(
            (status) =>
              grouped[status].length > 0 && (
                <div key={status} className="mb-2">
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                    {status} — {grouped[status].length}
                  </p>
                  {grouped[status].map((contact) => (
                    <Link key={contact.id} href={`/messages/${contact.id}`}>
                      <FriendEntry
                        contact={contact}
                        status={status}
                        userStatus={statusMap[contact.id]}
                      />
                    </Link>
                  ))}
                </div>
              ),
          )
        )}
      </div>
    </div>
  );
}
