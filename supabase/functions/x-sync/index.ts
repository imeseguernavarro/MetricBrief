import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const TOKEN_URL = "https://api.x.com/2/oauth2/token";
const PROFILE_URL =
  "https://api.x.com/2/users/me?user.fields=created_at,description,profile_image_url,public_metrics,verified,url";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type SocialAccountRow = {
  user_id: string;
  platform_user_id: string | null;
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: string | null;
  followers: number;
};

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
    }

    const authHeader = req.headers.get("Authorization");
    const clientId = Deno.env.get("X_CLIENT_ID");
    const clientSecret = Deno.env.get("X_CLIENT_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");

    if (!authHeader || !clientId || !clientSecret || !supabaseUrl || !anonKey || !serviceRoleKey) {
      return Response.json({ error: "Missing configuration." }, { status: 400, headers: corsHeaders });
    }

    const authClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
    } = await authClient.auth.getUser(token);

    if (!user) {
      return Response.json({ error: "Invalid session." }, { status: 401, headers: corsHeaders });
    }

    const userId = user.id;
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data: account, error: accountLookupError } = await supabase
      .from("social_accounts")
      .select("user_id, platform_user_id, access_token, refresh_token, token_expires_at, followers")
      .eq("user_id", userId)
      .eq("platform", "X")
      .maybeSingle<SocialAccountRow>();

    if (accountLookupError) {
      return Response.json({ error: accountLookupError.message }, { status: 500, headers: corsHeaders });
    }

    if (!account?.refresh_token) {
      return Response.json({ error: "X account is not connected yet." }, { status: 404, headers: corsHeaders });
    }

    const accessToken = await ensureAccessToken({
      account,
      clientId,
      clientSecret,
      supabase,
    });

    const profile = await fetchXProfile(accessToken);
    const recentPosts = await fetchRecentPosts(accessToken, profile.id);

    const followers = Number(profile.public_metrics?.followers_count ?? 0);
    const previousFollowers = Number(account.followers ?? 0);
    const changePercent = previousFollowers > 0 ? ((followers - previousFollowers) / previousFollowers) * 100 : 0;

    const { error: accountUpsertError } = await supabase.from("social_accounts").upsert(
      {
        user_id: userId,
        platform: "X",
        handle: profile.username ? `@${profile.username}` : profile.name,
        platform_user_id: profile.id,
        connected: true,
        followers,
        change_percent: Number(changePercent.toFixed(1)),
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

    if (accountUpsertError) {
      return Response.json({ error: accountUpsertError.message }, { status: 500, headers: corsHeaders });
    }

    const today = new Date().toISOString().slice(0, 10);
    const delta = followers - previousFollowers;
    const { error: snapshotError } = await supabase.from("follower_snapshots").upsert(
      {
        user_id: userId,
        platform: "X",
        snapshot_date: today,
        followers: delta,
      },
      { onConflict: "user_id,platform,snapshot_date" }
    );

    if (snapshotError) {
      return Response.json({ error: snapshotError.message }, { status: 500, headers: corsHeaders });
    }

    if (recentPosts.length) {
      const { error: postsError } = await supabase.from("social_posts").upsert(
        recentPosts.map((post) => ({
          user_id: userId,
          platform: "X",
          platform_post_id: post.id,
          title: post.title,
          format: "Post",
          published_at: post.published_at,
          views: post.views,
          likes: post.likes,
          comments: post.comments,
          shares: post.shares,
          saves: post.saves,
          metadata: {
            permalink: post.permalink,
            thumbnail: post.thumbnail,
          },
        })),
        { onConflict: "platform,platform_post_id" }
      );

      if (postsError) {
        return Response.json({ error: postsError.message }, { status: 500, headers: corsHeaders });
      }
    }

    return Response.json(
      {
        ok: true,
        profile: {
          name: profile.name,
          username: profile.username,
          followers,
        },
        postsSynced: recentPosts.length,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown sync error." },
      { status: 500, headers: corsHeaders }
    );
  }
});

async function ensureAccessToken({
  account,
  clientId,
  clientSecret,
  supabase,
}: {
  account: SocialAccountRow;
  clientId: string;
  clientSecret: string;
  supabase: ReturnType<typeof createClient>;
}) {
  const expiresAt = account.token_expires_at ? new Date(account.token_expires_at).getTime() : 0;
  if (account.access_token && expiresAt > Date.now() + 60_000) {
    return account.access_token;
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      refresh_token: account.refresh_token ?? "",
      grant_type: "refresh_token",
      client_id: clientId,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to refresh X token: ${details}`);
  }

  const payload = await response.json();
  const nextAccessToken = payload.access_token as string;
  const nextRefreshToken = (payload.refresh_token as string | undefined) ?? account.refresh_token;
  const tokenExpiresAt = new Date(Date.now() + Number(payload.expires_in) * 1000).toISOString();

  await supabase
    .from("social_accounts")
    .update({
      access_token: nextAccessToken,
      refresh_token: nextRefreshToken,
      token_expires_at: tokenExpiresAt,
    })
    .eq("user_id", account.user_id)
    .eq("platform", "X");

  return nextAccessToken;
}

async function fetchXProfile(accessToken: string) {
  const response = await fetch(PROFILE_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to load X profile: ${details}`);
  }

  const data = await response.json();
  return data.data as {
    id: string;
    name: string;
    username: string;
    description?: string;
    verified?: boolean;
    url?: string;
    profile_image_url?: string;
    public_metrics?: {
      followers_count?: number;
      following_count?: number;
      tweet_count?: number;
      listed_count?: number;
    };
  };
}

async function fetchRecentPosts(accessToken: string, userId: string) {
  const url = new URL(`https://api.x.com/2/users/${userId}/tweets`);
  url.searchParams.set("max_results", "10");
  url.searchParams.set("exclude", "replies,retweets");
  url.searchParams.set("tweet.fields", "created_at,public_metrics,attachments");
  url.searchParams.set("expansions", "attachments.media_keys");
  url.searchParams.set("media.fields", "preview_image_url,url");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to load X posts: ${details}`);
  }

  const payload = await response.json();
  const posts = (payload.data ?? []) as Array<{
    id: string;
    text: string;
    created_at: string;
    attachments?: { media_keys?: string[] };
    public_metrics?: {
      like_count?: number;
      reply_count?: number;
      retweet_count?: number;
      quote_count?: number;
      bookmark_count?: number;
      impression_count?: number;
    };
  }>;
  const media = new Map<string, { preview_image_url?: string; url?: string }>(
    ((payload.includes?.media ?? []) as Array<{ media_key: string; preview_image_url?: string; url?: string }>).map((item) => [item.media_key, item])
  );

  return posts.map((post) => {
    const mediaKey = post.attachments?.media_keys?.[0];
    const mediaItem = mediaKey ? media.get(mediaKey) : undefined;
    const title = post.text.length > 120 ? `${post.text.slice(0, 117)}...` : post.text;

    return {
      id: post.id,
      title: title || "X post",
      published_at: post.created_at,
      thumbnail: mediaItem?.preview_image_url ?? mediaItem?.url ?? null,
      permalink: `https://x.com/i/web/status/${post.id}`,
      views: Number(post.public_metrics?.impression_count ?? 0),
      likes: Number(post.public_metrics?.like_count ?? 0),
      comments: Number(post.public_metrics?.reply_count ?? 0),
      shares: Number(post.public_metrics?.retweet_count ?? 0) + Number(post.public_metrics?.quote_count ?? 0),
      saves: Number(post.public_metrics?.bookmark_count ?? 0),
    };
  });
}
