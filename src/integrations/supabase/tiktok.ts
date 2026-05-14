import { startProviderOAuth, syncProvider } from "./social";

export async function startTikTokOAuth(options: { redirectTo: string }) {
  return startProviderOAuth("tiktok", "TikTok", options);
}

export async function syncTikTok() {
  return syncProvider("tiktok", "TikTok");
}
