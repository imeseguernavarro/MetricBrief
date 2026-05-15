import { useState } from "react";
import { AudienceBars } from "../components/AudienceBars";
import { GrowthChart } from "../components/GrowthChart";
import { HeatmapGrid } from "../components/HeatmapGrid";
import { HeroStats } from "../components/HeroStats";
import { InsightBanner } from "../components/InsightBanner";
import { InteractionDonut } from "../components/InteractionDonut";
import { Modal } from "../components/Modal";
import { TopContent } from "../components/TopContent";
import { type CreatorOSData } from "../integrations/supabase/creatoros";
import { type Period, type PlatformStatus, type Post } from "../data/mock";
import { useInitialLoading } from "../hooks/useInitialLoading";
import { compact, platformClass } from "../utils";

export function Dashboard({ period, platforms, data }: { period: Period; platforms: PlatformStatus[]; data: CreatorOSData }) {
  const loading = useInitialLoading();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const connectedCount = platforms.filter((platform) => platform.connected).length;
  const totalFollowers = platforms.filter((platform) => platform.connected).reduce((sum, platform) => sum + platform.followers, 0);
  const realModeEmpty = !connectedCount;

  return (
    <div className="space-y-5">
      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] bg-[linear-gradient(90deg,#a221ff_0%,#ff1493_100%)] p-6 text-white shadow-[0_24px_60px_rgba(186,37,255,0.28)]">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
            Performance cockpit
          </span>
          <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight">
            {realModeEmpty
              ? "Conecta tu primera plataforma para activar el panel real."
              : "Una sola lectura para decidir que publicar, cuando y en que plataforma empujar."}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
            {realModeEmpty
              ? "Cuando completes una conexión y sincronices, verás crecimiento, contenido, audiencia y recomendaciones reales desde una sola vista."
              : "El panel cruza crecimiento, timing, contenido y demografia para reducir ruido y hacer visibles las decisiones del dia."}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/14 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.14em] text-white/60">Seguidores activos</p>
              <p className="mt-2 text-2xl font-black">{compact(totalFollowers)}</p>
            </div>
            <div className="rounded-2xl bg-white/14 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.14em] text-white/60">Plataformas online</p>
              <p className="mt-2 text-2xl font-black">{connectedCount}/3</p>
            </div>
            <div className="rounded-2xl bg-white/14 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.14em] text-white/60">Ventana top</p>
              <p className="mt-2 text-2xl font-black">20:00</p>
            </div>
          </div>
        </div>
        <InsightBanner insights={data.aiInsights} />
      </section>

      <HeroStats platforms={platforms} loading={loading} />
      <GrowthChart data={data.growthSeries[period]} />
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <TopContent posts={data.topPosts} loading={loading} onSelect={setSelectedPost} />
        <InteractionDonut data={data.engagementBreakdown} />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <AudienceBars title="Edad de audiencia" items={data.audience.ageGroups} accent="#2388ff" />
        <AudienceBars title="Principales paises" items={data.audience.countries} accent="#2bc48a" />
      </div>
      <HeatmapGrid data={data.heatmap} />
      <Modal title="Detalle de publicacion" open={Boolean(selectedPost)} onClose={() => setSelectedPost(null)}>
        {selectedPost && (
          <div className="space-y-5">
            <div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${platformClass[selectedPost.platform]}`}>
                {selectedPost.platform}
              </span>
              <h3 className="mt-3 text-xl font-bold">{selectedPost.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{selectedPost.date} - {selectedPost.format}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Visualizaciones", selectedPost.views],
                ["Me gusta", selectedPost.likes],
                ["Comentarios", selectedPost.comments],
                ["Compartidos", selectedPost.shares],
                ["Guardados", selectedPost.saves],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-cloud p-3">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="text-xl font-bold">{compact(value as number)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
