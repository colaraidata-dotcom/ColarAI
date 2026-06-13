const platforms = [
  {
    name: 'iOS',
    status: 'Coming Soon',
    available: false,
    how: 'Network Extension',
    detail: 'Filters at the system level. No VPN icon visible to the user.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    name: 'Android',
    status: 'Coming Soon',
    available: false,
    how: 'VPN Service',
    detail: 'Local VPN intercepts DNS queries. No data leaves the device.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M17.523 15.341A7 7 0 0 0 19 11c0-3.868-3.133-7-7-7S5 7.132 5 11a7 7 0 0 0 1.477 4.341A2 2 0 0 0 5 17v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a2 2 0 0 0-1.477-1.659zM9 9h6v2H9V9zm0 4h6v2H9v-2z" />
      </svg>
    ),
  },
  {
    name: 'macOS',
    status: 'Coming Soon',
    available: false,
    how: 'Network Extension',
    detail: 'System-wide filtering. Works in all browsers and apps.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm-1 3v6l5 3-.75-1.3L14 13V7h-3z" />
      </svg>
    ),
  },
  {
    name: 'Windows',
    status: 'Coming Soon',
    available: false,
    how: 'DNS Configuration',
    detail: 'System DNS redirect. Compatible with all browsers.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25L10 13.4v6.81l10-1.4V13.25z" />
      </svg>
    ),
  },
];

export function PlatformSection() {
  return (
    <section className="py-24 border-t border-[#1A1A2E]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div>
            <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-3">Cross-Platform</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#F1F5F9] leading-tight">
              Works on every<br />device they own
            </h2>
          </div>
          <p className="text-[#64748B] max-w-xs text-sm leading-relaxed lg:text-right">
            One Guardian account covers the whole household. The same profile rules apply everywhere.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-[#1A1A2E] bg-[#0D0D1A] p-6 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-[#111120] border border-[#1A1A2E] flex items-center justify-center text-[#64748B]">
                  {p.icon}
                </div>
                <span className="text-[10px] font-medium text-[#475569] bg-[#111120] border border-[#1A1A2E] px-2 py-0.5 rounded-full">
                  {p.status}
                </span>
              </div>
              <div>
                <p className="font-semibold text-[#F1F5F9] mb-1">{p.name}</p>
                <p className="text-xs font-medium text-[#0EA5E9] mb-2">{p.how}</p>
                <p className="text-xs text-[#475569] leading-relaxed">{p.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Web dashboard — available now */}
        <div className="mt-4 rounded-2xl border border-[#0EA5E9]/20 bg-[#0EA5E9]/5 p-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#F1F5F9] mb-0.5">Web Dashboard</p>
            <p className="text-xs text-[#64748B]">Manage all profiles, view reports, approve requests — from any browser.</p>
          </div>
          <span className="text-xs font-medium text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-3 py-1 rounded-full shrink-0">
            Available now
          </span>
        </div>
      </div>
    </section>
  );
}
