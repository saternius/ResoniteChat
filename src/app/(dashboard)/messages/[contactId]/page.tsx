"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Send, AlertCircle } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useAuthStore } from "@/stores/authStore";
import { useContactsStore } from "@/stores/contactsStore";
import { Avatar, StatusDot, Button, Skeleton, RichText } from "@/components/ui";
import { formatRelativeTime, cn, formatMessagePreview } from "@/lib/utils/format";
import Link from "next/link";

export default function ChatThreadPage() {
  const params = useParams();
  const contactId = params.contactId as string;
  const userId = useAuthStore((s) => s.userId);
  const contacts = useContactsStore((s) => s.contacts);
  const statusMap = useContactsStore((s) => s.statusMap);
  const { activeMessages, isLoading, failedMessageIds, loadThread, sendMessage } = useMessages();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const contact = contacts.find((c) => c.id === contactId);
  const status = statusMap[contactId]?.onlineStatus ?? "Offline";
  const hasFailedMessages = activeMessages.some((m) => failedMessageIds.has(m.id));

  useEffect(() => {
    loadThread(contactId);
  }, [contactId, loadThread]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    try {
      await sendMessage(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header */}
      <div className="glass rounded-t-xl px-4 py-3 flex items-center gap-3 border-b border-surface-border">
        <Link
          href="/messages"
          className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="relative">
          <Avatar src={contact?.profile?.iconUrl} alt={contact?.contactUsername} />
          <StatusDot
            status={status}
            size="sm"
            className="absolute -bottom-0.5 -right-0.5 ring-2 ring-base-darker"
          />
        </div>
        <div>
          <h2 className="font-heading text-base font-semibold text-text-primary">
            {contact?.contactUsername ?? contactId}
          </h2>
          <p className="text-xs text-text-muted">{status}</p>
        </div>
      </div>

      {/* Send failure notification */}
      {hasFailedMessages && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/15 border-x border-red-500/30 text-red-400 text-xs">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>Some messages failed to send. Check your connection and try again.</span>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 glass border-x border-surface-border"
      >
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn("flex", i % 2 === 0 ? "justify-start" : "justify-end")}>
              <Skeleton className="h-10 w-48 rounded-xl" />
            </div>
          ))
        ) : activeMessages.length === 0 ? (
          <div className="text-center text-text-muted py-12">
            No messages yet. Start the conversation!
          </div>
        ) : (
          activeMessages.map((msg) => {
            const isMine = msg.senderId === userId;
            const isFailed = failedMessageIds.has(msg.id);
            return (
              <div
                key={msg.id}
                className={cn("flex", isMine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm",
                    isFailed
                      ? "bg-red-500/20 border border-red-500/40 text-text-primary rounded-br-md"
                      : isMine
                        ? "bg-primary/20 border border-primary/30 text-text-primary rounded-br-md"
                        : "bg-base-lighter border border-surface-border text-text-primary rounded-bl-md",
                  )}
                >
                  <p className="whitespace-pre-wrap break-words"><RichText>{formatMessagePreview(msg.content, msg.messageType)}</RichText></p>
                  <p className={cn("text-[10px] mt-1 flex items-center gap-1", isFailed ? "text-red-400" : isMine ? "text-primary-light/60" : "text-text-muted")}>
                    {isFailed && <AlertCircle className="h-3 w-3" />}
                    {isFailed ? "Failed to send" : formatRelativeTime(msg.sendTime)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="glass rounded-b-xl px-4 py-3 flex gap-3 border-t border-surface-border"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-base-dark border border-surface-border rounded-lg px-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
        />
        <Button type="submit" size="sm" loading={sending} disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
