import { LogOut } from "lucide-react";

export function AuthBadge({
  email,
  onSignOut,
}: {
  email?: string | null;
  onSignOut: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-800">{email ?? "Sesion activa"}</p>
        <p className="text-xs text-slate-400">Supabase Auth</p>
      </div>
      <button className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800" onClick={onSignOut}>
        <LogOut size={16} />
      </button>
    </div>
  );
}
