import { BellDot, RefreshCw, Search, Wifi } from "lucide-react";
import type { Period } from "../data/mock";

const periods: Period[] = ["7d", "30d", "90d", "1y"];

export function Topbar({
  period,
  onPeriodChange,
  onOpenConnect,
  onSync,
  syncing = false,
  connectedCount = 0,
}: {
  period: Period;
  onPeriodChange: (period: Period) => void;
  onOpenConnect: () => void;
  onSync: () => void;
  syncing?: boolean;
  connectedCount?: number;
}) {
  const syncLabel = syncing ? "Sincronizando" : connectedCount ? `${connectedCount} fuente${connectedCount > 1 ? "s" : ""} conectada${connectedCount > 1 ? "s" : ""}` : "Sin fuentes conectadas";
  const syncClass = connectedCount
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <header className="px-4 pt-4 lg:px-8 lg:pt-6">
      <div className="surface-panel flex flex-col gap-4 rounded-[24px] px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="eyebrow">Panel principal</span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Analisis unificado</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Seguimiento diario de crecimiento, contenido y audiencias desde una sola vista.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-2xl border border-line bg-white p-1.5">
            {periods.map((item) => (
              <button
                key={item}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  period === item ? "bg-[linear-gradient(90deg,#ff2fb2_0%,#9f39ff_100%)] text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-ink"
                }`}
                onClick={() => onPeriodChange(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-600 xl:flex">
            <Search size={16} />
            Buscar metrica o post
          </div>
          <div className={`flex items-center gap-2 rounded-2xl border px-3 py-3 text-sm font-medium ${syncClass}`}>
            <Wifi size={16} />
            {syncLabel}
          </div>
          <button className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-white text-slate-500 transition hover:text-ink">
            <BellDot size={17} />
          </button>
          <button
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={onSync}
          >
            <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Sincronizando" : "Sincronizar"}
          </button>
          <button
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            onClick={onOpenConnect}
          >
            <RefreshCw size={16} />
            Conectar
          </button>
        </div>
      </div>
    </header>
  );
}
