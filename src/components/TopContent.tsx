import { Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import type { Post } from "../data/mock";
import { compact, platformClass } from "../utils";
import { Skeleton } from "./Skeleton";

export function TopContent({ posts, loading, onSelect }: { posts: Post[]; loading: boolean; onSelect: (post: Post) => void }) {
  return (
    <section className="surface-panel rounded-[28px] p-5">
      <div className="mb-4">
        <span className="eyebrow">Top content</span>
        <h2 className="mt-3 text-xl font-black">Piezas que estan tirando del crecimiento</h2>
        <p className="text-sm text-slate-500">Top 4 por rendimiento compuesto y capacidad de redistribucion.</p>
      </div>
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-20 w-full" />)
          : posts.slice(0, 4).map((post, index) => (
              <button
                key={post.id}
                onClick={() => onSelect(post)}
                className="w-full rounded-[22px] border border-line bg-white/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-crisp"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">#{index + 1}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${platformClass[post.platform]}`}>{post.platform}</span>
                    </div>
                    <p className="line-clamp-2 text-base font-bold">{post.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{post.date} - {post.format}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 sm:grid-cols-4">
                  <span className="flex items-center gap-1"><Eye size={14} /> {compact(post.views)}</span>
                  <span className="flex items-center gap-1"><Heart size={14} /> {compact(post.likes)}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={14} /> {compact(post.comments)}</span>
                  <span className="flex items-center gap-1"><Share2 size={14} /> {compact(post.shares)}</span>
                </div>
              </button>
            ))}
      </div>
    </section>
  );
}
