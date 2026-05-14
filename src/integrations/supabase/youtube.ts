import { startProviderOAuth, syncProvider } from "./social";

export async function startYouTubeOAuth(options: { redirectTo: string }) {
  return startProviderOAuth("youtube", "YouTube", options);
}

export async function syncYouTube() {
  return syncProvider("youtube", "YouTube");
}
