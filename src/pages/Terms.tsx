import { Link } from "react-router-dom";
import { HubLogo } from "../components/HubLogo";

const sections = [
  {
    title: "Uso del servicio",
    body:
      "InsightHub ofrece herramientas de analitica, conexion de plataformas y visualizacion de rendimiento para creadores y equipos. El uso del servicio debe realizarse conforme a la normativa aplicable y a las condiciones de las plataformas conectadas.",
  },
  {
    title: "Cuenta del usuario",
    body:
      "Cada usuario es responsable de la seguridad de su acceso, de la veracidad de la informacion aportada y de gestionar los permisos concedidos a las plataformas sociales vinculadas al servicio.",
  },
  {
    title: "Integraciones de terceros",
    body:
      "InsightHub depende de APIs y productos de terceros como TikTok, YouTube, Instagram o proveedores de autenticacion. La disponibilidad y el alcance de ciertas funciones pueden cambiar si esos terceros modifican sus servicios, permisos o condiciones.",
  },
  {
    title: "Disponibilidad y cambios",
    body:
      "Podemos actualizar, mejorar o modificar funciones del servicio para adaptarlo a nuevas necesidades de producto, seguridad o cumplimiento. Tambien podemos suspender temporalmente funciones durante tareas de mantenimiento.",
  },
  {
    title: "Limitacion de responsabilidad",
    body:
      "InsightHub proporciona herramientas de apoyo para la toma de decisiones y no garantiza resultados concretos de crecimiento, rendimiento o monetizacion. El usuario es responsable de las decisiones operativas tomadas a partir de la informacion mostrada.",
  },
];

export function Terms() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,193,146,0.28),transparent_26%),linear-gradient(180deg,#f8efe8_0%,#f7f8fc_46%,#eef4fb_100%)]">
      <div className="mx-auto max-w-5xl px-6 py-6 md:px-10">
        <header className="flex flex-col gap-4 border-b border-white/60 pb-6 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="overflow-hidden rounded-[14px] shadow-[0_10px_30px_rgba(79,70,229,0.18)]">
              <HubLogo />
            </div>
            <div>
              <span className="block font-['Sora'] text-2xl font-extrabold text-ink">InsightHub</span>
              <span className="text-sm text-slate-500">Cross-platform intelligence</span>
            </div>
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/">
              Inicio
            </Link>
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/privacy">
              Privacidad
            </Link>
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/cookies">
              Cookies
            </Link>
            <Link className="accent-pill rounded-full px-5 py-3 shadow-soft transition hover:opacity-90" to="/login">
              Entrar
            </Link>
          </nav>
        </header>

        <section className="py-10">
          <span className="eyebrow">Legal</span>
          <h1 className="mt-4 text-4xl font-black text-ink md:text-5xl">Terminos del servicio</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Condiciones generales de uso de InsightHub para acceso, conexion de plataformas y uso de funcionalidades analiticas.
          </p>
        </section>

        <div className="space-y-4 pb-10">
          {sections.map((section) => (
            <section key={section.title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-crisp">
              <h2 className="text-xl font-black text-slate-900">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
