import { heatmap as fallbackHeatmap } from "../data/mock";

function color(value: number) {
  const opacity = 0.15 + (value / 100) * 0.85;
  return `rgba(43, 196, 138, ${opacity})`;
}

export function HeatmapGrid({ data = fallbackHeatmap }: { data?: typeof fallbackHeatmap }) {
  return (
    <section className="surface-panel rounded-[28px] p-5">
      <span className="eyebrow">Timing</span>
      <h2 className="mt-3 text-xl font-black">Mejores momentos para publicar</h2>
      <p className="text-sm text-slate-500">Puntuacion de interaccion por franja</p>
      <div className="mt-5 overflow-x-auto pb-1 scrollbar-soft">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[52px_repeat(8,minmax(48px,1fr))] gap-2 text-xs font-semibold text-slate-500">
            <span />
            {data.slots.map((slot) => <span key={slot} className="text-center">{slot}:00</span>)}
          </div>
          <div className="mt-2 space-y-2">
            {data.days.map((day, row) => (
              <div key={day} className="grid grid-cols-[52px_repeat(8,minmax(48px,1fr))] gap-2">
                <span className="flex items-center text-sm font-semibold text-slate-600">{day}</span>
                {data.values[row].map((value, col) => (
                  <div
                    key={`${day}-${col}`}
                    title={`${day} ${data.slots[col]}:00 - ${value}`}
                    className="grid aspect-[1.45] place-items-center rounded-xl text-xs font-bold text-ink transition hover:scale-105"
                    style={{ background: color(value) }}
                  >
                    {value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
