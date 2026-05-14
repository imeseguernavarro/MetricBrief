export function HubLogo({
  size = 46,
  rounded = 14,
}: {
  size?: number;
  rounded?: number;
}) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="hub-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="64" height="64" rx={rounded * (64 / size)} fill="url(#hub-gradient)" />
      <g fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round">
        <line x1="32" y1="32" x2="32" y2="14" />
        <line x1="32" y1="32" x2="50" y2="22" />
        <line x1="32" y1="32" x2="50" y2="42" />
        <line x1="32" y1="32" x2="32" y2="50" />
        <line x1="32" y1="32" x2="14" y2="42" />
        <line x1="32" y1="32" x2="14" y2="22" />
      </g>
      <circle cx="32" cy="32" r="9" fill="#FFFFFF" />
      <circle cx="32" cy="12" r="4.5" fill="#FFFFFF" />
      <circle cx="51" cy="22" r="4.5" fill="#FFFFFF" />
      <circle cx="51" cy="42" r="4.5" fill="#FFFFFF" />
      <circle cx="32" cy="52" r="4.5" fill="#FFFFFF" />
      <circle cx="13" cy="42" r="4.5" fill="#FFFFFF" />
      <circle cx="13" cy="22" r="4.5" fill="#FFFFFF" />
    </svg>
  );
}
