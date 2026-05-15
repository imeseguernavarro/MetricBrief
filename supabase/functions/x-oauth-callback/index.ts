import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const TOKEN_URL = "https://api.x.com/2/oauth2/token";
const PROFILE_URL =
  "https://api.x.com/2/users/me?user.fields=created_at,description,profile_image_url,public_metrics,verified,url";

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      return new Response(`X OAuth error: ${error}`, { status: 400 });
    }

    if (!code || !state) {
      return new Response("Missing OAuth code or state.", { status: 400 });
    }

    const clientId = Deno.env.get("X_CLIENT_ID");
    const clientSecret = Deno.env.get("X_CLIENT_SECRET");
    const redirectUri = Deno.env.get("X_REDIRECT_URI");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");

    if (!clientId || !clientSecret || !redirectUri || !supabaseUrl || !serviceRoleKey) {
      return new Response("Missing required secrets.", { status: 500 });
    }

    const { userId, redirectTo, codeVerifier } = JSON.parse(atob(state)) as {
      userId: string;
      redirectTo: string;
      codeVerifier: string;
    };
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const tokenResponse = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
        client_id: clientId,
      }),
    });

    if (!tokenResponse.ok) {
      const details = await tokenResponse.text();
      return new Response(`Token exchange failed: ${details}`, { status: 400 });
    }

    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token as string;

    const profileResponse = await fetch(PROFILE_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileResponse.ok) {
      const details = await profileResponse.text();
      return new Response(`Unable to load X profile: ${details}`, { status: 400 });
    }

    const profileData = await profileResponse.json();
    const profile = profileData.data;

    if (!profile?.id) {
      return new Response("No X profile found for this account.", { status: 404 });
    }

    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + Number(tokens.expires_in) * 1000).toISOString()
      : null;

    const { error: accountError } = await supabase.from("social_accounts").upsert(
      {
        user_id: userId,
        platform: "X",
        handle: profile.username ? `@${profile.username}` : profile.name,
        platform_user_id: profile.id,
        connected: true,
        followers: Number(profile.public_metrics?.followers_count ?? 0),
        change_percent: 0,
        access_token: accessToken,
        refresh_token: tokens.refresh_token ?? null,
        token_expires_at: expiresAt,
        metadata: {
          title: profile.name,
          description: profile.description ?? "",
          thumbnail: profile.profile_image_url ?? null,
          verified: Boolean(profile.verified),
          following_count: Number(profile.public_metrics?.following_count ?? 0),
          tweet_count: Number(profile.public_metrics?.tweet_count ?? 0),
          listed_count: Number(profile.public_metrics?.listed_count ?? 0),
          profile_url: profile.url ?? null,
        },
      },
      { onConflict: "user_id,platform" }
    );

    if (accountError) {
      return new Response(`Unable to save X account: ${accountError.message}`, { status: 500 });
    }

    const redirect = new URL(redirectTo);
    redirect.searchParams.set("x_connected", "1");
    return Response.redirect(redirect.toString(), 302);
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Unknown callback error.", {
      status: 500,
    });
  }
});
