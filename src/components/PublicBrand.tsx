import logo from "../assets/insighthub-logo.png";

export function PublicBrand({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className={compact ? "rounded-[24px] bg-[#171028] p-2 shadow-[0_20px_44px_rgba(14,12,28,0.18)]" : "rounded-[32px] bg-[#171028] p-4 shadow-[0_28px_60px_rgba(14,12,28,0.22)]"}>
      <img
        src={logo}
        alt="InsightHub"
        className={`w-full rounded-[20px] object-contain ${compact ? "max-w-[190px]" : "max-w-[420px]"}`}
      />
    </div>
  );
}
