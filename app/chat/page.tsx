"use client";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { chatMessagesByThread, chatThreads } from "@/data/chats";

const Bubble = ({
  text,
  time,
  from,
}: {
  text: string;
  time: string;
  from: "me" | "them";
}) => {
  const isMe = from === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[72%] rounded-2xl px-4 py-3 text-sm font-medium shadow-sm ${
          isMe
            ? "bg-emerald-100 text-foreground"
            : "bg-emerald-600 text-white"
        }`}
      >
        <div>{text}</div>
        <span
          className={`mt-1 block text-[11px] ${
            isMe ? "text-emerald-700" : "text-emerald-50/80"
          }`}
        >
          {time}
        </span>
      </div>
    </div>
  );
};

export default function ChatPage() {
  const [selectedThreadId, setSelectedThreadId] = useState(chatThreads[0]?.id);
  const [showChatMobile, setShowChatMobile] = useState(false);

  const selectedThread =
    chatThreads.find((t) => t.id === selectedThreadId) ?? chatThreads[0];

  const handleSelectThread = (id: string, isMobile?: boolean) => {
    setSelectedThreadId(id);
    if (isMobile) {
      setShowChatMobile(true);
    }
  };

  const messages =
    chatMessagesByThread[selectedThreadId ?? chatThreads[0]?.id] ??
    chatMessagesByThread[chatThreads[0]?.id] ??
    [];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 bg-white">
        <div className="mx-auto flex h-[calc(100vh-64px)] max-w-7xl flex-col px-4 pb-4 pt-6 md:flex-row md:gap-6 md:px-6">
          {/* Sidebar (desktop) */}
          <aside className="hidden w-[320px] shrink-0 rounded-2xl border border-border bg-white shadow-sm md:flex md:flex-col">
            <div className="border-b border-border px-4 py-3 text-lg font-semibold text-foreground">
              Chats
            </div>
            <div className="flex-1 overflow-auto">
              {chatThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="flex cursor-pointer items-center gap-3 border-b border-border/70 px-4 py-3 last:border-b-0"
                  onClick={() => handleSelectThread(thread.id)}
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={thread.avatar}
                      alt={thread.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                      <span className="truncate">{thread.name}</span>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {thread.time}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate">{thread.subtitle}</span>
                      {thread.unread ? (
                        <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[11px] font-semibold text-white">
                          {thread.unread}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Mobile thread list */}
          <section
            className={`mb-4 grid gap-3 md:hidden ${
              showChatMobile ? "hidden" : "grid"
            }`}
          >
            {chatThreads.map((thread) => (
              <div
                key={thread.id}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm"
                onClick={() => handleSelectThread(thread.id, true)}
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={thread.avatar}
                    alt={thread.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                    <span className="truncate">{thread.name}</span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {thread.time}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate">{thread.subtitle}</span>
                    {thread.unread ? (
                      <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[11px] font-semibold text-white">
                        {thread.unread}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Chat area */}
          <section
            className={`flex h-full flex-1 flex-col rounded-2xl border border-border bg-white shadow-sm ${
              showChatMobile ? "flex" : "hidden"
            } md:flex`}
          >
            <header className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
              <button
                className="md:hidden"
                aria-label="Back to chats"
                onClick={() => setShowChatMobile(false)}
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </button>
              <div className="relative h-11 w-11 overflow-hidden rounded-full">
                <Image
                  src={selectedThread?.avatar ?? "/character-three.png"}
                  alt={selectedThread?.name ?? "Chat"}
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {selectedThread?.name}
                </span>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </header>

            <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-50 to-white px-3 py-4 sm:px-6 sm:py-6">
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <Bubble
                    key={msg.id}
                    text={msg.text}
                    time={msg.time}
                    from={msg.from}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-border px-3 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center gap-3 rounded-full bg-zinc-900 px-4 py-2 shadow-inner">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-300 focus:outline-none"
                />
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

