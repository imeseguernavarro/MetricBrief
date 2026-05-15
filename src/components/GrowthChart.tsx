import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { GrowthPoint, Platform } from "../data/mock";
import { compact } from "../utils";

const colors: Record<Platform, string> = { TikTok: "#101217", Instagram: "#ff5a66", YouTube: "#ff0033", X: "#0f172a" };
const allPlatforms: Platform[] = ["TikTok", "Instagram", "YouTube", "X"];

export function GrowthChart({ data }: { data: GrowthPoint[] }) {
  const [visible, setVisible] = useState<Record<Platform, boolean>>({
    TikTok: true,
    Instagram: true,
    YouTube: true,
    X: true,
  });

  return (
    <section className="surface-panel rounded-[28px] p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="eyebrow">Crecimiento</span>
          <h2 className="mt-3 text-xl font-black text-slate-900">Seguidores por plataforma</h2>
          <p className="text-sm text-slate-500">Compara velocidad de crecimiento y deja visibles solo las lineas clave.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {allPlatforms.map((platform) => (
            <button
              key={platform}
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                visible[platform] ? "border-slate-300 bg-white text-ink shadow-sm" : "border-line bg-slate-100 text-slate-400"
              }`}
              onClick={() => setVisible((state) => ({ ...state, [platform]: !state[platform] }))}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[platform] }} />
              {platform}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80 rounded-[22px] bg-[linear-gradient(180deg,rgba(255,255,255,0.65),rgba(244,247,252,0.9))] p-2">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
              <CartesianGrid stroke="#e6ebf4" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tickFormatter={compact} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip formatter={(value) => compact(Number(value))} contentStyle={{ borderRadius: 16, borderColor: "#e4e8f0" }} />
              {allPlatforms.map(
                (platform) =>
                  visible[platform] && (
                    <Line
                      key={platform}
                      type="monotone"
                      dataKey={platform}
                      stroke={colors[platform]}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  )
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Conecta y sincroniza al menos una plataforma para ver la evolucion de seguidores.
          </div>
        )}
      </div>
    </section>
  );
}
