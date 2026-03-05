"use client";

import React from "react";

const TAG_REGEX = /<\/?(?:color|b|i|s|u|size|mark|align|closeall|nobr|br|sup|sub|voffset|indent|line-height|line-indent|margin|pos|space|sprite|style|font|cspace|mspace|rotate|allcaps|smallcaps|lowercase|uppercase)(?:=[^>]*)?>/gi;
const COLOR_OPEN_REGEX = /^<color=([^>]+)>$/i;

function expandShortHex(hex: string): string {
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
}

export function RichText({ children }: { children: string }) {
  const result: React.ReactNode[] = [];
  const colorStack: string[] = [];
  let lastIndex = 0;
  let key = 0;

  // Reset regex state
  TAG_REGEX.lastIndex = 0;

  let match;
  while ((match = TAG_REGEX.exec(children)) !== null) {
    // Text segment before this tag
    if (match.index > lastIndex) {
      const segment = children.slice(lastIndex, match.index);
      const color = colorStack.length > 0 ? colorStack[colorStack.length - 1] : null;
      result.push(
        color
          ? <span key={key++} style={{ color }}>{segment}</span>
          : segment
      );
    }

    const tag = match[0];
    const colorMatch = tag.match(COLOR_OPEN_REGEX);

    if (colorMatch) {
      colorStack.push(expandShortHex(colorMatch[1]));
    } else if (/^<\/color>$/i.test(tag)) {
      colorStack.pop();
    } else if (/^<\/?closeall>$/i.test(tag)) {
      colorStack.length = 0;
    }
    // All other tags are silently stripped

    lastIndex = match.index + match[0].length;
  }

  // Remaining text after last tag
  if (lastIndex < children.length) {
    const segment = children.slice(lastIndex);
    const color = colorStack.length > 0 ? colorStack[colorStack.length - 1] : null;
    result.push(
      color
        ? <span key={key++} style={{ color }}>{segment}</span>
        : segment
    );
  }

  return <>{result}</>;
}
