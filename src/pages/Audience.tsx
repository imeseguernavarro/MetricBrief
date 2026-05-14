import { AudienceBars } from "../components/AudienceBars";
import { HeatmapGrid } from "../components/HeatmapGrid";
import type { CreatorOSData } from "../integrations/supabase/creatoros";

export function Audience({ data }: { data: CreatorOSData }) {
  return (
    <div className="space-y-5">
      <section className="surface-panel rounded-[28px] p-5">
        <span className="eyebrow">Audience intelligence</span>
        <h2 className="mt-3 text-2xl font-black">Quien esta respondiendo mejor al contenido</h2>
        <p className="text-sm text-slate-500">
          Vista resumida de grupos de edad, genero, paises principales y momentos de mayor respuesta.
        </p>
      </section>
      <div className="grid gap-5 xl:grid-cols-3">
        <AudienceBars title="Edad" items={data.audience.ageGroups} accent="#2388ff" />
        <AudienceBars title="Genero" items={data.audience.gender} accent="#ff5a66" />
        <AudienceBars title="Paises principales" items={data.audience.countries} accent="#2bc48a" />
      </div>
      <HeatmapGrid data={data.heatmap} />
    </div>
  );
}
