import { Link } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";

const sections = [
  {
    title: "Informacion que recopilamos",
    body:
      "MetricBrief recopila la informacion necesaria para autenticar usuarios, conectar plataformas sociales y mostrar datos analiticos dentro del panel. Esto puede incluir nombre, correo, imagen de perfil, identificadores de cuenta conectada y metricas autorizadas por el usuario.",
  },
  {
    title: "Como usamos los datos",
    body:
      "Usamos los datos para prestar el servicio, autenticar el acceso, sincronizar rendimiento de contenido, construir vistas agregadas de audiencia y ofrecer recomendaciones operativas dentro del producto.",
  },
  {
    title: "Proveedores e infraestructura",
    body:
      "MetricBrief puede apoyarse en proveedores de infraestructura y autenticacion como Supabase y en integraciones oficiales de terceros como YouTube, TikTok o Instagram, siempre bajo permisos otorgados por el usuario.",
  },
  {
    title: "Conservacion y control",
    body:
      "Los usuarios pueden solicitar la desconexion de sus plataformas o la eliminacion de sus datos de cuenta. Conservamos la informacion solo durante el tiempo necesario para operar el servicio y cumplir obligaciones legales aplicables.",
  },
  {
    title: "Contacto",
    body:
      "Para cuestiones de privacidad, uso de datos o solicitudes de eliminacion, puedes contactar con el equipo de MetricBrief a traves de los canales de soporte publicados en la web oficial del servicio.",
  },
];

export function Privacy() {
  return (
    <LegalLayout title="Politica de privacidad" intro="Como MetricBrief recopila, usa y protege la informacion asociada a la cuenta y a las plataformas conectadas.">
      {sections.map((section) => (
        <section key={section.title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-crisp">
          <h2 className="text-xl font-black text-slate-900">{section.title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
        </section>
      ))}
    </LegalLayout>
  );
}

function LegalLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,193,146,0.28),transparent_26%),linear-gradient(180deg,#f8efe8_0%,#f7f8fc_46%,#eef4fb_100%)]">
      <div className="mx-auto max-w-5xl px-6 py-6 md:px-10">
        <header className="flex flex-col gap-4 border-b border-white/60 pb-6 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="inline-flex rounded-[18px] bg-white/90 px-3 py-2 shadow-[0_10px_30px_rgba(79,70,229,0.12)]">
            <BrandLogo width={164} className="h-auto w-[164px]" />
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/">
              Inicio
            </Link>
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/terms">
              Terminos
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
          <h1 className="mt-4 text-4xl font-black text-ink md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{intro}</p>
        </section>

        <div className="space-y-4 pb-10">{children}</div>
      </div>
    </main>
  );
}
