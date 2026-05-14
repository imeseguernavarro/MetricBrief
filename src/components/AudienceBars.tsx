type BarItem = { label: string; value: number };

export function AudienceBars({ title, items, accent = "#2388ff" }: { title: string; items: BarItem[]; accent?: string }) {
  return (
    <section className="surface-panel rounded-[28px] p-5">
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-5 space-y-4">
        {!items.length && <div className="text-sm text-slate-500">Aun no hay datos disponibles para esta seccion.</div>}
        {items.map((item) => (
          <div key={item.label} className="grid grid-cols-[90px_1fr_44px] items-center gap-3 text-sm">
            <span className="font-medium text-slate-600">{item.label}</span>
            <div className="h-3.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${item.value}%`, background: accent }}
              />
            </div>
            <span className="text-right font-bold">{item.value}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
