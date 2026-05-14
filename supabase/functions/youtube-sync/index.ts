import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const YT_DATA_API = "https://www.googleapis.com/youtube/v3";
const YT_ANALYTICS_API = "https://youtubeanalytics.googleapis.com/v2/reports";
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
    const clientId = Deno.env.get("YOUTUBE_CLIENT_ID");
    const clientSecret = Deno.env.get("YOUTUBE_CLIENT_SECRET");
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
      .select("user_id, platform_user_id, access_token, refresh_token, token_expires_at")
      .eq("user_id", userId)
      .eq("platform", "YouTube")
      .maybeSingle<SocialAccountRow>();

    if (accountLookupError) {
      return Response.json({ error: accountLookupError.message }, { status: 500, headers: corsHeaders });
    }

    if (!account?.refresh_token) {
      return Response.json({ error: "YouTube account is not connected yet." }, { status: 404, headers: corsHeaders });
    }

    const accessToken = await ensureAccessToken({
      account,
      clientId,
      clientSecret,
      supabase,
    });

    const [channel, recentVideos, dailyMetrics, countryMetrics, demographicMetrics] = await Promise.all([
      fetchYouTubeChannel(accessToken),
      fetchRecentVideos(accessToken),
      fetchDailyMetrics(accessToken),
      fetchCountryMetrics(accessToken),
      fetchDemographicMetrics(accessToken),
    ]);

    const { error: accountUpsertError } = await supabase.from("social_accounts").upsert(
      {
        user_id: userId,
        platform: "YouTube",
        handle: channel.handle,
        platform_user_id: channel.id,
        connected: true,
        followers: channel.followers,
        change_percent: 0,
        metadata: {
          title: channel.title,
          thumbnail: channel.thumbnail,
          views: channel.viewCount,
          videoCount: channel.videoCount,
        },
      },
      { onConflict: "user_id,platform" }
    );

    if (accountUpsertError) {
      return Response.json({ error: accountUpsertError.message }, { status: 500, headers: corsHeaders });
    }

    if (dailyMetrics.length) {
      const { error: snapshotsError } = await supabase.from("follower_snapshots").upsert(
        dailyMetrics.map((item) => ({
          user_id: userId,
          platform: "YouTube",
          snapshot_date: item.date,
          followers: item.subscribersGained - item.subscribersLost,
        })),
        { onConflict: "user_id,platform,snapshot_date" }
      );

      if (snapshotsError) {
        return Response.json({ error: snapshotsError.message }, { status: 500, headers: corsHeaders });
      }
    }

    if (recentVideos.length) {
      const { error: postsError } = await supabase.from("social_posts").upsert(
        recentVideos.map((video) => ({
          user_id: userId,
          platform: "YouTube",
          platform_post_id: video.id,
          title: video.title,
          format: "Video largo",
          published_at: video.publishedAt,
          views: video.views,
          likes: video.likes,
          comments: video.comments,
          shares: video.shares,
          saves: 0,
          metadata: {
            thumbnail: video.thumbnail,
            duration: video.duration,
          },
        })),
        { onConflict: "platform,platform_post_id" }
      );

      if (postsError) {
        return Response.json({ error: postsError.message }, { status: 500, headers: corsHeaders });
      }
    }

    const { error: audienceError } = await supabase.from("audience_snapshots").upsert(
      {
        user_id: userId,
        platform: "YouTube",
        snapshot_date: new Date().toISOString().slice(0, 10),
        age_groups: demographicMetrics.ageGroups,
        gender: demographicMetrics.gender,
        countries: countryMetrics,
        best_times: null,
      },
      { onConflict: "user_id,platform,snapshot_date" }
    );

    if (audienceError) {
      return Response.json({ error: audienceError.message }, { status: 500, headers: corsHeaders });
    }

    return Response.json(
      {
        ok: true,
        channel,
        videosSynced: recentVideos.length,
        followerSnapshotsSynced: dailyMetrics.length,
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

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: account.refresh_token ?? "",
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to refresh YouTube token: ${details}`);
  }

  const payload = await response.json();
  const nextAccessToken = payload.access_token as string;
  const tokenExpiresAt = new Date(Date.now() + Number(payload.expires_in) * 1000).toISOString();

  await supabase
    .from("social_accounts")
    .update({ access_token: nextAccessToken, token_expires_at: tokenExpiresAt })
    .eq("user_id", account.user_id)
    .eq("platform", "YouTube");

  return nextAccessToken;
}

async function fetchYouTubeChannel(accessToken: string) {
  const response = await fetch(`${YT_DATA_API}/channels?part=snippet,statistics&mine=true`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json();
  const channel = data.items?.[0];

  return {
    id: channel.id as string,
    title: channel.snippet.title as string,
    handle: channel.snippet.customUrl ? `@${channel.snippet.customUrl}` : channel.snippet.title,
    thumbnail: channel.snippet.thumbnails?.default?.url ?? null,
    followers: Number(channel.statistics?.subscriberCount ?? 0),
    viewCount: Number(channel.statistics?.viewCount ?? 0),
    videoCount: Number(channel.statistics?.videoCount ?? 0),
  };
}

async function fetchRecentVideos(accessToken: string) {
  const searchResponse = await fetch(
    `${YT_DATA_API}/search?part=snippet&forMine=true&type=video&order=date&maxResults=6`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const searchData = await searchResponse.json();
  const ids = (searchData.items ?? []).map((item: { id: { videoId: string } }) => item.id.videoId).filter(Boolean);

  if (!ids.length) return [];

  const videosResponse = await fetch(
    `${YT_DATA_API}/videos?part=snippet,statistics,contentDetails&id=${ids.join(",")}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const videosData = await videosResponse.json();

  return (videosData.items ?? []).map(
    (item: {
      id: string;
      snippet: { title: string; publishedAt: string; thumbnails?: { medium?: { url?: string } } };
      statistics?: { viewCount?: string; likeCount?: string; commentCount?: string };
      contentDetails?: { duration?: string };
    }) => ({
      id: item.id,
      title: item.snippet.title,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails?.medium?.url ?? null,
      duration: item.contentDetails?.duration ?? null,
      views: Number(item.statistics?.viewCount ?? 0),
      likes: Number(item.statistics?.likeCount ?? 0),
      comments: Number(item.statistics?.commentCount ?? 0),
      shares: 0,
    })
  );
}

async function fetchDailyMetrics(accessToken: string) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 89);

  const url = new URL(YT_ANALYTICS_API);
  url.searchParams.set("ids", "channel==MINE");
  url.searchParams.set("startDate", start.toISOString().slice(0, 10));
  url.searchParams.set("endDate", today.toISOString().slice(0, 10));
  url.searchParams.set("dimensions", "day");
  url.searchParams.set("metrics", "views,likes,comments,shares,subscribersGained,subscribersLost");
  url.searchParams.set("sort", "day");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json();

  return (data.rows ?? []).map((row: [string, number, number, number, number, number, number]) => ({
    date: row[0],
    views: row[1],
    likes: row[2],
    comments: row[3],
    shares: row[4],
    subscribersGained: row[5],
    subscribersLost: row[6],
  }));
}

async function fetchCountryMetrics(accessToken: string) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 29);

  const url = new URL(YT_ANALYTICS_API);
  url.searchParams.set("ids", "channel==MINE");
  url.searchParams.set("startDate", start.toISOString().slice(0, 10));
  url.searchParams.set("endDate", today.toISOString().slice(0, 10));
  url.searchParams.set("dimensions", "country");
  url.searchParams.set("metrics", "views");
  url.searchParams.set("sort", "-views");
  url.searchParams.set("maxResults", "5");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json();

  return (data.rows ?? []).map((row: [string, number]) => ({
    label: row[0],
    value: row[1],
  }));
}

async function fetchDemographicMetrics(accessToken: string) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 29);

  const url = new URL(YT_ANALYTICS_API);
  url.searchParams.set("ids", "channel==MINE");
  url.searchParams.set("startDate", start.toISOString().slice(0, 10));
  url.searchParams.set("endDate", today.toISOString().slice(0, 10));
  url.searchParams.set("dimensions", "ageGroup,gender");
  url.searchParams.set("metrics", "viewerPercentage");
  url.searchParams.set("sort", "-viewerPercentage");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json();
  const rows = (data.rows ?? []) as Array<[string, string, number]>;

  const ageMap = new Map<string, number>();
  const genderMap = new Map<string, number>();

  for (const [ageGroup, gender, viewerPercentage] of rows) {
    ageMap.set(ageGroup, (ageMap.get(ageGroup) ?? 0) + viewerPercentage);
    genderMap.set(gender, (genderMap.get(gender) ?? 0) + viewerPercentage);
  }

  return {
    ageGroups: Array.from(ageMap.entries()).map(([label, value]) => ({ label, value })),
    gender: Array.from(genderMap.entries()).map(([label, value]) => ({ label, value })),
  };
}
