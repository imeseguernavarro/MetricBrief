import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const USER_INFO_URL = "https://open.tiktokapis.com/v2/user/info/";
const VIDEO_LIST_URL = "https://open.tiktokapis.com/v2/video/list/";
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
    const clientKey = Deno.env.get("TIKTOK_CLIENT_KEY");
    const clientSecret = Deno.env.get("TIKTOK_CLIENT_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");

    if (!authHeader || !clientKey || !clientSecret || !supabaseUrl || !anonKey || !serviceRoleKey) {
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
      .eq("platform", "TikTok")
      .maybeSingle<SocialAccountRow>();

    if (accountLookupError) {
      return Response.json({ error: accountLookupError.message }, { status: 500, headers: corsHeaders });
    }

    if (!account?.refresh_token) {
      return Response.json({ error: "TikTok account is not connected yet." }, { status: 404, headers: corsHeaders });
    }

    const accessToken = await ensureAccessToken({
      account,
      clientKey,
      clientSecret,
      supabase,
    });

    const [profile, recentVideos] = await Promise.all([fetchTikTokProfile(accessToken), fetchRecentVideos(accessToken)]);

    const followers = Number(profile.follower_count ?? 0);
    const previousFollowers = Number(account.followers ?? 0);
    const changePercent = previousFollowers > 0 ? ((followers - previousFollowers) / previousFollowers) * 100 : 0;

    const { error: accountUpsertError } = await supabase.from("social_accounts").upsert(
      {
        user_id: userId,
        platform: "TikTok",
        handle: profile.username ? `@${profile.username}` : profile.display_name,
        platform_user_id: profile.open_id,
        connected: true,
        followers,
        change_percent: Number(changePercent.toFixed(1)),
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

    if (accountUpsertError) {
      return Response.json({ error: accountUpsertError.message }, { status: 500, headers: corsHeaders });
    }

    const today = new Date().toISOString().slice(0, 10);
    const delta = followers - previousFollowers;
    const { error: snapshotError } = await supabase.from("follower_snapshots").upsert(
      {
        user_id: userId,
        platform: "TikTok",
        snapshot_date: today,
        followers: delta,
      },
      { onConflict: "user_id,platform,snapshot_date" }
    );

    if (snapshotError) {
      return Response.json({ error: snapshotError.message }, { status: 500, headers: corsHeaders });
    }

    if (recentVideos.length) {
      const { error: postsError } = await supabase.from("social_posts").upsert(
        recentVideos.map((video) => ({
          user_id: userId,
          platform: "TikTok",
          platform_post_id: video.id,
          title: video.title,
          format: "Short vertical",
          published_at: video.published_at,
          views: video.views,
          likes: video.likes,
          comments: video.comments,
          shares: video.shares,
          saves: 0,
          metadata: {
            thumbnail: video.thumbnail,
            duration: video.duration,
            share_url: video.share_url,
            embed_link: video.embed_link,
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
          display_name: profile.display_name,
          username: profile.username,
          followers,
        },
        videosSynced: recentVideos.length,
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
  clientKey,
  clientSecret,
  supabase,
}: {
  account: SocialAccountRow;
  clientKey: string;
  clientSecret: string;
  supabase: ReturnType<typeof createClient>;
}) {
  const expiresAt = account.token_expires_at ? new Date(account.token_expires_at).getTime() : 0;
  if (account.access_token && expiresAt > Date.now() + 60_000) {
    return account.access_token;
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      refresh_token: account.refresh_token ?? "",
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to refresh TikTok token: ${details}`);
  }

  const payload = await response.json();
  const nextAccessToken = payload.access_token as string;
  const tokenExpiresAt = new Date(Date.now() + Number(payload.expires_in) * 1000).toISOString();

  await supabase
    .from("social_accounts")
    .update({
      access_token: nextAccessToken,
      refresh_token: payload.refresh_token ?? account.refresh_token,
      token_expires_at: tokenExpiresAt,
    })
    .eq("user_id", account.user_id)
    .eq("platform", "TikTok");

  return nextAccessToken;
}

async function fetchTikTokProfile(accessToken: string) {
  const url = new URL(USER_INFO_URL);
  url.searchParams.set(
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

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to load TikTok profile: ${details}`);
  }

  const data = await response.json();
  return data.data?.user;
}

async function fetchRecentVideos(accessToken: string) {
  const url = new URL(VIDEO_LIST_URL);
  url.searchParams.set(
    "fields",
    ["id", "title", "video_description", "create_time", "cover_image_url", "duration", "share_url", "embed_link", "like_count", "comment_count", "share_count", "view_count"].join(",")
  );

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ max_count: 10 }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to load TikTok videos: ${details}`);
  }

  const data = await response.json();
  const videos = (data.data?.videos ?? []) as Array<{
    id: string;
    title?: string;
    video_description?: string;
    create_time?: number;
    cover_image_url?: string;
    duration?: number;
    share_url?: string;
    embed_link?: string;
    like_count?: number;
    comment_count?: number;
    share_count?: number;
    view_count?: number;
  }>;

  return videos
    .filter((video) => Boolean(video.id) && Boolean(video.create_time))
    .map((video) => ({
      id: video.id,
      title: video.title || video.video_description || "TikTok video",
      published_at: new Date(Number(video.create_time ?? 0) * 1000).toISOString(),
      thumbnail: video.cover_image_url ?? null,
      duration: Number(video.duration ?? 0),
      share_url: video.share_url ?? null,
      embed_link: video.embed_link ?? null,
      views: Number(video.view_count ?? 0),
      likes: Number(video.like_count ?? 0),
      comments: Number(video.comment_count ?? 0),
      shares: Number(video.share_count ?? 0),
    }));
}
