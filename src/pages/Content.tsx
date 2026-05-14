import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { Modal } from "../components/Modal";
import type { CreatorOSData } from "../integrations/supabase/creatoros";
import { type Platform, type Post } from "../data/mock";
import { compact, platformClass } from "../utils";

const filters: Array<"Todas" | Platform> = ["Todas", "TikTok", "Instagram", "YouTube"];

export function Content({ data }: { data: CreatorOSData }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todas");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const posts = useMemo(() => data.topPosts.filter((post) => filter === "Todas" || post.platform === filter), [filter, data.topPosts]);

  return (
    <div className="space-y-5">
      <section className="surface-panel rounded-[28px] p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="eyebrow">Content library</span>
            <h2 className="mt-3 text-2xl font-black">Publicaciones con mejor rendimiento</h2>
            <p className="text-sm text-slate-500">Filtra por plataforma y abre cualquier fila para ver metricas completas.</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={17} className="text-slate-500" />
            <div className="flex rounded-2xl border border-line bg-white p-1.5">
              {filters.map((item) => (
                <button
                  key={item}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    filter === item ? "bg-ink text-white" : "text-slate-500 hover:bg-slate-100"
                  }`}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="surface-panel overflow-hidden rounded-[28px]">
        {!posts.length && (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Todavia no hay publicaciones sincronizadas para esta vista.
          </div>
        )}
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="grid w-full gap-3 border-b border-line/80 px-5 py-4 text-left transition last:border-b-0 hover:bg-white/70 md:grid-cols-[1fr_120px_100px_100px_100px]"
          >
            <div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${platformClass[post.platform]}`}>{post.platform}</span>
              <p className="mt-2 text-base font-bold">{post.title}</p>
              <p className="text-sm text-slate-500">{post.date}</p>
            </div>
            <Metric label="Views" value={post.views} />
            <Metric label="Likes" value={post.likes} />
            <Metric label="Shares" value={post.shares} />
            <Metric label="Saves" value={post.saves} />
          </button>
        ))}
      </div>
      <Modal title="Metricas completas" open={Boolean(selectedPost)} onClose={() => setSelectedPost(null)}>
        {selectedPost && (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries({
              Visualizaciones: selectedPost.views,
              "Me gusta": selectedPost.likes,
              Comentarios: selectedPost.comments,
              Compartidos: selectedPost.shares,
              Guardados: selectedPost.saves,
            }).map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-cloud p-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold">{compact(value)}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
      <p className="font-bold">{compact(value)}</p>
    </div>
  );
}
