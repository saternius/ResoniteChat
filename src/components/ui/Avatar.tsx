"use client";

import { cn } from "@/lib/utils/format";
import { getProfileIconUrl } from "@/lib/utils/resonite-urls";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  xl: "h-20 w-20",
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
  xl: "h-10 w-10",
};

export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  const imageUrl = getProfileIconUrl(src);
  const isPlaceholder = !src || imageUrl === "/placeholder-avatar.svg";

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden flex-shrink-0 bg-base-lighter flex items-center justify-center",
        sizes[size],
        className,
      )}
    >
      {isPlaceholder ? (
        <User className={cn("text-text-muted", iconSizes[size])} />
      ) : (
        <img
          src={imageUrl}
          alt={alt || "Avatar"}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            (e.target as HTMLImageElement).parentElement!.classList.add(
              "flex",
              "items-center",
              "justify-center",
            );
          }}
        />
      )}
    </div>
  );
}
