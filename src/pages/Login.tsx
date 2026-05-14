import { AlertCircle, Check, CheckCircle2, Eye, EyeOff, Lock, Mail, Music2, ShieldCheck, Youtube } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HubLogo } from "../components/HubLogo";

type AuthMode = "signin" | "signup";

type FieldErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const dashboardStats = [
  { label: "TikTok", metric: "2.8M alcance", sub: "+18.4% esta semana", icon: Music2 },
  { label: "Instagram", metric: "6.1% engagement", sub: "Guardados +21%", icon: CheckCircle2 },
  { label: "YouTube", metric: "+11.2% suscriptores", sub: "Retencion estable", icon: Youtube },
];

function validateEmail(value: string) {
  if (!value.trim()) return "Introduce tu correo.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Introduce un correo valido.";
  return "";
}

function validatePassword(value: string) {
  if (!value.trim()) return "Introduce tu contraseña.";
  if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  return "";
}

function validateConfirmPassword(password: string, confirmPassword: string) {
  if (!confirmPassword.trim()) return "Confirma tu contraseña.";
  if (password !== confirmPassword) return "Las contraseñas no coinciden.";
  return "";
}

export function Login({
  onGoogleSignIn,
  onEmailSignIn,
  onEmailSignUp,
  onPasswordReset,
  authEnabled,
}: {
  onGoogleSignIn: () => Promise<void> | void;
  onEmailSignIn: (email: string, password: string) => Promise<void> | void;
  onEmailSignUp: (email: string, password: string) => Promise<{ user?: unknown; session?: unknown } | unknown>;
  onPasswordReset: (email: string) => Promise<void> | void;
  authEnabled: boolean;
}) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean; confirmPassword?: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const errors = useMemo<FieldErrors>(
    () => ({
      email: touched.email ? validateEmail(email) : "",
      password: touched.password ? validatePassword(password) : "",
      confirmPassword:
        mode === "signup" && touched.confirmPassword ? validateConfirmPassword(password, confirmPassword) : "",
    }),
    [confirmPassword, email, mode, password, touched]
  );

  function resetMessages() {
    setSuccessMessage("");
    setFormMessage("");
  }

  function resetForMode(nextMode: AuthMode) {
    setMode(nextMode);
    setTouched({});
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    resetMessages();
  }

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: mode === "signup" ? validateConfirmPassword(password, confirmPassword) : "",
    };

    setTouched({ email: true, password: true, confirmPassword: mode === "signup" });
    resetMessages();

    if (nextErrors.email || nextErrors.password || nextErrors.confirmPassword) {
      return;
    }

    try {
      setLoading(true);

      if (mode === "signin") {
        await onEmailSignIn(email, password);
        setSuccessMessage("Acceso correcto. Redirigiendo a tu espacio de InsightHub...");
        window.setTimeout(() => navigate("/dashboard"), 500);
      } else {
        const result = await onEmailSignUp(email, password);
        const session = (result as { session?: unknown } | undefined)?.session;

        if (session) {
          setSuccessMessage("Cuenta creada correctamente. Ya puedes empezar a usar InsightHub.");
          window.setTimeout(() => navigate("/dashboard"), 500);
        } else {
          setSuccessMessage("Cuenta creada. Revisa tu correo para confirmar el acceso.");
        }
      }
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : "No se pudo completar la operación.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    const emailError = validateEmail(email);
    setTouched((state) => ({ ...state, email: true }));
    resetMessages();

    if (emailError) {
      setFormMessage(emailError);
      return;
    }

    try {
      setLoading(true);
      await onPasswordReset(email);
      setSuccessMessage("Te hemos enviado un enlace para restablecer la contraseña.");
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : "No se pudo enviar el correo de recuperación.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.02fr_0.98fr]">
        <section className="login-mesh relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.06),transparent_18%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            <div className="max-w-[520px]">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="overflow-hidden rounded-[16px] shadow-[0_16px_40px_rgba(37,99,235,0.24)]">
                  <HubLogo size={52} rounded={16} />
                </div>
                <div>
                  <div className="font-['Sora'] text-2xl font-extrabold text-white">InsightHub</div>
                  <div className="mt-1 text-sm font-medium text-slate-300">All your metrics. One view.</div>
                </div>
              </Link>

              <div className="mt-16">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-blue-100 backdrop-blur-sm">
                  <span className="login-live-dot h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Live social intelligence
                </span>

                <h1 className="mt-6 max-w-[560px] font-['Sora'] text-[clamp(2.8rem,5vw,4.7rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white">
                  Una sola entrada para leer, comparar y activar el rendimiento de tus redes.
                </h1>

                <p className="mt-5 max-w-[500px] text-lg leading-8 text-slate-300">
                  Accede a un panel unificado para equipos y creadores que necesitan crecimiento, contexto y reporting serio sin saltar entre plataformas.
                </p>
              </div>
            </div>

            <div className="relative mt-12 max-w-[620px]">
              <div className="login-float absolute -right-4 top-0 hidden rounded-[20px] border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(15,23,42,0.26)] backdrop-blur-md xl:block">
                +32K seguidores netos
              </div>

              <div className="login-float login-float-delay absolute -left-4 bottom-12 hidden rounded-[20px] border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(15,23,42,0.26)] backdrop-blur-md xl:block">
                Engagement medio 6.8%
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.32)] backdrop-blur-md">
                <div className="rounded-[24px] border border-white/10 bg-[rgba(8,15,33,0.42)] p-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.08em] text-slate-300">Mini dashboard</div>
                      <div className="mt-2 font-['Sora'] text-xl font-extrabold text-white">Workspace overview</div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-emerald-400/12 px-3 py-2 text-[12px] font-bold text-emerald-300">
                      Live
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {dashboardStats.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="login-float flex items-center justify-between gap-4 rounded-[20px] border border-white/10 bg-white/8 p-4 backdrop-blur-sm"
                          style={{ animationDelay: `${index * 0.7}s` }}
                        >
                          <div className="flex items-center gap-4">
                            <span className="grid h-11 w-11 place-items-center rounded-[16px] bg-white/10 text-white">
                              <Icon size={20} />
                            </span>
                            <div>
                              <div className="font-semibold text-white">{item.label}</div>
                              <div className="text-sm text-slate-300">{item.sub}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-['Sora'] text-lg font-extrabold text-white">{item.metric}</div>
                            <div className="mt-2 h-2 w-24 overflow-hidden rounded-full bg-white/10">
                              <div className="h-full w-4/5 rounded-full bg-[linear-gradient(90deg,#38BDF8,#4F46E5)]" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-8 md:px-8">
          <div className="w-full max-w-[540px]">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="overflow-hidden rounded-[14px] shadow-[0_10px_30px_rgba(79,70,229,0.18)]">
                  <HubLogo />
                </div>
                <div>
                  <div className="font-['Sora'] text-xl font-extrabold text-slate-900">InsightHub</div>
                  <div className="text-xs font-semibold text-slate-500">All your metrics. One view.</div>
                </div>
              </Link>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:p-8">
              <div className="text-center">
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-600">
                  Acceso seguro
                </span>
                <h2 className="mt-5 font-['Sora'] text-3xl font-extrabold text-slate-900 md:text-4xl">
                  {mode === "signin" ? "Entra en tu cuenta" : "Crea tu cuenta de InsightHub"}
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  {mode === "signin"
                    ? "Accede con Google o con tu email para entrar en el panel."
                    : "Registra tu acceso con email y contraseña para usar InsightHub sin depender de Google."}
                </p>
              </div>

              <div className="mt-7 grid grid-cols-2 rounded-[16px] border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => resetForMode("signin")}
                  className={`rounded-[12px] px-4 py-3 text-sm font-bold transition ${
                    mode === "signin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => resetForMode("signup")}
                  className={`rounded-[12px] px-4 py-3 text-sm font-bold transition ${
                    mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Crear cuenta
                </button>
              </div>

              <div className="mt-8 space-y-4">
                {authEnabled && (
                  <button
                    className="w-full rounded-[16px] border border-slate-200 bg-white px-5 py-4 text-base font-semibold text-slate-800 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(15,23,42,0.08)]"
                    onClick={() => onGoogleSignIn()}
                  >
                    {mode === "signin" ? "Entrar con Google" : "Crear cuenta con Google"}
                  </button>
                )}

                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-sm font-medium text-slate-500">o</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <form className="space-y-4" onSubmit={handleEmailSubmit} noValidate>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (!touched.email) setTouched((state) => ({ ...state, email: true }));
                          resetMessages();
                        }}
                        onBlur={() => setTouched((state) => ({ ...state, email: true }))}
                        placeholder="tu@empresa.com"
                        className={`w-full rounded-[16px] border bg-white py-4 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] ${
                          errors.email ? "border-red-300" : "border-slate-200"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-red-500">
                        <AlertCircle size={15} />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          if (!touched.password) setTouched((state) => ({ ...state, password: true }));
                          resetMessages();
                        }}
                        onBlur={() => setTouched((state) => ({ ...state, password: true }))}
                        placeholder="Minimo 8 caracteres"
                        className={`w-full rounded-[16px] border bg-white py-4 pl-12 pr-14 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] ${
                          errors.password ? "border-red-300" : "border-slate-200"
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                        onClick={() => setShowPassword((state) => !state)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-red-500">
                        <AlertCircle size={15} />
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {mode === "signup" && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="confirm-password">
                        Confirmar contraseña
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(event) => {
                            setConfirmPassword(event.target.value);
                            if (!touched.confirmPassword) setTouched((state) => ({ ...state, confirmPassword: true }));
                            resetMessages();
                          }}
                          onBlur={() => setTouched((state) => ({ ...state, confirmPassword: true }))}
                          placeholder="Repite tu contraseña"
                          className={`w-full rounded-[16px] border bg-white py-4 pl-12 pr-14 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] ${
                            errors.confirmPassword ? "border-red-300" : "border-slate-200"
                          }`}
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                          onClick={() => setShowConfirmPassword((state) => !state)}
                          aria-label={showConfirmPassword ? "Ocultar confirmacion de contraseña" : "Mostrar confirmacion de contraseña"}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-red-500">
                          <AlertCircle size={15} />
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <button
                      type="button"
                      className="inline-flex items-center gap-3 text-slate-600 transition hover:text-slate-900"
                      onClick={() => setRemember((state) => !state)}
                    >
                      <span
                        className={`grid h-5 w-5 place-items-center rounded-[6px] border transition ${
                          remember ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-transparent"
                        }`}
                      >
                        <Check size={12} />
                      </span>
                      <span className="font-medium">Recordarme</span>
                    </button>

                    {mode === "signin" && (
                      <button type="button" className="font-semibold text-blue-700 transition hover:text-blue-800" onClick={handleResetPassword}>
                        ¿Olvidaste tu contraseña?
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`accent-pill w-full rounded-[16px] px-5 py-4 text-base font-bold shadow-soft transition hover:-translate-y-0.5 disabled:cursor-wait disabled:hover:translate-y-0 ${
                      loading ? "button-shimmer opacity-95" : ""
                    }`}
                  >
                    {loading ? "Procesando..." : mode === "signin" ? "Entrar con email" : "Crear cuenta"}
                  </button>

                  {formMessage && (
                    <div className="rounded-[16px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                      {formMessage}
                    </div>
                  )}

                  {successMessage && (
                    <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                      {successMessage}
                    </div>
                  )}
                </form>
              </div>

              <div className="mt-6 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  Conexion protegida con SSL
                </div>
                <div className="mt-1 leading-6">
                  Tus credenciales y permisos se transmiten mediante conexiones cifradas y proveedores oficiales de autenticación.
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500">
                <Link to="/" className="transition hover:text-slate-800">
                  Volver al inicio
                </Link>
                <Link to="/privacy" className="transition hover:text-slate-800">
                  Privacidad
                </Link>
                <Link to="/terms" className="transition hover:text-slate-800">
                  Términos
                </Link>
              </div>

              <div className="mt-5 text-center text-sm text-slate-500">
                ¿Solo quieres explorar la experiencia?{" "}
                <button type="button" className="font-semibold text-blue-700 transition hover:text-blue-800" onClick={() => navigate("/demo")}>
                  Ver demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
