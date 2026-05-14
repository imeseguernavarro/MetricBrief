import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/";
const SCOPES = ["user.info.basic", "user.info.profile", "user.info.stats", "video.list"];
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
  const clientKey = Deno.env.get("TIKTOK_CLIENT_KEY");
  const redirectUri = Deno.env.get("TIKTOK_REDIRECT_URI");
  const { redirectTo } = await req.json().catch(() => ({}));

  if (!authHeader || !supabaseUrl || !anonKey) {
    return Response.json({ error: "Missing auth context." }, { status: 401, headers: corsHeaders });
  }

  if (!clientKey || !redirectUri) {
    return Response.json({ error: "Missing TikTok OAuth secrets." }, { status: 500, headers: corsHeaders });
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

  const state = btoa(JSON.stringify({ userId: user.id, redirectTo }));
  const url = new URL(AUTH_URL);

  url.searchParams.set("client_key", clientKey);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", SCOPES.join(","));
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);

  return Response.json({ url: url.toString() }, { headers: corsHeaders });
});
