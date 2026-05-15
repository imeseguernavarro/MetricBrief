import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const AUTH_URL = "https://x.com/i/oauth2/authorize";
const SCOPES = ["tweet.read", "users.read", "offline.access"];
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const clientId = Deno.env.get("X_CLIENT_ID");
  const redirectUri = Deno.env.get("X_REDIRECT_URI");
  const { redirectTo } = await req.json().catch(() => ({}));

  if (!authHeader || !supabaseUrl || !anonKey) {
    return Response.json({ error: "Missing auth context." }, { status: 401, headers: corsHeaders });
  }

  if (!clientId || !redirectUri) {
    return Response.json({ error: "Missing X OAuth secrets." }, { status: 500, headers: corsHeaders });
  }

  if (!redirectTo) {
    return Response.json({ error: "Missing redirectTo." }, { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: {
      headers: { Authorization: authHeader },
    },
  });
  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  if (!user) {
    return Response.json({ error: "Invalid session." }, { status: 401, headers: corsHeaders });
  }

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = btoa(JSON.stringify({ userId: user.id, redirectTo, codeVerifier }));
  const url = new URL(AUTH_URL);

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", SCOPES.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  return Response.json({ url: url.toString() }, { headers: corsHeaders });
});

function generateCodeVerifier() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return base64UrlEncode(bytes);
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
