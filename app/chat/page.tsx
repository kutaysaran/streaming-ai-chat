"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { getBrowserClient } from "@/lib/supabase-browser";
import { ChatHeader } from "./components/ChatHeader";
import { ThreadList } from "./components/ThreadList";
import { ThreadListMobile } from "./components/ThreadListMobile";
import { MessageList } from "./components/MessageList";
import { Composer } from "./components/Composer";
import { defaultCharacters, promptForTitle } from "./constants";
import { useToast } from "@/components/ui/toast";
import { useProfileGuard } from "./hooks/useProfileGuard";
import { useThreads } from "./hooks/useThreads";
import { useMessages } from "./hooks/useMessages";

export default function ChatPage() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const { userId, profileReady, loadingUser, ensuringProfile, ensureProfile } =
    useProfileGuard(supabase);

  const {
    threads,
    availableCharacters,
    threadsLoading,
    selectedThreadId,
    selectThread,
    startThreadFromCharacter,
  } = useThreads({ supabase, userId });

  const [newChatCharacterId, setNewChatCharacterId] = useState<string>(
    availableCharacters[0]?.id ?? defaultCharacters[0].id
  );
  useEffect(() => {
    if (availableCharacters.length === 0) {
      setNewChatCharacterId("");
      return;
    }
    if (!availableCharacters.some((c) => c.id === newChatCharacterId)) {
      setNewChatCharacterId(availableCharacters[0].id);
    }
  }, [availableCharacters, newChatCharacterId]);

  const { messages, loadingMessages, sendMessage } = useMessages({
    supabase,
    selectedThreadId,
    onError: (msg) =>
      toast({
        title: "Operation failed",
        description: msg,
        variant: "error",
      }),
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.has("code") || url.searchParams.has("state")) {
      url.search = "";
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const handleStartNewChat = async (characterId: string, isMobile?: boolean) => {
    const character = availableCharacters.find((c) => c.id === characterId);
    if (!character) return;
    if (!profileReady) {
      const ok = await ensureProfile();
      if (!ok) return;
    }
    await startThreadFromCharacter(character, isMobile);
    setShowChatMobile(true);
  };

  const handleSelectThread = (id: string, isMobile?: boolean) => {
    selectThread(id);
    if (isMobile) setShowChatMobile(true);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedThreadId) return;
    const messageToSend = input;
    setInput("");
    const systemPrompt = promptForTitle(
      threads.find((t) => t.id === selectedThreadId)?.title
    );
    await sendMessage(messageToSend, selectedThreadId, systemPrompt);
  };

  const disableInput =
    !selectedThreadId || !profileReady || threadsLoading || loadingUser;

  const showEmptyMessages =
    !loadingMessages && selectedThreadId && messages.length === 0;

  const showHeaderSkeleton = threadsLoading || !selectedThreadId;
  const showChatPlaceholder = !threadsLoading && !selectedThreadId;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 bg-white">
        <div className="mx-auto flex h-[calc(100vh-64px)] max-w-7xl flex-col px-4 pb-4 pt-6 md:flex-row md:gap-6 md:px-6">
          <ThreadList
            threads={threads}
            threadsLoading={threadsLoading}
            selectedThreadId={selectedThreadId}
            onSelect={(id) => handleSelectThread(id)}
            availableCharacters={availableCharacters}
            newChatCharacterId={newChatCharacterId}
            onChangeCharacter={setNewChatCharacterId}
            onStartCharacter={() => void handleStartNewChat(newChatCharacterId)}
            startDisabled={
              !userId || loadingUser || ensuringProfile || availableCharacters.length === 0
            }
          />

          <div className={`mb-4 md:hidden ${showChatMobile ? "hidden" : "block"}`}>
            <ThreadListMobile
              threads={threads}
              threadsLoading={threadsLoading}
              selectedThreadId={selectedThreadId}
              onSelect={(id) => handleSelectThread(id, true)}
              availableCharacters={availableCharacters}
              newChatCharacterId={newChatCharacterId}
              onChangeCharacter={setNewChatCharacterId}
              onStartCharacter={() => void handleStartNewChat(newChatCharacterId, true)}
              startDisabled={
                !userId ||
                loadingUser ||
                ensuringProfile ||
                availableCharacters.length === 0
              }
            />
          </div>

          <section
            className={`flex h-full flex-1 flex-col rounded-2xl border border-border bg-white shadow-sm ${
              showChatMobile ? "flex" : "hidden"
            } md:flex`}
          >
            <ChatHeader
              title={threads.find((t) => t.id === selectedThreadId)?.title ?? null}
              avatarTitle={threads.find((t) => t.id === selectedThreadId)?.title ?? null}
              loading={showHeaderSkeleton}
              onBack={() => setShowChatMobile(false)}
            />

            <MessageList
              messages={messages}
              showEmptyMessages={!!showEmptyMessages}
              showChatPlaceholder={showChatPlaceholder}
            />

            <Composer
              input={input}
              setInput={setInput}
              onSend={handleSend}
              disabled={disableInput}
            />
          </section>
        </div>
      </main>
    </div>
  );
}