import Image from "next/image";
import Link from "next/link";
import { Globe2, Menu, MessageCircle, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type SiteHeaderProps = {
  className?: string;
};

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header className={`border-b border-border/70 ${className ?? ""}`}>
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="border border-border text-foreground lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/chat-app-logo.png"
              alt="ChatAPP"
              width={170}
              height={52}
              className="h-10 w-auto sm:h-12"
              priority
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-2 rounded-full border border-border bg-white px-2 py-1 text-sm font-medium text-foreground lg:flex">
          <Link
            href="#"
            className="flex items-center gap-2 rounded-full px-3 py-1 hover:bg-muted"
          >
            <Globe2 className="h-4 w-4 text-primary" strokeWidth={2.25} />
            <span>Explore</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-primary-foreground shadow-sm"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
            <span>Chat</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="hidden rounded-full px-4 text-sm font-semibold text-primary sm:inline-flex"
          >
            Join Free
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden rounded-full border border-border px-4 text-sm font-semibold sm:inline-flex"
          >
            Login
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="border border-border text-foreground sm:hidden"
            aria-label="Profile"
          >
            <UserRound className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

