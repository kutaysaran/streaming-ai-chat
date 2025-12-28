"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe2, Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthButtons } from "@/components/auth/auth-buttons";

type SiteHeaderProps = {
  className?: string;
};

export function SiteHeader({ className }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isExplore = pathname === "/";
  const isChat = pathname.startsWith("/chat");
  return (
    <header className={`${className ?? ""}`}>
      <div className="container relative flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="border border-border text-foreground lg:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            href="/"
            className={`flex items-center gap-2 rounded-full px-3 py-1 transition ${
              isExplore
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted"
            }`}
          >
            <Globe2
              className={`h-4 w-4 ${isExplore ? "text-primary-foreground" : "text-primary"}`}
              strokeWidth={2.25}
            />
            <span>Explore</span>
          </Link>
          <Link
            href="/chat"
            className={`flex items-center gap-2 rounded-full px-3 py-1 transition ${
              isChat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted"
            }`}
          >
            <MessageCircle
              className={`h-4 w-4 ${isChat ? "text-primary-foreground" : ""}`}
              strokeWidth={2.25}
            />
            <span>Chat</span>
          </Link>
        </nav>

        <AuthButtons />

        {menuOpen && (
          <div className="absolute left-0 top-16 z-40 w-full border-b border-border bg-white shadow-lg lg:hidden">
            <nav className="flex flex-col divide-y divide-border">
              <Link
                href="/"
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                  isExplore ? "bg-muted" : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <Globe2
                  className={`h-4 w-4 ${isExplore ? "text-primary" : "text-primary"}`}
                  strokeWidth={2.25}
                />
                <span>Explore</span>
              </Link>
              <Link
                href="/chat"
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                  isChat ? "bg-muted" : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
                <span>Chat</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

