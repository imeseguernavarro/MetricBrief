import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true";

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      return new Response(`YouTube OAuth error: ${error}`, { status: 400 });
    }

    if (!code || !state) {
      return new Response("Missing OAuth code or state.", { status: 400 });
    }

    const clientId = Deno.env.get("YOUTUBE_CLIENT_ID");
    const clientSecret = Deno.env.get("YOUTUBE_CLIENT_SECRET");
    const redirectUri = Deno.env.get("YOUTUBE_REDIRECT_URI");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");

    if (!clientId || !clientSecret || !redirectUri || !supabaseUrl || !serviceRoleKey) {
      return new Response("Missing required secrets.", { status: 500 });
    }

    const { userId, redirectTo } = JSON.parse(atob(state)) as { userId: string; redirectTo: string };
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const tokenResponse = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const details = await tokenResponse.text();
      return new Response(`Token exchange failed: ${details}`, { status: 400 });
    }

    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token as string;

    const channelResponse = await fetch(CHANNELS_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!channelResponse.ok) {
      const details = await channelResponse.text();
      return new Response(`Unable to load channel profile: ${details}`, { status: 400 });
    }

    const channelData = await channelResponse.json();
    const channel = channelData.items?.[0];

    if (!channel) {
      return new Response("No YouTube channel found for this account.", { status: 404 });
    }

    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + Number(tokens.expires_in) * 1000).toISOString()
      : null;

    const { error: accountError } = await supabase.from("social_accounts").upsert(
      {
        user_id: userId,
        platform: "YouTube",
        handle: channel.snippet.customUrl ? `@${channel.snippet.customUrl}` : channel.snippet.title,
        platform_user_id: channel.id,
        connected: true,
        followers: Number(channel.statistics?.subscriberCount ?? 0),
        change_percent: 0,
        access_token: accessToken,
        refresh_token: tokens.refresh_token ?? null,
        token_expires_at: expiresAt,
        metadata: {
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnail: channel.snippet.thumbnails?.default?.url ?? null,
        },
      },
      { onConflict: "user_id,platform" }
    );

    if (accountError) {
      return new Response(`Unable to save YouTube account: ${accountError.message}`, { status: 500 });
    }

    const redirect = new URL(redirectTo);
    redirect.searchParams.set("youtube_connected", "1");
    return Response.redirect(redirect.toString(), 302);
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Unknown callback error.", { status: 500 });
  }
});
