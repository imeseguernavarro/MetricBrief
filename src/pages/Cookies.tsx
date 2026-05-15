import { Link } from "react-router-dom";

const LAST_UPDATED = "15 de mayo de 2026";

const sections = [
  {
    title: "1. Que son las cookies?",
    body: "Las cookies son pequenos archivos de texto que los sitios web almacenan en el navegador del usuario. Permiten que el servicio recuerde informacion entre visitas, como el estado de autenticacion o ciertas preferencias de configuracion. Existen tambien tecnologias similares, como localStorage o los identificadores de sesion, que pueden cumplir funciones equivalentes.",
  },
  {
    title: "2. Como usamos las cookies en MetricBrief",
    body: "MetricBrief utiliza cookies y tecnologias similares de forma limitada y proporcionada, con el objetivo de garantizar el acceso seguro al servicio, mantener la sesion activa y mejorar la experiencia general del usuario. No utilizamos cookies de publicidad comportamental ni vendemos datos derivados del uso de cookies.",
  },
  {
    title: "3. Cookies de terceros",
    body: "Las integraciones con plataformas como TikTok, YouTube, Google o Instagram se realizan mediante redirecciones OAuth y APIs oficiales. Durante esos procesos, dichas plataformas pueden instalar sus propias cookies conforme a sus politicas de privacidad y cookies. MetricBrief no controla esas cookies de terceros, por lo que recomendamos revisar sus politicas especificas si quieres mas informacion.",
  },
  {
    title: "4. Gestion y control de cookies",
    body: "Puedes controlar y eliminar las cookies desde la configuracion de tu navegador. La mayoria de navegadores permiten bloquear cookies, eliminarlas o recibir avisos antes de que se almacenen. Ten en cuenta que deshabilitar cookies tecnicas esenciales puede impedir el acceso correcto a la plataforma, ya que algunas de ellas son necesarias para mantener la autenticacion y la seguridad de la sesion.",
  },
  {
    title: "5. Base legal",
    body: "Las cookies tecnicas esenciales se utilizan bajo la base legal de interes legitimo y necesidad contractual, ya que son imprescindibles para prestar el servicio solicitado por el usuario. Si en el futuro incorporamos cookies analiticas, de preferencias avanzadas o de medicion no esencial, solicitaremos el consentimiento correspondiente mediante un mecanismo claro de gestion de cookies.",
  },
  {
    title: "6. Actualizaciones de esta politica",
    body: `Podemos actualizar esta Politica de Cookies si incorporamos nuevas tecnologias, herramientas externas o cambia la normativa aplicable. La version vigente estara siempre disponible en esta pagina. Ultima actualizacion: ${LAST_UPDATED}.`,
  },
];

const purposes = [
  {
    title: "Cookies esenciales",
    description:
      "Permiten el inicio de sesion, la seguridad del acceso, el mantenimiento de la sesion autenticada y el correcto funcionamiento de la plataforma.",
    tone: "blue",
  },
  {
    title: "Cookies de preferencias",
    description:
      "Pueden utilizarse para recordar ajustes del usuario, como determinadas decisiones de interfaz o preferencias operativas dentro del producto.",
    tone: "slate",
  },
  {
    title: "Cookies analiticas",
    description:
      "Si se activan en el futuro, serviran para entender el uso de la web y mejorar la experiencia, siempre con informacion agregada y con la base legal correspondiente.",
    tone: "emerald",
  },
  {
    title: "Cookies de integraciones externas",
    description:
      "Pueden aparecer durante procesos de autorizacion con proveedores como Google, YouTube o TikTok, exclusivamente para completar conexiones seguras con servicios de terceros.",
    tone: "violet",
  },
];

const toneClasses: Record<string, string> = {
  blue: "border-blue-100 bg-blue-50/70 text-blue-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
  emerald: "border-emerald-100 bg-emerald-50/70 text-emerald-700",
  violet: "border-violet-100 bg-violet-50/70 text-violet-700",
};

export function Cookies() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eff6ff_0%,#f8fafc_22%,#ffffff_100%)]">
      <div className="mx-auto max-w-5xl px-6 py-6 md:px-10">
        <header className="flex flex-col gap-4 border-b border-slate-200/60 pb-6 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="inline-flex items-center gap-3">
            <div>
              <span className="block font-['Sora'] text-2xl font-extrabold text-slate-900">MetricBrief</span>
              <span className="text-sm text-slate-500">Unified social media analytics</span>
            </div>
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/">
              Inicio
            </Link>
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/privacy">
              Privacidad
            </Link>
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/70" to="/terms">
              Terminos
            </Link>
          </nav>
        </header>

        <section className="py-10">
          <span className="eyebrow">Legal</span>
          <h1 className="mt-4 font-['Sora'] text-4xl font-extrabold text-slate-900 md:text-5xl">
            Politica de cookies
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Informacion sobre las cookies y tecnologias similares utilizadas en MetricBrief, su
            finalidad y como puedes gestionarlas.
          </p>
          <p className="mt-2 text-xs text-slate-400">Ultima actualizacion: {LAST_UPDATED}</p>
        </section>

        <div className="space-y-4 pb-10">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-crisp"
            >
              <h2 className="text-xl font-black text-slate-900">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
            </section>
          ))}

          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-crisp">
            <h2 className="text-xl font-black text-slate-900">Finalidad de las cookies utilizadas</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              En lugar de mantener una tabla tecnica cerrada, preferimos explicar de forma clara
              para que sirven las cookies y tecnologias similares que pueden intervenir en la
              experiencia del producto.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {purposes.map((purpose) => (
                <article key={purpose.title} className="rounded-2xl border border-slate-200 p-5">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[purpose.tone]}`}
                  >
                    {purpose.title}
                  </span>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{purpose.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-blue-100 bg-blue-50/50 p-6">
            <h2 className="text-xl font-black text-slate-900">Tienes dudas?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Si tienes preguntas sobre el uso de cookies o quieres ejercer tus derechos en
              relacion con los datos tratados, contacta con nosotros. Tambien puedes consultar la{" "}
              <Link to="/privacy" className="font-semibold text-blue-600 hover:underline">
                Politica de privacidad
              </Link>{" "}
              para informacion completa sobre el tratamiento de datos personales.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
