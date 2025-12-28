"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { getBrowserClient } from "@/lib/supabase-browser";

type Thread = {
  id: string;
  title: string | null;
  avatar?: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
  status?: "sending" | "streaming" | "failed" | "sent";
};

const defaultCharacters: Thread[] = [
  { id: "character-aria", title: "Helpful Assistant", avatar: "/character-three.png" },
  { id: "character-grumpy", title: "Grumpy Cat", avatar: "/character-one.png" },
  { id: "character-guru", title: "Coding Guru", avatar: "/character-four.png" },
  { id: "character-dog", title: "Smarty Dog", avatar: "/character-two.png" },
];

const avatarForTitle = (title?: string | null) => {
  const found = defaultCharacters.find(
    (c) => c.title?.toLowerCase() === title?.toLowerCase()
  );
  return found?.avatar ?? "/character-three.png";
};

const Bubble = ({
  text,
  from,
}: {
  text: string;
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
      </div>
    </div>
  );
};

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-slate-200 ${className}`} />
);

export default function ChatPage() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messagesByThread, setMessagesByThread] = useState<
    Record<string, Message[]>
  >({});
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [newChatCharacterId, setNewChatCharacterId] = useState<string>(
    defaultCharacters[0].id
  );
  const availableCharacters = useMemo(
    () =>
      defaultCharacters.filter((character) => {
        const title = character.title?.toLowerCase();
        if (!title) return true;
        return !threads.some(
          (thread) => thread.title?.toLowerCase() === title
        );
      }),
    [threads]
  );

  useEffect(() => {
    if (availableCharacters.length === 0) {
      setNewChatCharacterId("");
      return;
    }
    const stillExists = availableCharacters.some(
      (c) => c.id === newChatCharacterId
    );
    if (!stillExists) {
      setNewChatCharacterId(availableCharacters[0].id);
    }
  }, [availableCharacters, newChatCharacterId]);
  // clean OAuth params if present
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.has("code") || url.searchParams.has("state")) {
      url.search = "";
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const ensureProfile = useCallback(async () => {
    if (!userId) return false;
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId }, { onConflict: "id" });
    if (error) return false;
    setProfileReady(true);
    return true;
  }, [supabase, userId]);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    }
    loadUser();
  }, [supabase]);

  useEffect(() => {
    if (!userId) {
      setProfileReady(false);
      return;
    }
    let cancelled = false;
    void ensureProfile().then((ok) => {
      if (!cancelled && ok) setProfileReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [ensureProfile, userId]);

  useEffect(() => {
    if (!userId || !profileReady) return;
    async function loadThreads() {
      setThreadsLoading(true);
      const { data, error } = await supabase
        .from("threads")
        .select("id,title")
        .eq("owner_id", userId)
        .order("created_at", { ascending: true });

      setThreadsLoading(false);

      if (error) return;

      if (data && data.length > 0) {
        setThreads(data.map((t) => ({ ...t, avatar: avatarForTitle(t.title) })));
        setSelectedThreadId(data[0].id);
        return;
      }

      // no threads yet: wait for user to start
      setThreads([]);
      setSelectedThreadId(null);
      setShowChatMobile(false);
    }
    void loadThreads();
  }, [profileReady, supabase, userId]);

  useEffect(() => {
    if (!selectedThreadId) return;
    async function loadMessages(threadId: string) {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from("messages")
        .select("id,role,content,created_at")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
      setLoadingMessages(false);
      if (error) return;
      const mapped: Message[] =
        data?.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content ?? "",
          created_at: m.created_at ?? undefined,
          status: "sent",
        })) ?? [];
      setMessagesByThread((prev) => ({ ...prev, [threadId]: mapped }));
    }
    void loadMessages(selectedThreadId);
  }, [selectedThreadId, supabase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByThread, selectedThreadId]);

  const handleSelectThread = (id: string, isMobile?: boolean) => {
    setSelectedThreadId(id);
    if (isMobile) setShowChatMobile(true);
  };

  const startThreadFromCharacter = async (character: Thread) => {
    if (!userId) return;
    if (!profileReady) {
      const ok = await ensureProfile();
      if (!ok) return;
    }
    // prevent duplicate conversations with the same predefined character
    const existing = threads.find(
      (t) =>
        t.title &&
        character.title &&
        t.title.toLowerCase() === character.title.toLowerCase()
    );
    if (existing) {
      setSelectedThreadId(existing.id);
      setShowChatMobile(true);
      return;
    }
    const { data, error } = await supabase
      .from("threads")
      .insert({ title: character.title, owner_id: userId })
      .select("id,title")
      .single();
    if (error || !data) return;
    const newThread: Thread = {
      id: data.id,
      title: data.title ?? "Chat",
      avatar: character.avatar,
    };
    setThreads((prev) => [...prev, newThread]);
    setSelectedThreadId(newThread.id);
    setShowChatMobile(true);
  };

  const handleStartNewChat = (characterId: string) => {
    const character = defaultCharacters.find((c) => c.id === characterId);
    if (!character) return;
    void startThreadFromCharacter(character);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedThreadId) return;
    const threadId = selectedThreadId;
    const userMsg: Message = {
      id: `temp-${crypto.randomUUID()}`,
      role: "user",
      content: input.trim(),
      status: "sending",
    };
    const assistantId = `assistant-${crypto.randomUUID()}`;
    const assistantPlaceholder: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      status: "streaming",
    };

    setInput("");
    setMessagesByThread((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), userMsg, assistantPlaceholder],
    }));

    // Persist user message
    const { error: insertErr } = await supabase.from("messages").insert({
      thread_id: threadId,
      role: "user",
      content: userMsg.content,
    });
    if (insertErr) {
      setMessagesByThread((prev) => ({
        ...prev,
        [threadId]: prev[threadId]?.map((m) =>
          m.id === userMsg.id ? { ...m, status: "failed" } : m
        ),
      }));
      return;
    }

    // Call streaming endpoint
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId,
        messages: [
          ...((messagesByThread[threadId] ?? []).map((m) => ({
            role: m.role,
            content: m.content,
          })) ?? []),
          { role: "user", content: userMsg.content },
        ],
      }),
    });

    if (!res.ok || !res.body) {
      setMessagesByThread((prev) => ({
        ...prev,
        [threadId]: prev[threadId]?.map((m) =>
          m.id === assistantId ? { ...m, status: "failed" } : m
        ),
      }));
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      assistantText += decoder.decode(value, { stream: true });
      setMessagesByThread((prev) => ({
        ...prev,
        [threadId]: prev[threadId]?.map((m) =>
          m.id === assistantId ? { ...m, content: assistantText } : m
        ),
      }));
    }

    const { error: insertAssistantErr, data: assistantInserted } = await supabase
      .from("messages")
      .insert({
        thread_id: threadId,
        role: "assistant",
        content: assistantText,
      })
      .select("id")
      .single();

    if (insertAssistantErr) {
      setMessagesByThread((prev) => ({
        ...prev,
        [threadId]: prev[threadId]?.map((m) =>
          m.id === assistantId ? { ...m, status: "failed" } : m
        ),
      }));
      return;
    }

    setMessagesByThread((prev) => ({
      ...prev,
      [threadId]: prev[threadId]?.map((m) =>
        m.id === assistantId
          ? { ...m, id: assistantInserted?.id ?? assistantId, status: "sent" }
          : m
      ),
    }));
  };

  const messages = selectedThreadId
    ? messagesByThread[selectedThreadId] ?? []
    : [];

  const disableInput = !selectedThreadId;

  const showEmptyMessages =
    !loadingMessages &&
    selectedThreadId &&
    (messagesByThread[selectedThreadId]?.length ?? 0) === 0;

  const showHeaderSkeleton = threadsLoading || !selectedThreadId;
  const showChatPlaceholder = !threadsLoading && !selectedThreadId;

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
            {availableCharacters.length > 0 && (
              <div className="border-b border-border px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Start a new conversation
                </div>
                <div className="mt-2 flex gap-2">
                  <select
                    className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:border-emerald-500"
                    value={newChatCharacterId}
                    onChange={(e) => setNewChatCharacterId(e.target.value)}
                  >
                    {availableCharacters.map((character) => (
                      <option key={character.id} value={character.id}>
                        {character.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
                    onClick={() => handleStartNewChat(newChatCharacterId)}
                    disabled={!userId || !profileReady}
                  >
                    Start
                  </button>
                </div>
              </div>
            )}
            <div className="flex-1 overflow-auto">
              {threadsLoading ? (
                <div className="space-y-3 p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              ) : threads.length === 0 ? (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                  No conversations yet. Choose a character above to start.
                </div>
              ) : (
                threads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`flex cursor-pointer items-center gap-3 border-b border-border/70 px-4 py-3 last:border-b-0 ${
                      thread.id === selectedThreadId ? "bg-emerald-50" : ""
                    }`}
                    onClick={() => handleSelectThread(thread.id)}
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={thread.avatar ?? avatarForTitle(thread.title)}
                        alt={thread.title ?? "Chat"}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                        <span className="truncate">{thread.title ?? "Chat"}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Conversation
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* Mobile thread list */}
          <section
            className={`mb-4 grid gap-3 md:hidden ${
              showChatMobile ? "hidden" : "grid"
            }`}
          >
            {availableCharacters.length > 0 && (
              <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Start a new conversation
                </div>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:border-emerald-500"
                    value={newChatCharacterId}
                    onChange={(e) => setNewChatCharacterId(e.target.value)}
                  >
                    {availableCharacters.map((character) => (
                      <option key={character.id} value={character.id}>
                        {character.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
                    onClick={() => handleStartNewChat(newChatCharacterId)}
                    disabled={!userId || !profileReady}
                  >
                    Start
                  </button>
                </div>
              </div>
            )}

            {threadsLoading ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ) : threads.length === 0 ? (
              <div className="flex items-center justify-center rounded-2xl border border-border bg-white px-4 py-8 text-center text-sm text-muted-foreground shadow-sm">
                No conversations yet. Pick a character above to begin.
              </div>
            ) : (
              threads.map((thread) => (
                <div
                  key={thread.id}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm"
                  onClick={() => handleSelectThread(thread.id, true)}
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={thread.avatar ?? avatarForTitle(thread.title)}
                      alt={thread.title ?? "Chat"}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                      <span className="truncate">{thread.title ?? "Chat"}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Conversation
                    </div>
                  </div>
                </div>
              ))
            )}
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
              {showHeaderSkeleton ? (
                <>
                  <Skeleton className="h-11 w-11 rounded-full" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </>
              ) : (
                <>
                  <div className="relative h-11 w-11 overflow-hidden rounded-full">
                    <Image
                      src={avatarForTitle(
                        threads.find((t) => t.id === selectedThreadId)?.title
                      )}
                      alt={selectedThreadId ?? "Chat"}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {threads.find((t) => t.id === selectedThreadId)?.title ?? "Chat"}
                    </span>
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </>
              )}
            </header>

            <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-50 to-white px-3 py-4 sm:px-6 sm:py-6">
              {showChatPlaceholder ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                  <p>Select a character to start a new conversation.</p>
                  <p className="text-xs text-emerald-700">Your chats will appear here.</p>
                </div>
              ) : showEmptyMessages ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                  <p>Start a conversation with your AI companion.</p>
                  <p className="text-xs text-emerald-700">
                    Type a message to begin.
                  </p>
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

            <div className="border-t border-border px-3 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center gap-3 rounded-full bg-zinc-900 px-4 py-2 shadow-inner">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-300 focus:outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void handleSend();
                    }
                  }}
                  disabled={disableInput}
                />
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm"
                  aria-label="Send message"
                  onClick={() => void handleSend()}
                  disabled={disableInput}
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

