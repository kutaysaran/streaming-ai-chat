import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { avatarForTitle } from "../constants";

type Props = {
  title: string | null;
  avatarTitle: string | null;
  loading: boolean;
  onBack?: () => void;
};

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-slate-200 ${className}`} />
);

export function ChatHeader({ title, avatarTitle, loading, onBack }: Props) {
  return (
    <header className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
      {onBack && (
        <button className="md:hidden" aria-label="Back to chats" onClick={onBack}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
      )}
      {loading ? (
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
              src={avatarForTitle(avatarTitle)}
              alt={title ?? "Chat"}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {title ?? "Chat"}
            </span>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </>
      )}
    </header>
  );
}

