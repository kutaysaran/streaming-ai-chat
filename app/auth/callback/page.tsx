"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase-browser";

export default function AuthCallbackPage() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        // Triggers PKCE code exchange and session hydration.
        await supabase.auth.getSession();
      } finally {
        if (!mounted) return;
        router.replace("/chat");
      }
    };
    void run();
    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-sm text-muted-foreground">Signing you in…</div>
    </div>
  );
}

