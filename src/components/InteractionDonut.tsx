import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { engagementBreakdown as fallbackBreakdown } from "../data/mock";

export function InteractionDonut({ data = fallbackBreakdown }: { data?: typeof fallbackBreakdown }) {
  return (
    <section className="surface-panel rounded-[28px] p-5">
      <span className="eyebrow">Engagement</span>
      <h2 className="mt-3 text-xl font-black">Interaccion por accion</h2>
      <p className="text-sm text-slate-500">Desglose del periodo</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={3}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {data.map((item) => (
          <div key={item.name} className="rounded-2xl bg-white/70 px-3 py-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
              <span className="text-slate-600">{item.name}</span>
              <span className="font-bold">{item.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
