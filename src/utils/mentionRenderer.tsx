// src/utils/mentionRenderer.tsx
import React from "react";

/**
 * @닉네임을 찾아서 bold 처리하는 함수
 */
export const renderContentWithMentions = (content: string): React.ReactNode => {
  const mentionRegex = /@(\S+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    parts.push(
      <span key={match.index} className="font-bold text-main">
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts.length > 0 ? parts : content;
};