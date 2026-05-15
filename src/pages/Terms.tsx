import { Link } from "react-router-dom";
 
const LAST_UPDATED = "15 de mayo de 2026";
 
const sections = [
  {
    title: "1. Identificación del titular",
    body: "MetricBrief es un servicio de analítica unificada de redes sociales operado por su titular (en adelante, \"MetricBrief\" o \"nosotros\"). Para cualquier consulta legal o relacionada con el servicio, puedes contactar a través de: legal@metricbrief.app. Este servicio se rige por la legislación española, en particular la Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI) y el Reglamento General de Protección de Datos (RGPD 2016/679).",
  },
  {
    title: "2. Objeto del servicio",
    body: "MetricBrief ofrece un panel centralizado de analítica de redes sociales que permite a creadores y equipos visualizar métricas de rendimiento, crecimiento y audiencia desde múltiples plataformas en una sola interfaz. El servicio se encuentra actualmente en fase de desarrollo activo. Algunas funciones pueden estar limitadas, en pruebas o sujetas a cambios sin previo aviso durante esta etapa.",
  },
  {
    title: "3. Acceso y registro",
    body: "El acceso al panel requiere la creación de una cuenta mediante correo electrónico o autenticación delegada (Google, TikTok). El usuario es responsable de mantener la confidencialidad de sus credenciales, de la veracidad de los datos aportados durante el registro y de todas las acciones realizadas bajo su cuenta. MetricBrief no será responsable de accesos no autorizados derivados de una gestión negligente de las credenciales por parte del usuario.",
  },
  {
    title: "4. Integraciones con plataformas de terceros",
    body: "MetricBrief se conecta a plataformas externas como TikTok, YouTube, Instagram, X (Twitter), LinkedIn o Facebook mediante sus APIs oficiales y bajo los permisos expresamente otorgados por el usuario. La disponibilidad, el alcance y la fiabilidad de estas integraciones dependen de las condiciones y decisiones de cada plataforma. MetricBrief no garantiza la continuidad de ninguna integración si el tercero modifica, restringe o elimina el acceso a su API. El usuario debe cumplir las condiciones de uso de cada plataforma conectada.",
  },
  {
    title: "5. Uso aceptable",
    body: "El usuario se compromete a utilizar MetricBrief de forma lícita y conforme a estas condiciones. Queda expresamente prohibido: (a) acceder o intentar acceder a cuentas o datos de terceros sin autorización; (b) usar el servicio para actividades fraudulentas, de spam o que incumplan la normativa aplicable; (c) realizar ingeniería inversa, descompilar o extraer el código fuente del servicio; (d) sobrecargar o interferir intencionadamente en la infraestructura del servicio.",
  },
  {
    title: "6. Disponibilidad y modificaciones",
    body: "MetricBrief no garantiza una disponibilidad ininterrumpida del servicio. Podemos realizar tareas de mantenimiento, actualizaciones o mejoras que impliquen interrupciones temporales. Nos reservamos el derecho a modificar, suspender o discontinuar funcionalidades con el objetivo de mejorar el producto, adaptarnos a cambios normativos o de terceros, o por razones operativas. Comunicaremos los cambios relevantes con la antelación razonable posible.",
  },
  {
    title: "7. Propiedad intelectual",
    body: "Todos los derechos sobre el diseño, código, marca, logotipos, textos y elementos visuales de MetricBrief son propiedad exclusiva de su titular o de terceros que han otorgado la licencia correspondiente. El usuario no adquiere ningún derecho de propiedad intelectual sobre el servicio. Se prohíbe reproducir, distribuir o explotar comercialmente cualquier elemento del servicio sin autorización expresa.",
  },
  {
    title: "8. Limitación de responsabilidad",
    body: "MetricBrief proporciona herramientas de apoyo a la toma de decisiones basadas en datos obtenidos de plataformas externas. No garantizamos la exactitud, completitud o actualización en tiempo real de los datos mostrados, ya que estos dependen de las APIs de terceros. El usuario es el único responsable de las decisiones operativas, comerciales o de negocio adoptadas a partir de la información mostrada en el panel. En ningún caso MetricBrief será responsable de pérdidas de ingresos, datos, oportunidades o daños indirectos derivados del uso del servicio.",
  },
  {
    title: "9. Ley aplicable y jurisdicción",
    body: "Estas condiciones se rigen por la legislación española. Para cualquier controversia derivada del uso del servicio, las partes se someten a los juzgados y tribunales competentes según la normativa española aplicable, sin perjuicio de los derechos que asistan al usuario como consumidor conforme a la legislación vigente.",
  },
  {
    title: "10. Modificación de los términos",
    body: `MetricBrief se reserva el derecho a actualizar estos Términos del Servicio. La versión vigente estará siempre disponible en esta página con su fecha de última actualización. El uso continuado del servicio tras la publicación de cambios implica la aceptación de los nuevos términos. Última actualización: ${LAST_UPDATED}.`,
  },
];
 
export function Terms() {
  return (
    <LegalLayout
      title="Términos del servicio"
      intro="Condiciones generales de uso de MetricBrief para el acceso, conexión de plataformas y uso de funcionalidades analíticas. Léelas antes de utilizar el servicio."
      lastUpdated={LAST_UPDATED}
    >
      {sections.map((section) => (
        <section
          key={section.title}
          className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-crisp"
        >
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
  lastUpdated,
  children,
}: {
  title: string;
  intro: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,193,146,0.28),transparent_26%),linear-gradient(180deg,#f8efe8_0%,#f7f8fc_46%,#eef4fb_100%)]">
      <div className="mx-auto max-w-5xl px-6 py-6 md:px-10">
        <header className="flex flex-col gap-4 border-b border-white/60 pb-6 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="inline-flex items-center gap-3">
            <div>
              <span className="block font-['Sora'] text-2xl font-extrabold text-slate-900">MetricBrief</span>
              <span className="text-sm text-slate-500">Unified social media analytics</span>
            </div>
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/">Inicio</Link>
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/privacy">Privacidad</Link>
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/cookies">Cookies</Link>
          </nav>
        </header>
 
        <section className="py-10">
          <span className="eyebrow">Legal</span>
          <h1 className="mt-4 font-['Sora'] text-4xl font-extrabold text-slate-900 md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{intro}</p>
          <p className="mt-2 text-xs text-slate-400">Última actualización: {lastUpdated}</p>
        </section>
 
        <div className="space-y-4 pb-10">{children}</div>
      </div>
    </main>
  );
}
