"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { UserCircle, Search, UserPlus, UserX, Ban } from "lucide-react";
import { useContactsStore } from "@/stores/contactsStore";
import { Avatar, StatusDot, Badge, Button } from "@/components/ui";
import type { ContactStatus, OnlineStatus } from "@/types";

const STATUS_TABS: { label: string; filter: ContactStatus | "all" }[] = [
  { label: "All", filter: "all" },
  { label: "Accepted", filter: "Accepted" },
  { label: "Requested", filter: "Requested" },
  { label: "Blocked", filter: "Blocked" },
  { label: "Ignored", filter: "Ignored" },
];

export default function ContactsPage() {
  const { contacts, statusMap } = useContactsStore();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<ContactStatus | "all">("all");

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      if (activeTab !== "all" && c.contactStatus !== activeTab) return false;
      if (search && !c.contactUsername.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [contacts, search, activeTab]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <UserCircle className="h-6 w-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Contacts
        </h1>
        <span className="text-sm text-text-muted">({contacts.length})</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.filter}
            variant={activeTab === tab.filter ? "primary" : "secondary"}
            size="sm"
            onClick={() => setActiveTab(tab.filter)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-base-dark border border-surface-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
        />
      </div>

      {/* Contact List */}
      <div className="glass rounded-xl divide-y divide-surface-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <UserCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No contacts found</p>
          </div>
        ) : (
          filtered.map((contact) => {
            const status = statusMap[contact.id]?.onlineStatus ?? "Offline";
            return (
              <Link
                key={contact.id}
                href={`/messages/${contact.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <Avatar src={contact.profile?.iconUrl} alt={contact.contactUsername} />
                  <StatusDot
                    status={status}
                    size="sm"
                    className="absolute -bottom-0.5 -right-0.5 ring-2 ring-base-darker"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-text-primary">
                    {contact.contactUsername}
                  </h3>
                  <p className="text-xs text-text-muted">{status}</p>
                </div>
                <Badge
                  variant={
                    contact.contactStatus === "Accepted"
                      ? "success"
                      : contact.contactStatus === "Blocked"
                        ? "danger"
                        : contact.contactStatus === "Requested"
                          ? "warning"
                          : "default"
                  }
                >
                  {contact.contactStatus}
                </Badge>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
