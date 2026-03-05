export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export function formatSessionTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 1000 / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffMin < 1) return "Just started";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour}h ${diffMin % 60}m ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "…";
}

export function cn(...classes: (string | false | null | undefined | 0)[]): string {
  return classes.filter((c): c is string => typeof c === "string" && c.length > 0).join(" ");
}

/**
 * Strips Resonite/Unity rich text tags from a string.
 * e.g. "<color=#66F>S<color=#85F>i</closeall>" → "Si"
 */
export function stripRichText(text: string): string {
  return text.replace(/<\/?(?:color|b|i|s|u|size|mark|align|closeall|nobr|br|sup|sub|voffset|indent|line-height|line-indent|margin|pos|space|sprite|style|font|cspace|mspace|rotate|allcaps|smallcaps|lowercase|uppercase)(?:=[^>]*)?>/gi, "");
}

/**
 * Formats a Resonite message content string for display based on messageType.
 * Non-text messages store JSON in content that needs to be parsed and summarized.
 */
export function formatMessagePreview(
  content: string,
  messageType: string,
): string {
  if (messageType === "Text") return content;

  try {
    const data = JSON.parse(content);
    switch (messageType) {
      case "SessionInvite":
        return `📍 Session Invite: ${data.name || "Unknown Session"}`;
      case "Object":
        return `📦 Shared: ${data.name || "an item"}`;
      case "Sound":
        return "🔊 Voice Message";
      case "CreditTransfer":
        return `💳 Credit Transfer: ${data.amount ?? ""} credits`;
      case "SugarCubes":
        return `🍬 Sugar Cubes: ${data.amount ?? ""}`;
      default:
        if (data.inviteRequestId) {
          return `📨 Invite Request from ${data.requestingFromUsername || "someone"}`;
        }
        return data.name || `[${messageType}]`;
    }
  } catch {
    return content;
  }
}
