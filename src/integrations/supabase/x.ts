import { startProviderOAuth, syncProvider } from "./social";

export async function startXOAuth(options: { redirectTo: string }) {
  return startProviderOAuth("x", "X", options);
}

export async function syncX() {
  return syncProvider("x", "X");
}
