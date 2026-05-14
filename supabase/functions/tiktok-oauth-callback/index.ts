import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const USER_INFO_URL = "https://open.tiktokapis.com/v2/user/info/";

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      return new Response(`TikTok OAuth error: ${error}`, { status: 400 });
    }

    if (!code || !state) {
      return new Response("Missing OAuth code or state.", { status: 400 });
    }

    const clientKey = Deno.env.get("TIKTOK_CLIENT_KEY");
    const clientSecret = Deno.env.get("TIKTOK_CLIENT_SECRET");
    const redirectUri = Deno.env.get("TIKTOK_REDIRECT_URI");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");

    if (!clientKey || !clientSecret || !redirectUri || !supabaseUrl || !serviceRoleKey) {
      return new Response("Missing required secrets.", { status: 500 });
    }

    const { userId, redirectTo } = JSON.parse(atob(state)) as { userId: string; redirectTo: string };
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const tokenResponse = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const details = await tokenResponse.text();
      return new Response(`Token exchange failed: ${details}`, { status: 400 });
    }

    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token as string;

    const userInfoUrl = new URL(USER_INFO_URL);
    userInfoUrl.searchParams.set(
      "fields",
      [
        "open_id",
        "avatar_url",
        "avatar_large_url",
        "display_name",
        "bio_description",
        "profile_deep_link",
        "is_verified",
        "username",
        "follower_count",
        "following_count",
        "likes_count",
        "video_count",
      ].join(",")
    );

    const userResponse = await fetch(userInfoUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userResponse.ok) {
      const details = await userResponse.text();
      return new Response(`Unable to load TikTok profile: ${details}`, { status: 400 });
    }

    const userData = await userResponse.json();
    const profile = userData.data?.user;

    if (!profile?.open_id) {
      return new Response("No TikTok profile found for this account.", { status: 404 });
    }

    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + Number(tokens.expires_in) * 1000).toISOString()
      : null;

    const { error: accountError } = await supabase.from("social_accounts").upsert(
      {
        user_id: userId,
        platform: "TikTok",
        handle: profile.username ? `@${profile.username}` : profile.display_name,
        platform_user_id: profile.open_id,
        connected: true,
        followers: Number(profile.follower_count ?? 0),
        change_percent: 0,
        access_token: accessToken,
        refresh_token: tokens.refresh_token ?? null,
        token_expires_at: expiresAt,
        metadata: {
          title: profile.display_name,
          description: profile.bio_description,
          thumbnail: profile.avatar_large_url ?? profile.avatar_url ?? null,
          profile_deep_link: profile.profile_deep_link ?? null,
          following_count: Number(profile.following_count ?? 0),
          likes_count: Number(profile.likes_count ?? 0),
          video_count: Number(profile.video_count ?? 0),
          verified: Boolean(profile.is_verified),
        },
      },
      { onConflict: "user_id,platform" }
    );

    if (accountError) {
      return new Response(`Unable to save TikTok account: ${accountError.message}`, { status: 500 });
    }

    const redirect = new URL(redirectTo);
    redirect.searchParams.set("tiktok_connected", "1");
    return Response.redirect(redirect.toString(), 302);
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Unknown callback error.", { status: 500 });
  }
});
