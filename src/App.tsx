import { BarChart3, Brain, Clapperboard, LayoutDashboard, Menu, Settings, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { AuthBadge } from "./components/AuthBadge";
import { ConnectModal } from "./components/ConnectModal";
import { Sidebar } from "./components/Sidebar";
import { Toast } from "./components/Toast";
import { Topbar } from "./components/Topbar";
import { initialPlatforms, userProfile, type Period, type PlatformStatus } from "./data/mock";
import { useSupabaseAuth } from "./hooks/useSupabaseAuth";
import { useCreatorOSData } from "./hooks/useCreatorOSData";
import { sendPasswordReset, signInWithGoogle, signInWithPassword, signOut, signUpWithEmail } from "./integrations/supabase/auth";
import { emptyCreatorOSData, fallbackCreatorOSData } from "./integrations/supabase/creatoros";
import { demoCreatorUserId } from "./integrations/supabase/session";
import { startTikTokOAuth, syncTikTok } from "./integrations/supabase/tiktok";
import { startYouTubeOAuth, syncYouTube } from "./integrations/supabase/youtube";
import { Audience } from "./pages/Audience";
import { Cookies } from "./pages/Cookies";
import { Content } from "./pages/Content";
import { Dashboard } from "./pages/Dashboard";
import { Insights } from "./pages/Insights";
import { Login } from "./pages/Login";
import { Privacy } from "./pages/Privacy";
import { PublicHome } from "./pages/PublicHome";
import { Settings as SettingsPage } from "./pages/Settings";
import { Terms } from "./pages/Terms";

const mobileNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/content", label: "Contenido", icon: Clapperboard },
  { to: "/audience", label: "Audiencia", icon: Users },
  { to: "/insights", label: "Insights", icon: Brain },
  { to: "/settings", label: "Ajustes", icon: Settings },
];

const topbarRoutes = new Set(["/dashboard", "/content", "/audience", "/insights"]);
const disconnectedPlatforms: PlatformStatus[] = initialPlatforms.map((platform) => ({
  ...platform,
  connected: false,
  followers: 0,
  change: 0,
}));

function mergeWithSupportedPlatforms(platforms: PlatformStatus[]) {
  const byName = new Map(platforms.map((platform) => [platform.name, platform]));
  return disconnectedPlatforms.map((platform) => byName.get(platform.name) ?? platform);
}

export default function App() {
  const [period, setPeriod] = useState<Period>("90d");
  const [platforms, setPlatforms] = useState<PlatformStatus[]>(disconnectedPlatforms);
  const [connectOpen, setConnectOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "info" } | null>(null);
  const { user, loading: authLoading, isConfigured: authConfigured } = useSupabaseAuth();
  const activeUserId = user?.id ?? demoCreatorUserId;
  const { data, refresh } = useCreatorOSData(activeUserId);
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const isPublicHome = location.pathname === "/";
  const isPrivacy = location.pathname === "/privacy";
  const isTerms = location.pathname === "/terms";
  const isCookies = location.pathname === "/cookies";
  const isDemoRoute = location.pathname === "/demo";
  const demoMode = new URLSearchParams(location.search).get("demo") === "1";
  const showTopbar = topbarRoutes.has(location.pathname);

  const resolvedData =
    authConfigured && user
      ? data?.source === "supabase"
        ? data
        : emptyCreatorOSData
      : data ?? fallbackCreatorOSData;
  const visibleData = { ...resolvedData, platforms };
  const connectedPlatforms = useMemo(() => platforms, [platforms]);

  useEffect(() => {
    if (authConfigured && user) {
      if (data?.source === "supabase") {
        setPlatforms(mergeWithSupportedPlatforms(data.platforms));
      } else {
        setPlatforms(disconnectedPlatforms);
      }
      return;
    }

    if (!authConfigured || demoMode) {
      setPlatforms(initialPlatforms);
    }
  }, [authConfigured, data, demoMode, user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const platformEvents = [
      { param: "youtube_connected", name: "YouTube" as const },
      { param: "tiktok_connected", name: "TikTok" as const },
    ];
    const triggered = platformEvents.find((event) => params.get(event.param) === "1");

    if (!triggered) return;

    refresh().then((result) => {
      const connectedAccount = result.platforms.find((platform) => platform.name === triggered.name && platform.connected);
      setToast({
        message: connectedAccount
          ? `${triggered.name} conectada correctamente.`
          : `La autorizacion se completo, pero ${triggered.name} no se guardo en Supabase.`,
        tone: connectedAccount ? "success" : "info",
      });
    });

    const next = new URL(window.location.href);
    next.searchParams.delete(triggered.param);
    window.history.replaceState({}, "", `${next.pathname}${next.search}`);
  }, [location.search, refresh]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function togglePlatform(name: PlatformStatus["name"]) {
    setPlatforms((state) => state.map((item) => (item.name === name ? { ...item, connected: !item.connected } : item)));
  }

  async function handlePlatformAction(platform: PlatformStatus) {
    if (platform.connected) {
      togglePlatform(platform.name);
      return;
    }

    if (platform.name === "YouTube") {
      await startYouTubeOAuth({
        redirectTo: `${window.location.origin}/settings`,
      });
      return;
    }

    if (platform.name === "TikTok") {
      await startTikTokOAuth({
        redirectTo: `${window.location.origin}/settings`,
      });
      return;
    }

    if (authConfigured && user && platform.name === "Instagram") {
      throw new Error("Instagram sera la siguiente integracion real. Ahora mismo ya puedes conectar YouTube y TikTok.");
    }

    togglePlatform(platform.name);
  }

  async function handleSync() {
    try {
      setSyncing(true);
      const connectedNames = new Set(platforms.filter((platform) => platform.connected).map((platform) => platform.name));

      if (!connectedNames.has("YouTube") && !connectedNames.has("TikTok")) {
        throw new Error("Conecta YouTube o TikTok antes de sincronizar.");
      }

      if (connectedNames.has("YouTube")) {
        await syncYouTube();
      }

      if (connectedNames.has("TikTok")) {
        await syncTikTok();
      }

      await refresh();
      setToast({ message: "Datos sincronizados desde las plataformas conectadas.", tone: "success" });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "No se pudieron sincronizar las plataformas.", tone: "info" });
    } finally {
      setSyncing(false);
    }
  }

  async function handleGoogleSignIn() {
    await signInWithGoogle(`${window.location.origin}/dashboard`);
  }

  async function handleEmailSignIn(email: string, password: string) {
    await signInWithPassword(email, password);
  }

  async function handleEmailSignUp(email: string, password: string) {
    return signUpWithEmail(email, password);
  }

  async function handlePasswordReset(email: string) {
    await sendPasswordReset(email);
  }

  async function handleSignOut() {
    try {
      await signOut();
      setToast({ message: "Sesion cerrada.", tone: "info" });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "No se pudo cerrar la sesion.", tone: "info" });
    }
  }

  if (authLoading) {
    return null;
  }

  if (authConfigured && !user && !isLogin && !demoMode) {
    if (!isPublicHome && !isPrivacy && !isTerms && !isCookies && !isDemoRoute) {
      return <Navigate to="/login" replace />;
    }
  }

  if (isPublicHome) {
    return <PublicHome />;
  }

  if (isPrivacy) {
    return <Privacy />;
  }

  if (isTerms) {
    return <Terms />;
  }

  if (isCookies) {
    return <Cookies />;
  }

  if (isDemoRoute) {
    return <Navigate to="/dashboard?demo=1" replace />;
  }

  if (isLogin) {
    return (
      <Login
        onGoogleSignIn={handleGoogleSignIn}
        onEmailSignIn={handleEmailSignIn}
        onEmailSignUp={handleEmailSignUp}
        onPasswordReset={handlePasswordReset}
        authEnabled={authConfigured}
      />
    );
  }

  return (
    <div className="app-shell min-h-screen text-ink">
      {toast && <Toast message={toast.message} tone={toast.tone} />}
      <div className="flex">
        <Sidebar platforms={connectedPlatforms} profile={visibleData.profile} />
        <div className="min-w-0 flex-1">
          {user && (
            <div className="px-4 pt-4 lg:px-8">
              <div className="flex justify-end">
                <AuthBadge email={user.email} onSignOut={handleSignOut} />
              </div>
            </div>
          )}
          {showTopbar && (
            <Topbar
              period={period}
              onPeriodChange={setPeriod}
              onOpenConnect={() => setConnectOpen(true)}
              onSync={handleSync}
              syncing={syncing}
              connectedCount={platforms.filter((platform) => platform.connected).length}
            />
          )}
          <MobileNav />
          <main className="page-enter px-4 py-5 pb-24 lg:px-8 lg:pb-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard period={period} platforms={platforms} data={visibleData} />} />
              <Route path="/content" element={<Content data={visibleData} />} />
              <Route path="/audience" element={<Audience data={visibleData} />} />
              <Route path="/insights" element={<Insights data={visibleData} />} />
              <Route
                path="/settings"
                element={<SettingsPage platforms={platforms} onPlatformAction={handlePlatformAction} profile={visibleData.profile} />}
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
      <ConnectModal open={connectOpen} platforms={platforms} onClose={() => setConnectOpen(false)} onPlatformAction={handlePlatformAction} />
    </div>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="px-4 py-3 lg:hidden">
        <button
          className="surface-panel flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-slate-700"
          onClick={() => setOpen(!open)}
        >
          <span className="flex items-center gap-2">
            <BarChart3 size={18} />
            MetricBrief
          </span>
          <span className="flex items-center gap-2 text-slate-500">
            <Menu size={17} />
            Navegacion
          </span>
        </button>
        {open && (
          <nav className="surface-panel mt-3 grid grid-cols-2 gap-2 rounded-2xl p-3">
            {mobileNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      isActive ? "bg-ink text-white" : "bg-white/70 text-slate-600"
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        )}
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
        <div className="surface-dark grid grid-cols-5 rounded-2xl px-2 py-2">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center rounded-xl px-1 text-[11px] font-semibold transition ${
                    isActive ? "bg-white text-ink" : "text-white/70"
                  }`
                }
              >
                <Icon size={17} />
                <span className="mt-1 truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
