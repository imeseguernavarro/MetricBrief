import { isSupabaseConfigured, supabase, supabasePublicKey } from "./client";

const functionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;

export type SocialProvider = "youtube" | "tiktok";

async function getAuthHeaders(providerLabel: string) {
  if (!supabase) {
    throw new Error("Supabase no esta configurado.");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error(`Inicia sesion para conectar ${providerLabel}.`);
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
    apikey: supabasePublicKey,
  };
}

export async function startProviderOAuth(provider: SocialProvider, providerLabel: string, options: { redirectTo: string }) {
  if (!isSupabaseConfigured || !functionsUrl) {
    throw new Error("Supabase no esta configurado.");
  }

  const headers = await getAuthHeaders(providerLabel);
  const response = await fetch(`${functionsUrl}/${provider}-oauth-start`, {
    method: "POST",
    headers,
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `No se pudo iniciar OAuth de ${providerLabel}.`);
  }

  const data = (await response.json()) as { url: string };
  window.location.href = data.url;
}

export async function syncProvider(provider: SocialProvider, providerLabel: string) {
  if (!isSupabaseConfigured || !functionsUrl) {
    throw new Error("Supabase no esta configurado.");
  }

  const headers = await getAuthHeaders(providerLabel);
  const response = await fetch(`${functionsUrl}/${provider}-sync`, {
    method: "POST",
    headers,
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `No se pudo sincronizar ${providerLabel}.`);
  }

  return response.json();
}
