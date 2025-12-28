import { useCallback, useEffect, useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";

type ProfileGuardResult = {
  userId: string | null;
  profileReady: boolean;
  loadingUser: boolean;
  ensuringProfile: boolean;
  ensureProfile: () => Promise<boolean>;
};

export function useProfileGuard(supabase: SupabaseClient): ProfileGuardResult {
  const [userId, setUserId] = useState<string | null>(null);
  const [profileReady, setProfileReady] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [ensuringProfile, setEnsuringProfile] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUserId(data.user?.id ?? null);
      setLoadingUser(false);
    }
    void loadUser();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  const ensureProfile = useCallback(async () => {
    if (!userId) return false;
    setEnsuringProfile(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId }, { onConflict: "id" });
    setEnsuringProfile(false);
    if (error) {
      return false;
    }
    setProfileReady(true);
    return true;
  }, [supabase, userId]);

  useEffect(() => {
    if (!userId) {
      setProfileReady(false);
      return;
    }
    void ensureProfile();
  }, [ensureProfile, userId]);

  return { userId, profileReady, loadingUser, ensuringProfile, ensureProfile };
}

