import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { ensureCreatorProfile } from "../integrations/supabase/auth";
import { isSupabaseConfigured, supabase } from "../integrations/supabase/client";

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        ensureCreatorProfile().catch((error) => console.error("Unable to ensure creator profile", error));
      }
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        ensureCreatorProfile().catch((error) => console.error("Unable to ensure creator profile", error));
      }
      setLoading(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  return { session, user, loading, isConfigured: isSupabaseConfigured };
}
