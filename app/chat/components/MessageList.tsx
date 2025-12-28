import { useEffect, useRef } from "react";
import { Bubble } from "./Bubble";
import { Message } from "../hooks/useMessages";

type Props = {
  messages: Message[];
  showEmptyMessages: boolean;
  showChatPlaceholder: boolean;
};

export function MessageList({
  messages,
  showEmptyMessages,
  showChatPlaceholder,
}: Props) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-50 to-white px-3 py-4 sm:px-6 sm:py-6">
      {showChatPlaceholder ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <p>Select a character to start a new conversation.</p>
          <p className="text-xs text-emerald-700">Your chats will appear here.</p>
        </div>
      ) : showEmptyMessages ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <p>Start a conversation with your AI companion.</p>
          <p className="text-xs text-emerald-700">Type a message to begin.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <Bubble
              key={msg.id}
              text={msg.content}
              from={msg.role === "user" ? "me" : "them"}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}

