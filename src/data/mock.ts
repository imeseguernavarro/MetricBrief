export type Platform = "TikTok" | "Instagram" | "YouTube" | "X";
export type Period = "7d" | "30d" | "90d" | "1y";

export type PlatformStatus = {
  name: Platform;
  connected: boolean;
  color: string;
  handle: string;
  followers: number;
  change: number;
};

export type GrowthPoint = {
  date: string;
  TikTok: number;
  Instagram: number;
  YouTube: number;
  X: number;
};

export type Post = {
  id: string;
  title: string;
  platform: Platform;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  date: string;
  format: string;
};

export const userProfile = {
  name: "Mara Vega",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
  role: "Creator strategist",
};

export const initialPlatforms: PlatformStatus[] = [
  { name: "TikTok", connected: true, color: "#111827", handle: "@maravega", followers: 486200, change: 12.8 },
  { name: "Instagram", connected: true, color: "#ff5a66", handle: "@mara.studio", followers: 214900, change: 7.4 },
  { name: "YouTube", connected: true, color: "#ff0033", handle: "@MaraVega", followers: 98200, change: 4.1 },
  { name: "X", connected: false, color: "#0f172a", handle: "@metricbrief", followers: 0, change: 0 },
];

const periods: Record<Period, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };

export const growthSeries: Record<Period, GrowthPoint[]> = Object.fromEntries(
  (Object.keys(periods) as Period[]).map((period) => {
    const days = periods[period];
    const points = Array.from({ length: period === "1y" ? 12 : days }, (_, index) => {
      const factor = index / (period === "1y" ? 11 : Math.max(days - 1, 1));
      const date = period === "1y" ? `Mes ${index + 1}` : `D-${days - index}`;
      return {
        date,
        TikTok: Math.round(414000 + factor * 72200 + Math.sin(index * 0.8) * 4200),
        Instagram: Math.round(190000 + factor * 24900 + Math.cos(index * 0.6) * 2600),
        YouTube: Math.round(88300 + factor * 9900 + Math.sin(index * 0.45) * 1400),
        X: Math.round(12000 + factor * 3100 + Math.cos(index * 0.4) * 520),
      };
    });
    return [period, points];
  })
) as Record<Period, GrowthPoint[]>;

export const topPosts: Post[] = [
  {
    id: "p1",
    title: "Rutina de productividad para grabar 12 clips en una tarde",
    platform: "TikTok",
    views: 1820000,
    likes: 213400,
    comments: 8410,
    shares: 32000,
    saves: 41100,
    date: "2026-04-28",
    format: "Short vertical",
  },
  {
    id: "p2",
    title: "Antes y despues: setup compacto para creadores",
    platform: "Instagram",
    views: 934000,
    likes: 96400,
    comments: 5120,
    shares: 14400,
    saves: 28700,
    date: "2026-04-21",
    format: "Reel",
  },
  {
    id: "p3",
    title: "Como planifico 30 ideas sin quemarme",
    platform: "YouTube",
    views: 621000,
    likes: 58100,
    comments: 4300,
    shares: 7600,
    saves: 18900,
    date: "2026-04-16",
    format: "Video largo",
  },
  {
    id: "p4",
    title: "3 ganchos que duplicaron mi retencion",
    platform: "TikTok",
    views: 1180000,
    likes: 141300,
    comments: 6920,
    shares: 22600,
    saves: 20400,
    date: "2026-04-09",
    format: "Short vertical",
  },
  {
    id: "p5",
    title: "Checklist de patrocinio para marcas pequenas",
    platform: "Instagram",
    views: 512000,
    likes: 42200,
    comments: 2310,
    shares: 8900,
    saves: 25100,
    date: "2026-03-30",
    format: "Carrusel",
  },
  {
    id: "p6",
    title: "Analisis real de mis ingresos de abril",
    platform: "YouTube",
    views: 448000,
    likes: 39100,
    comments: 2980,
    shares: 4100,
    saves: 9600,
    date: "2026-04-30",
    format: "Video largo",
  },
];

export const engagementBreakdown = [
  { name: "Me gusta", value: 58, color: "#ff5a66" },
  { name: "Compartidos", value: 18, color: "#2388ff" },
  { name: "Comentarios", value: 9, color: "#f5a524" },
  { name: "Guardados", value: 15, color: "#2bc48a" },
];

export const audience = {
  ageGroups: [
    { label: "13-17", value: 7 },
    { label: "18-24", value: 34 },
    { label: "25-34", value: 38 },
    { label: "35-44", value: 15 },
    { label: "45+", value: 6 },
  ],
  gender: [
    { label: "Mujeres", value: 57 },
    { label: "Hombres", value: 39 },
    { label: "No binario", value: 4 },
  ],
  countries: [
    { label: "Espana", value: 29 },
    { label: "Mexico", value: 21 },
    { label: "Estados Unidos", value: 16 },
    { label: "Colombia", value: 12 },
    { label: "Argentina", value: 9 },
  ],
};

export const heatmap = {
  days: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
  slots: ["06", "09", "12", "15", "18", "20", "22", "00"],
  values: [
    [28, 34, 42, 55, 71, 84, 65, 31],
    [31, 39, 47, 61, 78, 91, 73, 36],
    [26, 33, 52, 68, 82, 95, 79, 41],
    [30, 37, 49, 63, 76, 88, 82, 43],
    [35, 45, 58, 70, 87, 96, 90, 54],
    [42, 56, 69, 74, 80, 92, 98, 63],
    [39, 51, 63, 72, 77, 89, 94, 59],
  ],
};

export const aiInsights = [
  {
    title: "Publica tus tutoriales a las 20:00",
    description: "El mapa de calor muestra el pico mas consistente entre martes y viernes en esa franja.",
    impact: "Alto",
  },
  {
    title: "Convierte carruseles guardables en shorts",
    description: "Los posts con mas guardados estan generando ideas reutilizables para TikTok y YouTube Shorts.",
    impact: "Medio",
  },
  {
    title: "Refuerza ganchos de los primeros 3 segundos",
    description: "Los videos con promesa concreta al inicio concentran mas compartidos y comentarios.",
    impact: "Alto",
  },
  {
    title: "Segmenta ofertas para Mexico y Espana",
    description: "Estos dos paises concentran la mitad de la audiencia activa y responden mejor a contenido practico.",
    impact: "Medio",
  },
];
