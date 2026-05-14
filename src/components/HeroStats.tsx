import { TrendingUp, Users } from "lucide-react";
import type { PlatformStatus } from "../data/mock";
import { compact, percent } from "../utils";
import { Skeleton } from "./Skeleton";

export function HeroStats({ platforms, loading }: { platforms: PlatformStatus[]; loading: boolean }) {
  const connectedPlatforms = platforms.filter((item) => item.connected);
  const total = connectedPlatforms.reduce((sum, item) => sum + item.followers, 0);
  const averageChange = connectedPlatforms.length ? connectedPlatforms.reduce((sum, item) => sum + item.change, 0) / connectedPlatforms.length : 0;
  const stats = [
    { label: "Seguidores totales", value: total, change: averageChange, color: "#101217" },
    ...platforms.map((item) => ({ label: item.name, value: item.followers, change: item.change, color: item.color })),
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <section key={stat.label} className="surface-panel rounded-[24px] p-5">
          {loading ? (
            <>
              <Skeleton className="mb-4 h-4 w-28" />
              <Skeleton className="h-8 w-36" />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100" style={{ color: stat.color }}>
                  <Users size={17} />
                </span>
              </div>
              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-black tracking-tight">{compact(stat.value)}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">Actualizado hoy</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-mint/10 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                  <TrendingUp size={14} />
                  {percent(stat.change)}
                </span>
              </div>
            </>
          )}
        </section>
      ))}
    </div>
  );
}
