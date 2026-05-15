import type { Platform } from "./data/mock";

export const platformClass: Record<Platform, string> = {
  TikTok: "bg-ink text-white",
  Instagram: "bg-coral text-white",
  YouTube: "bg-red-600 text-white",
  X: "bg-slate-900 text-white",
};

export function compact(value: number) {
  return new Intl.NumberFormat("es", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function percent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}
