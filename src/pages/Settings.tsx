import { Bell, ChevronRight, Download, KeyRound, Link2, LockKeyhole, Shield, Unlink, User2 } from "lucide-react";
import { useState } from "react";
import { userProfile as defaultUserProfile, type PlatformStatus } from "../data/mock";
import { compact } from "../utils";

type SettingsTab = "platforms" | "profile" | "notifications" | "security";

type SettingsSection = {
  id: SettingsTab;
  label: string;
  description: string;
  icon: typeof Link2;
};

const sections: SettingsSection[] = [
  {
    id: "platforms",
    label: "Plataformas conectadas",
    description: "Gestiona canales y nuevas integraciones",
    icon: Link2,
  },
  {
    id: "profile",
    label: "Perfil",
    description: "Personaliza la información del usuario",
    icon: User2,
  },
  {
    id: "notifications",
    label: "Notificaciones",
    description: "Controla alertas e informes relevantes",
    icon: Bell,
  },
  {
    id: "security",
    label: "Seguridad",
    description: "Privacidad, acceso y exportación",
    icon: Shield,
  },
];

const availablePlatforms = [
  { name: "Threads", description: "Extension editorial para marcas personales" },
  { name: "LinkedIn", description: "Contenido profesional y crecimiento B2B" },
  { name: "Twitch", description: "Streaming, clips y retención" },
];

export function Settings({
  platforms,
  onPlatformAction,
  profile,
}: {
  platforms: PlatformStatus[];
  onPlatformAction: (platform: PlatformStatus) => Promise<void> | void;
  profile: typeof defaultUserProfile;
}) {
  const [tab, setTab] = useState<SettingsTab>("platforms");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [notificationState, setNotificationState] = useState({
    aiInsights: true,
    weeklySummary: true,
    growthAlerts: true,
    viralContent: false,
  });

  return (
    <div className="space-y-5">
      <section className="surface-panel rounded-[24px] px-5 py-5">
        <span className="eyebrow">Configuracion</span>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Ajustes de la cuenta</h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-500">
          Organiza tus plataformas, el perfil del usuario, las notificaciones y los controles de seguridad desde un segundo menú interno.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-[300px_1fr]">
        <aside className="surface-panel rounded-[24px] p-4">
          <p className="px-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Ajustes</p>
          <nav className="mt-4 space-y-1.5">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = tab === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setTab(section.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                    isActive ? "bg-slate-900 text-white shadow-[0_12px_28px_rgba(23,26,43,0.14)]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                      isActive ? "bg-white/10 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">{section.label}</span>
                    <span className={`block text-xs ${isActive ? "text-white/60" : "text-slate-400"}`}>{section.description}</span>
                  </span>
                  <ChevronRight size={16} className={isActive ? "text-white/70" : "text-slate-300"} />
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="surface-panel rounded-[24px] p-5">
          {tab === "platforms" && (
            <div>
              <SectionHeader
                title="Plataformas conectadas"
                description="Consulta todas las plataformas activas y conecta nuevas fuentes para ampliar el analisis."
              />
              <div className="space-y-3">
                {platforms.map((platform) => (
                  <article key={platform.name} className="rounded-[22px] border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-sm font-black text-slate-700">
                          {platform.name.slice(0, 1)}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900">{platform.name}</h3>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                platform.connected ? "bg-fuchsia-50 text-fuchsia-700" : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {platform.connected ? "Conectada" : "Desconectada"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">{platform.handle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Seguidores</p>
                          <p className="text-sm font-bold text-slate-900">{compact(platform.followers)}</p>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              setConnectionError(null);
                              await onPlatformAction(platform);
                            } catch (error) {
                              setConnectionError(error instanceof Error ? error.message : "No se pudo completar la accion.");
                            }
                          }}
                          className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                            platform.connected ? "bg-slate-900 text-white hover:bg-slate-800" : "accent-pill hover:opacity-90"
                          }`}
                        >
                          {platform.connected ? (
                            <span className="flex items-center gap-2"><Unlink size={14} /> Desconectar</span>
                          ) : (
                            <span className="flex items-center gap-2"><Link2 size={14} /> Conectar</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {connectionError && <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{connectionError}</div>}

              <div className="mt-6 border-t border-slate-200 pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Otras plataformas</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {availablePlatforms.map((platform) => (
                    <article key={platform.name} className="rounded-[22px] border border-slate-200 bg-[linear-gradient(180deg,#fff_0%,#faf8ff_100%)] p-4">
                      <div className="accent-pill h-10 w-10 rounded-2xl text-sm font-black shadow-[0_10px_24px_rgba(159,57,255,0.24)]">
                        +
                      </div>
                      <h3 className="mt-4 font-bold text-slate-900">{platform.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{platform.description}</p>
                      <button className="accent-pill mt-4 rounded-xl px-3 py-2 text-xs font-bold">Conectar</button>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "profile" && (
            <div>
              <SectionHeader
                title="Perfil"
                description="Personaliza el perfil del usuario y actualiza los datos visibles en la cuenta."
              />
              <div className="rounded-[22px] border border-slate-200 bg-[linear-gradient(180deg,#fff_0%,#faf8ff_100%)] p-5">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <img src={profile.avatar} alt={profile.name} className="h-16 w-16 rounded-2xl object-cover" />
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{profile.name}</h3>
                      <p className="text-sm text-slate-500">{profile.role}</p>
                      <span className="mt-2 inline-flex rounded-full bg-fuchsia-50 px-2.5 py-1 text-[11px] font-bold text-fuchsia-700">
                        Activa
                      </span>
                    </div>
                  </div>
                  <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                    Cambiar foto
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field label="Nombre completo" value={profile.name} />
                  <Field label="Correo" value="hello@insighthub.app" />
                  <Field label="Rol" value={profile.role} />
                  <Field label="Marca personal" value="@insighthubapp" />
                </div>

                <button className="accent-pill mt-5 rounded-xl px-4 py-2 text-sm font-bold">Guardar cambios</button>
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div>
              <SectionHeader
                title="Notificaciones"
                description="Activa o desactiva notificaciones pertinentes para el seguimiento diario del creador."
              />
              <div className="space-y-3">
                <ToggleRow
                  title="Nuevos insights de IA"
                  description="Recibe alertas cuando haya nuevas recomendaciones"
                  enabled={notificationState.aiInsights}
                  onToggle={() => setNotificationState((state) => ({ ...state, aiInsights: !state.aiInsights }))}
                />
                <ToggleRow
                  title="Resumen semanal"
                  description="Informe semanal de tu rendimiento"
                  enabled={notificationState.weeklySummary}
                  onToggle={() => setNotificationState((state) => ({ ...state, weeklySummary: !state.weeklySummary }))}
                />
                <ToggleRow
                  title="Alertas de crecimiento"
                  description="Notificaciones cuando alcances hitos importantes"
                  enabled={notificationState.growthAlerts}
                  onToggle={() => setNotificationState((state) => ({ ...state, growthAlerts: !state.growthAlerts }))}
                />
                <ToggleRow
                  title="Contenido viral"
                  description="Alerta cuando una publicacion tenga rendimiento excepcional"
                  enabled={notificationState.viralContent}
                  onToggle={() => setNotificationState((state) => ({ ...state, viralContent: !state.viralContent }))}
                />
              </div>
            </div>
          )}

          {tab === "security" && (
            <div>
              <SectionHeader
                title="Privacidad y seguridad"
                description="Controla el acceso a tus datos, las credenciales y la exportacion de informacion."
              />
              <div className="space-y-3">
                <SecurityRow
                  icon={KeyRound}
                  title="Cambiar contrasena"
                  description="Ultima actualizacion hace 3 meses"
                  actionLabel="Actualizar"
                />
                <SecurityRow
                  icon={LockKeyhole}
                  title="Autenticacion de dos factores"
                  description="Agrega una capa extra de seguridad"
                  actionLabel="Activar"
                />
                <SecurityRow
                  icon={Download}
                  title="Exportar datos"
                  description="Descarga una copia de tu informacion"
                  actionLabel="Exportar"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5 border-b border-slate-200 pb-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Configuracion</p>
      <h3 className="mt-2 text-2xl font-black text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800">{value}</div>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  enabled = false,
  onToggle,
}: {
  title: string;
  description: string;
  enabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-white px-5 py-4 text-slate-900">
      <div className="pr-4">
        <p className="font-bold">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition ${enabled ? "bg-fuchsia-500" : "bg-slate-200"}`}
      >
        <span className={`h-5 w-5 rounded-full bg-white transition ${enabled ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function SecurityRow({
  icon: Icon,
  title,
  description,
  actionLabel,
}: {
  icon: typeof KeyRound;
  title: string;
  description: string;
  actionLabel: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-white px-5 py-4 text-slate-900">
      <div className="flex items-center gap-4">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">
          <Icon size={18} />
        </span>
        <div>
          <p className="font-bold">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
        {actionLabel}
      </button>
    </div>
  );
}
