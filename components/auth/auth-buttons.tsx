"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBrowserClient } from "@/lib/supabase-browser";

// Cache session state between mounts to reduce flicker on navigation.
let lastSession: boolean | null = null;

type SessionState = {
  hasSession: boolean;
  loading: boolean;
};

export function AuthButtons() {
  const supabase = getBrowserClient();
  const router = useRouter();
  const [state, setState] = useState<SessionState>({
    hasSession: lastSession ?? false,
    loading: lastSession === null,
  });

  useEffect(() => {
    let mounted = true;
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      lastSession = !!data.session;
      setState({ hasSession: lastSession, loading: false });
    }
    loadSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ hasSession: !!session, loading: false });
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const goLogin = (mode?: "signup" | "signin") => {
    const suffix = mode ? `?mode=${mode}` : "";
    router.push(`/login${suffix}`);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (state.loading) {
    return (
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          className="hidden rounded-full px-4 text-sm font-semibold text-primary opacity-50 sm:inline-flex"
          disabled
        >
          Join Free
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="hidden rounded-full border border-border px-4 text-sm font-semibold opacity-50 sm:inline-flex"
          disabled
        >
          Login
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="border border-border text-foreground opacity-50 sm:hidden"
          disabled
          aria-label="Profile"
        >
          <UserRound className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  if (state.hasSession) {
    return (
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="hidden rounded-full border border-border px-4 text-sm font-semibold sm:inline-flex"
          onClick={signOut}
        >
          Logout
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="border border-border text-foreground sm:hidden"
          aria-label="Profile"
          onClick={signOut}
        >
          <UserRound className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="secondary"
        size="sm"
        className="hidden rounded-full px-4 text-sm font-semibold text-primary sm:inline-flex"
        onClick={() => goLogin("signup")}
      >
        Join Free
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hidden rounded-full border border-border px-4 text-sm font-semibold sm:inline-flex"
        onClick={() => goLogin("signin")}
      >
        Login
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="border border-border text-foreground sm:hidden"
        aria-label="Profile"
        onClick={() => goLogin("signin")}
      >
        <UserRound className="h-5 w-5" />
      </Button>
    </div>
  );
}

