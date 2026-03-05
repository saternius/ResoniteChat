"use client";

import { useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useContactsStore } from "@/stores/contactsStore";
import { Avatar, StatusDot, Skeleton, RichText } from "@/components/ui";
import { formatRelativeTime, formatMessagePreview } from "@/lib/utils/format";
import Link from "next/link";

export default function MessagesPage() {
  const { conversations, isLoading, loadConversations } = useMessages();
  const { contacts, statusMap } = useContactsStore();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-6 w-6 text-primary-light" />
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Messages
        </h1>
      </div>

      <div className="glass rounded-xl divide-y divide-surface-border overflow-hidden">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-3 w-12" />
            </div>
          ))
        ) : conversations.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No messages yet</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const contact = contacts.find((c) => c.id === conv.contactId);
            const status = statusMap[conv.contactId]?.onlineStatus ?? "Offline";

            return (
              <Link
                key={conv.contactId}
                href={`/messages/${conv.contactId}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <Avatar
                    src={contact?.profile?.iconUrl}
                    alt={conv.contactUsername}
                  />
                  <StatusDot
                    status={status}
                    size="sm"
                    className="absolute -bottom-0.5 -right-0.5 ring-2 ring-base-darker"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-text-primary truncate">
                      {conv.contactUsername}
                    </h3>
                    {conv.lastMessage && (
                      <span className="text-xs text-text-muted flex-shrink-0 ml-2">
                        {formatRelativeTime(conv.lastMessage.sendTime)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-text-muted truncate">
                      {conv.lastMessage
                        ? <RichText>{formatMessagePreview(conv.lastMessage.content, conv.lastMessage.messageType)}</RichText>
                        : "No messages"}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-primary text-white text-[10px] font-bold rounded-full h-4.5 min-w-4.5 flex items-center justify-center px-1 ml-2 flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
