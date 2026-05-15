import { Link } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";

const sections = [
  {
    title: "Que son las cookies",
    body:
      "Las cookies son pequenos archivos de informacion que se almacenan en el navegador para recordar preferencias, medir el uso del sitio o facilitar ciertas funciones basicas.",
  },
  {
    title: "Como podemos utilizarlas",
    body:
      "MetricBrief puede utilizar cookies tecnicas, de rendimiento o analiticas para mejorar la experiencia de navegacion, entender el uso del sitio y optimizar contenidos o formularios de contacto.",
  },
  {
    title: "Gestion de preferencias",
    body:
      "El usuario puede bloquear o eliminar cookies desde la configuracion de su navegador. Algunas funciones del sitio pueden verse limitadas si se desactivan ciertas cookies necesarias para su funcionamiento.",
  },
  {
    title: "Cookies de terceros",
    body:
      "En caso de incorporar herramientas externas de analitica, video, formularios o mapas, estas pueden establecer sus propias cookies de acuerdo con sus politicas especificas.",
  },
];

export function Cookies() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eff6ff_0%,#f8fafc_22%,#ffffff_100%)]">
      <div className="mx-auto max-w-5xl px-6 py-6 md:px-10">
        <header className="flex flex-col gap-4 border-b border-white/60 pb-6 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="inline-flex rounded-[18px] bg-white/90 px-3 py-2 shadow-[0_10px_30px_rgba(79,70,229,0.12)]">
            <BrandLogo width={164} className="h-auto w-[164px]" />
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/">Inicio</Link>
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/privacy">Privacidad</Link>
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/terms">Terminos</Link>
          </nav>
        </header>
        <section className="py-10">
          <span className="eyebrow">Legal</span>
          <h1 className="mt-4 font-['Sora'] text-4xl font-extrabold text-slate-900 md:text-5xl">Politica de cookies</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Informacion general sobre el uso de cookies, tecnologias similares y preferencias de seguimiento dentro de la web de MetricBrief.
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
