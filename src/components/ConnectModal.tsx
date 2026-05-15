import { useState } from "react";
import { CheckCircle2, Link2, Unlink } from "lucide-react";
import { Modal } from "./Modal";
import type { PlatformStatus } from "../data/mock";

export function ConnectModal({
  open,
  platforms,
  onClose,
  onPlatformAction,
}: {
  open: boolean;
  platforms: PlatformStatus[];
  onClose: () => void;
  onPlatformAction: (platform: PlatformStatus) => Promise<void> | void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(platform: PlatformStatus) {
    try {
      setError(null);
      setBusy(platform.name);
      await onPlatformAction(platform);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "No se pudo iniciar la conexion.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Modal title="Conectar plataformas" open={open} onClose={onClose}>
      <div className="space-y-3">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleAction(platform)}
            className="flex w-full items-center justify-between rounded-lg border border-line bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-crisp"
          >
            <span className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ background: platform.color }} />
              <span>
                <span className="block font-semibold">{platform.name}</span>
                <span className="text-sm text-slate-500">{platform.handle}</span>
              </span>
            </span>
            <span
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold ${
                platform.connected ? "bg-mint/10 text-emerald-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              {busy === platform.name ? (
                "Actualizando..."
              ) : platform.connected ? (
                <>
                  <Unlink size={15} /> Desconectar
                </>
              ) : (
                <>
                  <Link2 size={15} /> Conectar
                </>
              )}
            </span>
          </button>
        ))}
        {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <div className="mt-2 flex items-center gap-2 rounded-md bg-sky/10 px-3 py-2 text-sm text-blue-700">
          <CheckCircle2 size={16} />
          YouTube, TikTok y X ya pueden iniciar OAuth real via Supabase. Instagram sera la siguiente integracion real.
        </div>
      </div>
    </Modal>
  );
}
