"use client";

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient, SupabaseClientOptions } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Ensure a single Supabase client instance across the app to avoid
// double-initialization issues during PKCE exchanges on Chrome.
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

  client = createClient(supabaseUrl, supabaseAnonKey, options);

  return client;
}

