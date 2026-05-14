import { isSupabaseConfigured, supabase } from "./client";
import type { Database } from "./types";

export async function signInWithGoogle(redirectTo?: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase Auth no esta configurado.");
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: redirectTo ? { redirectTo } : undefined,
  });

  if (error) throw error;
}

export async function signOut() {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function signInWithPassword(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase Auth no esta configurado.");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
}

export async function signUpWithEmail(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase Auth no esta configurado.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) throw error;
  return data;
}

export async function sendPasswordReset(email: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase Auth no esta configurado.");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login`,
  });

  if (error) throw error;
}

export async function ensureCreatorProfile() {
  if (!isSupabaseConfigured || !supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const payload: Database["public"]["Tables"]["creator_profiles"]["Insert"] = {
    id: user.id,
    full_name:
      user.user_metadata.full_name ??
      user.user_metadata.name ??
      user.email?.split("@")[0] ??
      "Creator",
    avatar_url: user.user_metadata.avatar_url ?? user.user_metadata.picture ?? null,
    role: "Creator strategist",
  };

  const { error } = await supabase.from("creator_profiles").upsert(payload, { onConflict: "id" });
  if (error) throw error;
}
