import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { aiInsights as fallbackInsights } from "../data/mock";

export function InsightBanner({ insights = fallbackInsights }: { insights?: typeof fallbackInsights }) {
  const [index, setIndex] = useState(0);
  const safeInsights = insights.length ? insights : fallbackInsights;
  const insight = safeInsights[index % safeInsights.length];

  useEffect(() => {
    const timeout = window.setInterval(() => setIndex((current) => (current + 1) % safeInsights.length), 4200);
    return () => window.clearInterval(timeout);
  }, [safeInsights.length]);

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#ffd7ba] bg-[linear-gradient(135deg,#fff7ef_0%,#fff2df_45%,#f4f7ff_100%)] p-5 text-blue-950 shadow-crisp">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-sky shadow-sm">
          <Sparkles size={18} />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">Sugerencia IA</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-blue-700">Impacto {insight.impact}</span>
          </div>
          <h2 className="mt-3 text-xl font-black text-slate-900">{insight.title}</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">{insight.description}</p>
        </div>
      </div>
    </section>
  );
}
