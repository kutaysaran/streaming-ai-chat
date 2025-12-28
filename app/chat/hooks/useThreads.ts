import { useCallback, useEffect, useMemo, useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { avatarForTitle, defaultCharacters } from "../constants";

export type Thread = {
  id: string;
  title: string | null;
  avatar?: string;
};

type ThreadsResult = {
  threads: Thread[];
  availableCharacters: Thread[];
  threadsLoading: boolean;
  selectedThreadId: string | null;
  selectThread: (id: string, isMobile?: boolean) => void;
  startThreadFromCharacter: (character: Thread, isMobile?: boolean) => Promise<void>;
};

export function useThreads({
  supabase,
  userId,
  profileReady,
}: {
  supabase: SupabaseClient;
  userId: string | null;
  profileReady: boolean;
}): ThreadsResult {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !profileReady) return;
    let cancelled = false;
    async function loadThreads() {
      setThreadsLoading(true);
      const { data, error } = await supabase
        .from("threads")
        .select("id,title")
        .eq("owner_id", userId)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      setThreadsLoading(false);
      if (error) return;
      if (data && data.length > 0) {
        const mapped = data.map((t) => ({ ...t, avatar: avatarForTitle(t.title) }));
        setThreads(mapped);
        setSelectedThreadId((prev) => prev ?? mapped[0]?.id ?? null);
        return;
      }
      setThreads([]);
      setSelectedThreadId(null);
    }
    void loadThreads();
    return () => {
      cancelled = true;
    };
  }, [profileReady, supabase, userId]);

  const availableCharacters = useMemo(
    () =>
      defaultCharacters.filter((character) => {
        const title = character.title?.toLowerCase();
        if (!title) return true;
        return !threads.some((thread) => thread.title?.toLowerCase() === title);
      }),
    [threads]
  );

  const selectThread = useCallback((id: string) => {
    setSelectedThreadId(id);
  }, []);

  const startThreadFromCharacter = useCallback(
    async (character: Thread, _isMobile?: boolean) => {
      if (!userId || !profileReady) return;
      const existing = threads.find(
        (t) =>
          t.title &&
          character.title &&
          t.title.toLowerCase() === character.title.toLowerCase()
      );
      if (existing) {
        setSelectedThreadId(existing.id);
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
    },
    [profileReady, supabase, threads, userId]
  );

  return {
    threads,
    availableCharacters,
    threadsLoading,
    selectedThreadId,
    selectThread,
    startThreadFromCharacter,
  };
}

