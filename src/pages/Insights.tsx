import { ArrowUpRight, Sparkles } from "lucide-react";
import type { CreatorOSData } from "../integrations/supabase/creatoros";

const impactClass: Record<string, string> = {
  Alto: "bg-coral/10 text-red-700",
  Medio: "bg-amber/10 text-amber-700",
};

export function Insights({ data }: { data: CreatorOSData }) {
  return (
    <div className="space-y-5">
      <section className="surface-panel rounded-[28px] p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky/10 text-sky">
            <Sparkles size={20} />
          </span>
          <div>
            <span className="eyebrow">AI guidance</span>
            <h2 className="mt-2 text-2xl font-black">Recomendaciones de IA</h2>
            <p className="text-sm text-slate-500">Insights estaticos generados desde datos de prueba locales.</p>
          </div>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {!data.aiInsights.length && (
          <div className="surface-panel rounded-[28px] p-6 text-sm text-slate-500">
            Aun no hay recomendaciones reales disponibles. Conecta y sincroniza una plataforma para generarlas.
          </div>
        )}
        {data.aiInsights.map((insight, index) => (
          <article key={insight.title} className="surface-panel rounded-[28px] p-5 transition hover:-translate-y-0.5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <span className={`rounded px-2.5 py-1 text-xs font-bold ${impactClass[insight.impact] ?? "bg-slate-100 text-slate-600"}`}>
                Impacto {insight.impact}
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                0{index + 1}
                <ArrowUpRight size={18} className="text-slate-400" />
              </span>
            </div>
            <h3 className="text-lg font-black">{insight.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{insight.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
