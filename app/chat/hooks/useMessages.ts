import { useCallback, useEffect, useRef, useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
  status?: "sending" | "streaming" | "failed" | "sent";
};

type MessagesResult = {
  messages: Message[];
  loadingMessages: boolean;
  sendMessage: (input: string, threadId: string, systemPrompt?: string) => Promise<void>;
};

export function useMessages({
  supabase,
  selectedThreadId,
  onError,
}: {
  supabase: SupabaseClient;
  selectedThreadId: string | null;
  onError?: (message: string) => void;
}): MessagesResult {
  const [messagesByThread, setMessagesByThread] = useState<Record<string, Message[]>>(
    {}
  );
  const [loadingMessages, setLoadingMessages] = useState(false);
  const streamingControllers = useRef<Map<string, ReadableStreamDefaultReader<Uint8Array>>>(new Map());

  useEffect(() => {
    if (!selectedThreadId) return;
    let cancelled = false;
    async function loadMessages(threadId: string) {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from("messages")
        .select("id,role,content,created_at")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      setLoadingMessages(false);
      if (error) {
        onError?.("Message loading failed.");
        return;
      }
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
    return () => {
      cancelled = true;
      const reader = streamingControllers.current.get(selectedThreadId);
      reader?.cancel().catch(() => {});
    };
  }, [selectedThreadId, supabase]);

  const sendMessage = useCallback(
    async (input: string, threadId: string, systemPrompt?: string) => {
      if (!input.trim()) return;
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
      setMessagesByThread((prev) => ({
        ...prev,
        [threadId]: [...(prev[threadId] ?? []), userMsg, assistantPlaceholder],
      }));

      const { error: insertErr } = await supabase.from("messages").insert({
        thread_id: threadId,
        role: "user",
        content: userMsg.content,
      });
      if (insertErr) {
        onError?.(insertErr.message || "Message sending failed.");
        setMessagesByThread((prev) => ({
          ...prev,
          [threadId]: prev[threadId]?.map((m) =>
            m.id === userMsg.id ? { ...m, status: "failed" } : m
          ),
        }));
        return;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId,
          messages: [
            ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
            ...((messagesByThread[threadId] ?? []).map((m) => ({
              role: m.role,
              content: m.content,
            })) ?? []),
            { role: "user", content: userMsg.content },
          ],
        }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        onError?.(
          text || "Assistant response not found. Please try again."
        );
        setMessagesByThread((prev) => ({
          ...prev,
          [threadId]: prev[threadId]?.map((m) =>
            m.id === assistantId ? { ...m, status: "failed" } : m
          ),
        }));
        return;
      }

      const reader = res.body.getReader();
      streamingControllers.current.set(threadId, reader);
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
      streamingControllers.current.delete(threadId);

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
        onError?.(insertAssistantErr.message || "Assistant message saving failed.");
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
    },
    [messagesByThread, supabase]
  );

  const messages = selectedThreadId
    ? messagesByThread[selectedThreadId] ?? []
    : [];

  return { messages, loadingMessages, sendMessage };
}

