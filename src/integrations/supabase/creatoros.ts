import type { GrowthPoint, PlatformStatus, Post } from "../../data/mock";
import {
  aiInsights,
  audience,
  engagementBreakdown,
  growthSeries,
  heatmap,
  initialPlatforms,
  topPosts,
  userProfile,
  type Period,
} from "../../data/mock";
import { isSupabaseConfigured, supabase } from "./client";

type AudienceShape = typeof audience;
type HeatmapShape = typeof heatmap;
type InsightShape = typeof aiInsights;
type EngagementShape = typeof engagementBreakdown;

export type CreatorOSData = {
  profile: typeof userProfile;
  platforms: PlatformStatus[];
  topPosts: Post[];
  audience: AudienceShape;
  growthSeries: Record<Period, GrowthPoint[]>;
  aiInsights: InsightShape;
  engagementBreakdown: EngagementShape;
  heatmap: HeatmapShape;
  source: "mock" | "supabase";
};

export const fallbackCreatorOSData: CreatorOSData = {
  profile: userProfile,
  platforms: initialPlatforms,
  topPosts,
  audience,
  growthSeries,
  aiInsights,
  engagementBreakdown,
  heatmap,
  source: "mock",
};

const emptyGrowthSeries: Record<Period, GrowthPoint[]> = {
  "7d": [],
  "30d": [],
  "90d": [],
  "1y": [],
};

export const emptyCreatorOSData: CreatorOSData = {
  profile: userProfile,
  platforms: [],
  topPosts: [],
  audience: {
    ageGroups: [],
    gender: [],
    countries: [],
  },
  growthSeries: emptyGrowthSeries,
  aiInsights: [],
  engagementBreakdown: [],
  heatmap: {
    days: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
    slots: ["06", "09", "12", "15", "18", "20", "22", "00"],
    values: Array.from({ length: 7 }, () => Array.from({ length: 8 }, () => 0)),
  },
  source: "supabase",
};

export async function loadCreatorOSData(userId?: string): Promise<CreatorOSData> {
  if (!isSupabaseConfigured || !supabase) return fallbackCreatorOSData;

  const profileQuery = supabase.from("creator_profiles").select("*");
  const accountsQuery = supabase.from("social_accounts").select("*").order("platform");
  const postsQuery = supabase.from("social_posts").select("*").order("views", { ascending: false }).limit(6);
  const insightsQuery = supabase.from("ai_insights").select("*").eq("active", true).limit(5);
  const snapshotsQuery = supabase.from("follower_snapshots").select("*").order("snapshot_date");
  const audienceQuery = supabase.from("audience_snapshots").select("*").order("snapshot_date", { ascending: false }).limit(1);

  const [{ data: profile }, { data: accounts }, { data: posts }, { data: insightRows }, { data: snapshots }, { data: audienceRows }] =
    await Promise.all([
      (userId ? profileQuery.eq("id", userId) : profileQuery).limit(1).maybeSingle(),
      userId ? accountsQuery.eq("user_id", userId) : accountsQuery,
      userId ? postsQuery.eq("user_id", userId) : postsQuery,
      userId ? insightsQuery.eq("user_id", userId) : insightsQuery,
      userId ? snapshotsQuery.eq("user_id", userId) : snapshotsQuery,
      userId ? audienceQuery.eq("user_id", userId) : audienceQuery,
    ]);

  if (!profile || !accounts) return fallbackCreatorOSData;

  const normalizedPosts: Post[] = posts?.length
    ? posts.map((post) => ({
        id: post.id,
        title: post.title,
        platform: post.platform as PlatformStatus["name"],
        views: post.views,
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        saves: post.saves,
        date: post.published_at.slice(0, 10),
        format: post.format ?? "Post",
      }))
    : fallbackCreatorOSData.topPosts;

  return {
    profile: {
      name: profile.full_name,
      avatar: profile.avatar_url ?? userProfile.avatar,
      role: profile.role ?? userProfile.role,
    },
    platforms: accounts.map((account) => ({
      name: account.platform as PlatformStatus["name"],
      connected: account.connected,
      color: platformColor(account.platform),
      handle: account.handle,
      followers: account.followers,
      change: account.change_percent,
    })),
    topPosts: normalizedPosts,
    audience: normalizeAudience(audienceRows?.[0]),
    growthSeries: buildGrowthSeries(accounts, snapshots ?? []),
    aiInsights:
      insightRows?.length
        ? insightRows.map((item) => ({
            title: item.title,
            description: item.description,
            impact: item.impact,
          }))
        : fallbackCreatorOSData.aiInsights,
    engagementBreakdown: normalizeEngagement(normalizedPosts),
    heatmap: normalizeHeatmap(audienceRows?.[0]?.best_times),
    source: "supabase",
  };
}

function platformColor(platform: string) {
  if (platform === "Instagram") return "#ff5a66";
  if (platform === "YouTube") return "#ff0033";
  if (platform === "X") return "#0f172a";
  return "#111827";
}

function normalizeAudience(row?: { age_groups?: unknown; gender?: unknown; countries?: unknown } | null): AudienceShape {
  if (!row) return fallbackCreatorOSData.audience;

  return {
    ageGroups: Array.isArray(row.age_groups) ? (row.age_groups as AudienceShape["ageGroups"]) : fallbackCreatorOSData.audience.ageGroups,
    gender: Array.isArray(row.gender) ? (row.gender as AudienceShape["gender"]) : fallbackCreatorOSData.audience.gender,
    countries: Array.isArray(row.countries) ? normalizeCountryValues(row.countries as Array<{ label: string; value: number }>) : fallbackCreatorOSData.audience.countries,
  };
}

function normalizeCountryValues(countries: Array<{ label: string; value: number }>) {
  const total = countries.reduce((sum, country) => sum + Number(country.value || 0), 0);
  if (!total) return fallbackCreatorOSData.audience.countries;

  return countries.map((country) => ({
    label: country.label,
    value: Math.round((Number(country.value || 0) / total) * 100),
  }));
}

function normalizeEngagement(posts: Post[]): EngagementShape {
  const totals = posts.reduce(
    (acc, post) => {
      acc.likes += post.likes;
      acc.shares += post.shares;
      acc.comments += post.comments;
      acc.saves += post.saves;
      return acc;
    },
    { likes: 0, shares: 0, comments: 0, saves: 0 }
  );

  const sum = totals.likes + totals.shares + totals.comments + totals.saves;
  if (!sum) return fallbackCreatorOSData.engagementBreakdown;

  return [
    { name: "Me gusta", value: Math.round((totals.likes / sum) * 100), color: "#ff5a66" },
    { name: "Compartidos", value: Math.round((totals.shares / sum) * 100), color: "#2388ff" },
    { name: "Comentarios", value: Math.round((totals.comments / sum) * 100), color: "#f5a524" },
    { name: "Guardados", value: Math.round((totals.saves / sum) * 100), color: "#2bc48a" },
  ];
}

function normalizeHeatmap(bestTimes?: unknown): HeatmapShape {
  if (!bestTimes || typeof bestTimes !== "object") return fallbackCreatorOSData.heatmap;
  const value = bestTimes as Partial<HeatmapShape>;

  if (!Array.isArray(value.days) || !Array.isArray(value.slots) || !Array.isArray(value.values)) {
    return fallbackCreatorOSData.heatmap;
  }

  return {
    days: value.days as string[],
    slots: value.slots as string[],
    values: value.values as number[][],
  };
}

function buildGrowthSeries(
  accounts: Array<{ platform: string; followers: number }>,
  snapshots: Array<{ platform: string; snapshot_date: string; followers: number }>
): Record<Period, GrowthPoint[]> {
  if (!snapshots.length) return fallbackCreatorOSData.growthSeries;

  const byPlatform = new Map<string, Array<{ date: string; delta: number }>>();
  for (const snapshot of snapshots) {
    const entries = byPlatform.get(snapshot.platform) ?? [];
    entries.push({ date: snapshot.snapshot_date, delta: Number(snapshot.followers ?? 0) });
    byPlatform.set(snapshot.platform, entries);
  }

  for (const entries of byPlatform.values()) {
    entries.sort((a, b) => a.date.localeCompare(b.date));
  }

  const currentFollowers = Object.fromEntries(accounts.map((account) => [account.platform, account.followers]));
  const reconstructed = new Map<string, Array<{ date: string; total: number }>>();

  for (const [platform, entries] of byPlatform.entries()) {
    let running = Number(currentFollowers[platform] ?? 0);
    const reversed = [...entries].reverse().map((entry) => {
      const point = { date: entry.date, total: running };
      running -= entry.delta;
      return point;
    });
    reconstructed.set(platform, reversed.reverse());
  }

  return {
    "7d": sliceSeries(reconstructed, 7, fallbackCreatorOSData.growthSeries["7d"]),
    "30d": sliceSeries(reconstructed, 30, fallbackCreatorOSData.growthSeries["30d"]),
    "90d": sliceSeries(reconstructed, 90, fallbackCreatorOSData.growthSeries["90d"]),
    "1y": monthlySeries(reconstructed),
  };
}

function sliceSeries(
  reconstructed: Map<string, Array<{ date: string; total: number }>>,
  days: number,
  fallback: GrowthPoint[]
): GrowthPoint[] {
  const base = reconstructed.get("YouTube") ?? reconstructed.get("TikTok") ?? reconstructed.values().next().value ?? [];
  const points = base.slice(-days);
  if (!points.length) return fallback;

  return points.map((point, index) => ({
    date: `D-${points.length - index}`,
    TikTok: findPoint(reconstructed.get("TikTok"), point.date),
    Instagram: findPoint(reconstructed.get("Instagram"), point.date),
    YouTube: findPoint(reconstructed.get("YouTube"), point.date),
    X: findPoint(reconstructed.get("X"), point.date),
  }));
}

function monthlySeries(reconstructed: Map<string, Array<{ date: string; total: number }>>): GrowthPoint[] {
  const base = reconstructed.get("YouTube") ?? reconstructed.get("TikTok") ?? reconstructed.values().next().value ?? [];
  if (!base.length) return fallbackCreatorOSData.growthSeries["1y"];

  const monthMap = new Map<string, GrowthPoint>();
  for (const point of base) {
    const key = point.date.slice(0, 7);
    monthMap.set(key, {
      date: key,
      TikTok: findPoint(reconstructed.get("TikTok"), point.date),
      Instagram: findPoint(reconstructed.get("Instagram"), point.date),
      YouTube: findPoint(reconstructed.get("YouTube"), point.date),
      X: findPoint(reconstructed.get("X"), point.date),
    });
  }

  return Array.from(monthMap.values())
    .slice(-12)
    .map((item, index) => ({ ...item, date: `Mes ${index + 1}` }));
}

function findPoint(points: Array<{ date: string; total: number }> | undefined, date: string) {
  const match = points?.find((item) => item.date === date);
  return match?.total ?? 0;
}
