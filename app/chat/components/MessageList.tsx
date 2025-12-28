"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bubble } from "./Bubble";
import SystemOutput from "./SystemOutput";
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

  const markdownComponents: Components = {
    code(props) {
      const { inline, className, children, ...rest } = props as {
        inline?: boolean;
        className?: string;
        children?: React.ReactNode;
      };
      if (inline) {
        return (
          <code
            className={`rounded bg-emerald-700/80 px-1 py-0.5 text-xs ${className ?? ""}`}
            {...rest}
          >
            {children}
          </code>
        );
      }
      return (
        <pre className="mt-2 overflow-x-auto rounded-lg bg-emerald-700/60 p-3 text-xs leading-relaxed">
          <code className={className} {...rest}>
            {children}
          </code>
        </pre>
      );
    },
    ul({ children, ...props }) {
      return (
        <ul className="list-disc space-y-1 pl-5" {...props}>
          {children}
        </ul>
      );
    },
    ol({ children, ...props }) {
      return (
        <ol className="list-decimal space-y-1 pl-5" {...props}>
          {children}
        </ol>
      );
    },
    p({ children, node, ...props }) {
      const hasPre =
        // @ts-ignore react-markdown node shape
        node?.children?.some((child: any) => child?.tagName === "pre");
      if (hasPre) {
        return <>{children}</>;
      }
      return (
        <p className="mb-2 last:mb-0" {...props}>
          {children}
        </p>
      );
    },
  };

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
            <div key={msg.id}>
              {msg.role === "assistant" && msg.status === "streaming" && msg.content.trim() === "" ? (
                <SystemOutput text="Thinking..." />
              ) : (
                msg.role === "assistant" ? (
                  <div className="flex justify-start">
                    <div className="max-w-[72%] rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-sm">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <Bubble text={msg.content} from="me" />
                )
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}

