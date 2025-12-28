import Image from "next/image";
import { NewChatSelector } from "./NewChatSelector";
import { avatarForTitle } from "../constants";
import { Thread } from "../hooks/useThreads";

type Props = {
  threads: Thread[];
  threadsLoading: boolean;
  selectedThreadId: string | null;
  onSelect: (id: string) => void;
  availableCharacters: Thread[];
  newChatCharacterId: string;
  onChangeCharacter: (id: string) => void;
  onStartCharacter: () => void;
  startDisabled: boolean;
};

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-slate-200 ${className}`} />
);

export function ThreadListMobile({
  threads,
  threadsLoading,
  selectedThreadId,
  onSelect,
  availableCharacters,
  newChatCharacterId,
  onChangeCharacter,
  onStartCharacter,
  startDisabled,
}: Props) {
  return (
    <section className={`mb-4 grid gap-3 md:hidden`}>
      {availableCharacters.length > 0 && (
        <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
          <NewChatSelector
            availableCharacters={availableCharacters}
            newChatCharacterId={newChatCharacterId}
            onChange={onChangeCharacter}
            onStart={onStartCharacter}
            disabled={startDisabled}
          />
        </div>
      )}
      {threadsLoading && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      )}
      {!threadsLoading && threads.length === 0 && (
        <div className="flex items-center justify-center rounded-2xl border border-border bg-white px-4 py-8 text-center text-sm text-muted-foreground shadow-sm">
          No conversations yet. Pick a character above to begin.
        </div>
      )}
      {!threadsLoading &&
        threads.length > 0 &&
        threads.map((thread) => (
          <div
            key={thread.id}
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm ${
              thread.id === selectedThreadId ? "bg-emerald-50" : ""
            }`}
            onClick={() => onSelect(thread.id)}
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
              <div className="mt-1 text-xs text-muted-foreground">Conversation</div>
            </div>
          </div>
        ))}
    </section>
  );
}

