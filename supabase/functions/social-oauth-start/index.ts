import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const platformConfig: Record<string, { authorizeUrl: string; scope: string }> = {
  youtube: {
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly",
  },
  instagram: {
    authorizeUrl: "https://www.facebook.com/v23.0/dialog/oauth",
    scope: "instagram_basic,instagram_manage_insights,pages_show_list",
  },
  tiktok: {
    authorizeUrl: "https://www.tiktok.com/v2/auth/authorize/",
    scope: "user.info.basic,video.list",
  },
};

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const platform = url.searchParams.get("platform")?.toLowerCase();

  if (!platform || !platformConfig[platform]) {
    return Response.json({ error: "Unsupported platform" }, { status: 400 });
  }

  const clientId = Deno.env.get(`${platform.toUpperCase()}_CLIENT_ID`);
  const redirectUri = Deno.env.get(`${platform.toUpperCase()}_REDIRECT_URI`);

  if (!clientId || !redirectUri) {
    return Response.json({ error: "Missing OAuth configuration" }, { status: 500 });
  }

  const state = crypto.randomUUID();
  const config = platformConfig[platform];
  const authUrl = new URL(config.authorizeUrl);

  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", config.scope);
  authUrl.searchParams.set("state", state);

  return Response.json({ url: authUrl.toString(), state });
});
