import { Brain, Clapperboard, LayoutDashboard, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { userProfile as defaultUserProfile, type PlatformStatus } from "../data/mock";

const nav = [
  { to: "/dashboard", label: "Dashboard", note: "Resumen ejecutivo", icon: LayoutDashboard },
  { to: "/content", label: "Contenido", note: "Top posts y filtros", icon: Clapperboard },
  { to: "/audience", label: "Audiencia", note: "Demografia y timing", icon: Users },
  { to: "/insights", label: "Insights", note: "Recomendaciones accionables", icon: Brain },
  { to: "/settings", label: "Ajustes", note: "Conexiones y canales", icon: Settings },
];

export function Sidebar({
  platforms,
  profile,
}: {
  platforms: PlatformStatus[];
  profile: typeof defaultUserProfile;
}) {
  const activeCount = platforms.filter((platform) => platform.connected).length;

  return (
    <aside className="sticky top-0 hidden h-screen w-[276px] shrink-0 overflow-hidden border-r border-slate-200/80 bg-white/92 lg:block">
      <div className="scrollbar-soft flex h-full flex-col overflow-y-auto px-5 py-6 text-slate-900">
        

        <div className="mb-6 rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#fff_0%,#faf8ff_100%)] p-4">
          <div className="flex items-center gap-3">
            <img src={profile.avatar} alt={profile.name} className="h-11 w-11 rounded-2xl object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-900">{profile.name}</p>
              <p className="truncate text-xs text-slate-500">{profile.role}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Canales activos</span>
            <span className="accent-pill px-2.5 py-1 text-[11px] font-bold">{activeCount}/3</span>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
        </div>

        <nav className="space-y-1.5">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-3 py-3 transition ${
                    isActive
                      ? "bg-[linear-gradient(90deg,#1a1730_0%,#291b45_100%)] text-white shadow-[0_14px_30px_rgba(112,51,214,0.18)]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl transition ${
                        isActive ? "bg-white/12 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-fuchsia-50 group-hover:text-fuchsia-600"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold">{item.label}</span>
                      <span className={`block text-xs ${isActive ? "text-white/60" : "text-slate-400"}`}>{item.note}</span>
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Connected platforms</p>
            <span className="text-[11px] font-bold text-fuchsia-600">{activeCount} live</span>
          </div>
          <div className="space-y-2">
            {platforms.map((platform) => (
              <div key={platform.name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm">
                <span className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: platform.connected ? platform.color : "#94a3b8" }}
                  />
                  <span>
                    <span className="block font-semibold text-slate-900">{platform.name}</span>
                    <span className="text-xs text-slate-400">{platform.handle}</span>
                  </span>
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    platform.connected ? "bg-fuchsia-50 text-fuchsia-700" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {platform.connected ? "Connected" : "Offline"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
