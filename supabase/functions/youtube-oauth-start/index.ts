import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/yt-analytics.readonly",
];
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
  const clientId = Deno.env.get("YOUTUBE_CLIENT_ID");
  const redirectUri = Deno.env.get("YOUTUBE_REDIRECT_URI");
  const { redirectTo } = await req.json().catch(() => ({}));

  if (!authHeader || !supabaseUrl || !anonKey) {
    return Response.json({ error: "Missing auth context." }, { status: 401, headers: corsHeaders });
  }

  if (!clientId || !redirectUri) {
    return Response.json({ error: "Missing YouTube OAuth secrets" }, { status: 500, headers: corsHeaders });
  }

  if (!redirectTo) {
    return Response.json({ error: "Missing redirectTo" }, { status: 400, headers: corsHeaders });
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

  // Production note: replace this with a signed + persisted anti-CSRF state token.
  const state = btoa(JSON.stringify({ userId: user.id, redirectTo }));
  const url = new URL(AUTH_URL);

  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("scope", SCOPES.join(" "));
  url.searchParams.set("state", state);

  return Response.json({ url: url.toString() }, { headers: corsHeaders });
});
