import { ArrowRight, Bell, Boxes, ChartNoAxesCombined, CheckCircle2, LayoutGrid, Sparkles, Users2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HubLogo } from "../components/HubLogo";

const heroMetrics = [
  { label: "TikTok", value: "+18.4%", detail: "Alcance 2.8M", trend: "+32K seguidores", tone: "success" as const },
  { label: "Instagram", value: "5.9%", detail: "Engagement", trend: "Guardados +21%", tone: "success" as const },
  { label: "YouTube", value: "+11.2%", detail: "Suscriptores", trend: "Retencion 47%", tone: "warning" as const },
];

const statTargets = [
  { id: "posts", prefix: "+", suffix: "K", value: 120, label: "publicaciones analizadas en paneles multired." },
  { id: "engagement", prefix: "", suffix: "%", value: 38, label: "mejora media en engagement tras optimizar contenido." },
  { id: "platforms", prefix: "", suffix: "", value: 12, label: "plataformas conectadas dentro de la vision del producto." },
  { id: "tracking", prefix: "", suffix: "/7", value: 24, label: "seguimiento continuo de metricas criticas y alertas." },
];

const benefits = [
  {
    title: "Metricas centralizadas",
    description: "Consulta rendimiento, crecimiento y engagement desde una sola fuente de verdad sin saltar entre apps.",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Comparativa entre redes",
    description: "Entiende que canal responde mejor a cada formato y donde conviene empujar inversion o contenido.",
    icon: Boxes,
  },
  {
    title: "Informes automaticos",
    description: "Resume KPIs, evolucion y variaciones clave con un formato listo para equipos, direccion y clientes.",
    icon: Sparkles,
    highlighted: true,
  },
  {
    title: "Deteccion de tendencias",
    description: "Identifica picos de alcance, senales de saturacion y formatos que estan ganando traccion.",
    icon: LayoutGrid,
  },
  {
    title: "Alertas inteligentes",
    description: "Recibe avisos cuando una metrica se desvia, un contenido destaca o una oportunidad merece atencion.",
    icon: Bell,
  },
  {
    title: "Dashboard para equipos",
    description: "Comparte una lectura comun entre estrategia, contenido, paid media y reporting ejecutivo.",
    icon: Users2,
  },
];

const platforms = ["TikTok", "Instagram", "YouTube", "X / Twitter", "LinkedIn", "Facebook"];

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".js-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

export function PublicHome() {
  useReveal();
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(statTargets.map((item) => [item.id, 0]))
  );

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStatsStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsStarted) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1400;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounts(
        Object.fromEntries(statTargets.map((item) => [item.id, Math.floor(item.value * eased)]))
      );
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [statsStarted]);

  const sparklineHeights = useMemo(() => [48, 56, 62, 58, 70, 76, 68, 72, 84, 92, 86, 100], []);

  return (
    <main className="public-page min-h-screen text-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="public-orb public-orb-one" />
        <div className="public-orb public-orb-two" />
        <div className="public-orb public-orb-three" />
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[rgba(248,250,252,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[78px] w-full max-w-[1180px] items-center justify-between gap-5 px-5 md:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-3">
            <div className="overflow-hidden rounded-[14px] shadow-[0_10px_30px_rgba(79,70,229,0.18)]">
              <HubLogo />
            </div>
            <div className="min-w-0">
              <div className="font-['Sora'] text-xl font-extrabold leading-none text-slate-900">InsightHub</div>
              <div className="mt-1 text-xs font-semibold text-slate-500">All your metrics. One view.</div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
            <a href="#funcionalidades" className="transition hover:text-slate-900">Funcionalidades</a>
            <a href="#plataformas" className="transition hover:text-slate-900">Plataformas</a>
            <a href="#precios" className="transition hover:text-slate-900">Precios</a>
            <a href="#contacto" className="transition hover:text-slate-900">Contacto</a>
          </nav>

          <Link to="/login" className="accent-pill rounded-[14px] px-5 py-3 text-sm font-bold shadow-soft transition hover:-translate-y-0.5">
            Solicitar demo
          </Link>
        </div>
      </header>

      <section id="top" className="px-5 pb-12 pt-16 md:px-8 md:pt-20">
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-11 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="js-reveal reveal-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-blue-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[linear-gradient(135deg,#38BDF8,#4F46E5)] animate-pulse" />
              Panel social unificado para equipos y creadores
            </span>
            <h1 className="mt-5 max-w-[740px] font-['Sora'] text-[clamp(2.8rem,5vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-slate-900">
              Entiende el rendimiento de todas tus redes sin perder contexto entre plataformas.
            </h1>
            <p className="mt-5 max-w-[640px] text-lg leading-8 text-slate-600">
              InsightHub centraliza alcance, engagement, seguidores, comparativas y alertas en una sola interfaz para que marketing, contenido y analitica trabajen con la misma lectura.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/login" className="accent-pill rounded-[14px] px-6 py-4 text-base font-bold shadow-soft transition hover:-translate-y-0.5">
                Solicitar demo
              </Link>
              <a href="#funcionalidades" className="inline-flex items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-6 py-4 text-base font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5">
                Ver funcionalidades
                <ArrowRight size={18} />
              </a>
            </div>
          </div>

          <div className="js-reveal reveal-up rounded-[30px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,255,255,0.94))] p-5 shadow-[0_24px_60px_rgba(37,99,235,0.10)]">
            <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div className="text-sm font-extrabold text-slate-900">InsightHub Overview</div>
                <span className="rounded-full bg-blue-50 px-3 py-2 text-[12px] font-bold text-blue-700">Live tracking</span>
              </div>

              <div className="p-5">
                <div className="mb-4 grid gap-3 md:grid-cols-3">
                  {[
                    ["Alcance total", "8.4M"],
                    ["Engagement medio", "6.8%"],
                    ["Seguidores netos", "+42K"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[18px] border border-slate-200 bg-white p-4">
                      <div className="text-xs font-bold text-slate-500">{label}</div>
                      <div className="mt-3 text-2xl font-extrabold text-slate-900">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[22px] border border-slate-200 bg-white p-5">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <h3 className="font-['Sora'] text-base font-extrabold text-slate-900">Rendimiento consolidado</h3>
                    <span className="text-xs font-bold text-slate-500">Ultimos 30 dias</span>
                  </div>
                  <div className="grid h-40 grid-cols-12 items-end gap-2" aria-hidden="true">
                    {sparklineHeights.map((height, index) => (
                      <span
                        key={index}
                        className="rounded-t-[999px] rounded-b-[10px] bg-[linear-gradient(180deg,rgba(56,189,248,0.26),rgba(79,70,229,0.84))]"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute right-[-14px] top-[88px] grid w-[min(220px,42vw)] gap-3 max-[1080px]:static max-[1080px]:w-full max-[1080px]:grid-cols-3 max-[720px]:grid-cols-1 max-[1080px]:p-5">
                {heroMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-[20px] border border-slate-200 bg-[rgba(255,255,255,0.94)] p-4 shadow-[0_22px_40px_rgba(15,23,42,0.10)]">
                    <small className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{metric.label}</small>
                    <strong className="mt-2 block text-2xl font-extrabold text-slate-900">{metric.value}</strong>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-[12px] font-bold text-slate-800">{metric.detail}</span>
                      <span className={`text-[12px] font-extrabold ${metric.tone === "success" ? "text-emerald-500" : "text-amber-500"}`}>{metric.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-4 md:px-8">
        <div ref={statsRef} className="mx-auto grid w-full max-w-[1180px] gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statTargets.map((item) => (
            <article key={item.id} className="card js-reveal reveal-up rounded-[20px] p-6">
              <div className="text-[clamp(1.8rem,3vw,2.55rem)] font-extrabold leading-none text-slate-900">
                {item.prefix}
                {counts[item.id].toLocaleString("es-ES")}
                {item.suffix}
              </div>
              <div className="mt-3 text-sm leading-6 text-slate-500">{item.label}</div>
            </article>
          ))}
        </div>
      </section>

      <section id="funcionalidades" className="px-5 py-24 md:px-8">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="section-title js-reveal reveal-up">
            <h2 className="font-['Sora'] text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] text-slate-900">
              Una capa operativa para tomar decisiones con mas contexto y menos ruido.
            </h2>
            <p className="mt-3 max-w-[700px] text-base leading-7 text-slate-600">
              Disenado para equipos de contenido, marketing y analitica que necesitan comparar canales, detectar oportunidades y convertir datos dispersos en una lectura accionable.
            </p>
          </div>

          <div className="grid gap-[18px] md:grid-cols-2 xl:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className={`card js-reveal reveal-up rounded-[22px] p-6 ${benefit.highlighted ? "border-blue-600/20 bg-[linear-gradient(135deg,#2563EB,#4F46E5)] text-white shadow-[0_24px_54px_rgba(79,70,229,0.18)]" : ""}`}
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <div className={`mb-4 grid h-[46px] w-[46px] place-items-center rounded-[14px] ${benefit.highlighted ? "bg-white/15 text-white" : "bg-[linear-gradient(135deg,rgba(37,99,235,0.14),rgba(56,189,248,0.18))] text-blue-600"}`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="font-['Sora'] text-lg font-extrabold">{benefit.title}</h3>
                  <p className={`mt-2 text-sm leading-7 ${benefit.highlighted ? "text-white/80" : "text-slate-500"}`}>{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="plataformas" className="px-5 pb-16 md:px-8">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="section-title js-reveal reveal-up">
            <h2 className="font-['Sora'] text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] text-slate-900">
              Preparado para trabajar con las plataformas que concentran tu operativa.
            </h2>
            <p className="mt-3 max-w-[700px] text-base leading-7 text-slate-600">
              InsightHub se plantea como una capa unificada para canales de crecimiento, comunidad, contenido de marca y reporting ejecutivo.
            </p>
          </div>

          <div className="js-reveal reveal-up flex flex-wrap gap-[14px]">
            {platforms.map((platform) => (
              <span key={platform} className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-[18px] py-[14px] text-sm font-bold shadow-sm">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(37,99,235,0.14),rgba(79,70,229,0.12))] text-[12px] font-extrabold text-blue-600">
                  {platform[0]}
                </span>
                {platform}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="precios" className="px-5 py-10 md:px-8">
        <div className="mx-auto grid w-full max-w-[1180px] gap-[18px] lg:grid-cols-[0.94fr_1.06fr]">
          <div className="surface js-reveal reveal-up rounded-[24px] p-[26px]">
            <h3 className="font-['Sora'] text-2xl font-extrabold text-slate-900">Precios orientados a equipos que necesitan visibilidad y control.</h3>
            <p className="mt-3 text-base leading-7 text-slate-600">
              InsightHub se plantea como un SaaS de analitica unificada con enfoque B2B. El precio final dependera de volumen, canales conectados, automatizaciones y necesidades de reporting.
            </p>
          </div>
          <div className="surface js-reveal reveal-up rounded-[24px] p-[26px]">
            <h3 className="font-['Sora'] text-2xl font-extrabold text-slate-900">Modelo comercial flexible</h3>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Desde equipos pequenos que necesitan claridad operativa hasta marcas o agencias que quieren una lectura transversal de rendimiento y crecimiento.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-[18px]">
                <div className="text-xs font-bold text-slate-500">Plan Growth</div>
                <strong className="mt-3 block text-[28px] font-extrabold text-slate-900">Desde 149 EUR</strong>
                <p className="mt-2 text-sm leading-6 text-slate-500">Equipos que centralizan lectura y reporting.</p>
              </div>
              <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-[18px]">
                <div className="text-xs font-bold text-slate-500">Plan Scale</div>
                <strong className="mt-3 block text-[28px] font-extrabold text-slate-900">Custom</strong>
                <p className="mt-2 text-sm leading-6 text-slate-500">Multi-equipo, multi-marca y reporting avanzado.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="px-5 py-24 md:px-8">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="js-reveal reveal-up rounded-[32px] bg-[linear-gradient(135deg,#2563EB,#4F46E5)] px-7 py-10 text-white shadow-[0_24px_60px_rgba(37,99,235,0.20)] md:px-10">
            <h2 className="font-['Sora'] text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1]">Centraliza el analisis de tus redes con una interfaz pensada para decidir mejor.</h2>
            <p className="mt-4 max-w-[700px] text-base leading-8 text-white/80">
              Solicita una demo y descubre como InsightHub puede ordenar metricas, comparativas y alertas en una sola capa operativa para tu equipo.
            </p>
            <div className="mt-6">
              <Link to="/login" className="inline-flex rounded-[14px] bg-white px-6 py-4 text-base font-bold text-slate-900 shadow-[0_18px_36px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5">
                Empezar ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[linear-gradient(180deg,#111827_0%,#0F172A_100%)] px-5 py-9 text-white/75 md:px-8">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-[14px] shadow-[0_10px_30px_rgba(79,70,229,0.18)]">
              <HubLogo />
            </div>
            <div>
              <div className="font-['Sora'] text-xl font-extrabold leading-none text-white">InsightHub</div>
              <div className="mt-1 text-xs font-semibold text-white/55">All your metrics. One view.</div>
            </div>
          </div>
          <nav className="flex flex-wrap gap-5 text-sm font-semibold">
            <Link to="/privacy" className="hover:text-white">Politica de privacidad</Link>
            <Link to="/terms" className="hover:text-white">Terminos de servicio</Link>
            <Link to="/cookies" className="hover:text-white">Cookies</Link>
            <a href="mailto:demo@insighthub.app" className="hover:text-white">Contacto</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
