"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient, SupabaseClientOptions } from "@supabase/supabase-js";

// Ensure a single Supabase client instance across the app to avoid
// double-initialization issues during PKCE exchanges on Chrome and to keep
// cookies in sync with middleware.
let client: SupabaseClient | null = null;

export function getBrowserClient() {
  if (client) return client;

  const options: SupabaseClientOptions<"public"> = {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
      // Explicit storage adapter to avoid Chrome timing quirks.
      storage: {
        getItem: (key: string) =>
          typeof window === "undefined" ? null : window.localStorage.getItem(key),
        setItem: (key: string, value: string) => {
          if (typeof window === "undefined") return;
          window.localStorage.setItem(key, value);
        },
        removeItem: (key: string) => {
          if (typeof window === "undefined") return;
          window.localStorage.removeItem(key);
        },
      },
    },
  };

  client = createClientComponentClient({ options });

  return client;
}

