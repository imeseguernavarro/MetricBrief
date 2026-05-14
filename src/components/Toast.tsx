type ToastProps = {
  message: string;
  tone?: "success" | "info";
};

export function Toast({ message, tone = "info" }: ToastProps) {
  const toneClass = tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-700";

  return (
    <div className={`fixed right-4 top-4 z-[60] rounded-2xl border px-4 py-3 text-sm font-semibold shadow-lg ${toneClass}`}>
      {message}
    </div>
  );
}
