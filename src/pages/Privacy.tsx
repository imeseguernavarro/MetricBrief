import { Link } from "react-router-dom";
 
const LAST_UPDATED = "15 de mayo de 2026";
 
const sections = [
  {
    title: "1. Responsable del tratamiento",
    body: "El responsable del tratamiento de los datos personales recogidos a través de MetricBrief es su titular, contactable en: legal@metricbrief.app. Este servicio se rige por el Reglamento General de Protección de Datos (RGPD 2016/679) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).",
  },
  {
    title: "2. Datos que recopilamos",
    body: "Recopilamos los datos estrictamente necesarios para prestar el servicio: (a) Datos de cuenta: nombre, dirección de correo electrónico e imagen de perfil, proporcionados durante el registro o mediante autenticación delegada (Google, TikTok). (b) Datos de plataformas conectadas: identificadores de cuenta, métricas de rendimiento, estadísticas de audiencia y datos de contenido, obtenidos exclusivamente bajo los permisos que el usuario concede expresamente a través de las APIs oficiales de cada plataforma. (c) Datos técnicos: información de sesión, registros de acceso y datos de uso necesarios para el funcionamiento y la seguridad del servicio.",
  },
  {
    title: "3. Base legal del tratamiento",
    body: "Tratamos tus datos bajo las siguientes bases legales: (a) Ejecución de un contrato: el tratamiento es necesario para prestarte el servicio que has solicitado al crear tu cuenta (Art. 6.1.b RGPD). (b) Consentimiento: para el acceso a métricas de tus plataformas sociales, basado en los permisos que otorgas expresamente en cada integración (Art. 6.1.a RGPD). Puedes retirar este consentimiento en cualquier momento desconectando la plataforma correspondiente. (c) Interés legítimo: para el mantenimiento de la seguridad del servicio, prevención del fraude y mejora del producto (Art. 6.1.f RGPD).",
  },
  {
    title: "4. Finalidad del tratamiento",
    body: "Utilizamos tus datos para: (a) autenticar tu acceso y mantener tu sesión activa; (b) conectar y sincronizar las plataformas sociales que autorices; (c) generar vistas consolidadas de rendimiento, audiencia y contenido dentro del panel; (d) enviarte comunicaciones relacionadas con el servicio, como avisos de acceso anticipado si estás en lista de espera; (e) mejorar la funcionalidad, estabilidad y seguridad del producto.",
  },
  {
    title: "5. Proveedores e infraestructura",
    body: "MetricBrief utiliza Supabase como proveedor de base de datos y autenticación. Supabase opera servidores en la Unión Europea (Frankfurt, Alemania) para proyectos configurados en esa región. En caso de que existan transferencias internacionales de datos fuera del Espacio Económico Europeo, estas se realizan bajo las garantías adecuadas previstas en el RGPD (cláusulas contractuales tipo o decisiones de adecuación). Las integraciones con TikTok, YouTube, Instagram, X, LinkedIn y Facebook se realizan únicamente mediante las APIs oficiales de cada plataforma y bajo sus propias políticas de privacidad.",
  },
  {
    title: "6. Tus derechos",
    body: "Como usuario, tienes los siguientes derechos sobre tus datos personales: (a) Acceso: obtener confirmación de si tratamos tus datos y acceder a ellos. (b) Rectificación: corregir datos inexactos o incompletos. (c) Supresión: solicitar la eliminación de tus datos cuando ya no sean necesarios o retires tu consentimiento. (d) Limitación: solicitar que restrinjamos el tratamiento en determinadas circunstancias. (e) Portabilidad: recibir tus datos en un formato estructurado y de uso común. (f) Oposición: oponerte al tratamiento basado en interés legítimo. Para ejercer cualquiera de estos derechos, escríbenos a: legal@metricbrief.app. Tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si consideras que el tratamiento vulnera tus derechos.",
  },
  {
    title: "7. Conservación de los datos",
    body: "Conservamos tus datos mientras tu cuenta esté activa y durante el tiempo necesario para cumplir con las obligaciones legales aplicables. Los datos de métricas sincronizados desde plataformas externas se eliminan cuando desconectas la integración correspondiente o eliminas tu cuenta. Los datos de cuenta se eliminan en un plazo máximo de 30 días tras la solicitud de baja.",
  },
  {
    title: "8. Seguridad",
    body: "Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a accesos no autorizados, pérdida o alteración, incluyendo cifrado en tránsito (TLS) y en reposo, control de acceso por roles y registros de auditoría. No obstante, ningún sistema es completamente infalible y no podemos garantizar la seguridad absoluta frente a ataques externos.",
  },
  {
    title: "9. Menores de edad",
    body: "MetricBrief no está dirigido a menores de 16 años. No recopilamos conscientemente datos personales de menores. Si tienes conocimiento de que un menor ha proporcionado datos sin el consentimiento de sus tutores, contacta con nosotros en legal@metricbrief.app para proceder a su eliminación.",
  },
  {
    title: "10. Modificaciones de esta política",
    body: `Podemos actualizar esta Política de Privacidad para reflejar cambios en el servicio, en la normativa aplicable o en nuestras prácticas de tratamiento de datos. Publicaremos la versión actualizada en esta página con su fecha de revisión. Si los cambios son significativos, te lo comunicaremos por correo electrónico. Última actualización: ${LAST_UPDATED}.`,
  },
];
 
export function Privacy() {
  return (
    <LegalLayout
      title="Política de privacidad"
      intro="Cómo MetricBrief recopila, utiliza y protege los datos personales asociados a tu cuenta y a las plataformas que conectas al servicio."
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
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/terms">Términos</Link>
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/cookies">Cookies</Link>
            <Link className="accent-pill rounded-full px-5 py-3 shadow-soft transition hover:opacity-90" to="/login">Entrar</Link>
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
 