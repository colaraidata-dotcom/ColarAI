const stats = [
  { value: '4', label: 'Profile types', sub: 'Child · Teen · Self-Control · Unrestricted' },
  { value: '10', label: 'Content categories', sub: 'Social · Adult · Gaming · Education…' },
  { value: '4', label: 'Platforms', sub: 'iOS · Android · macOS · Windows' },
  { value: '<5ms', label: 'DNS latency', sub: 'Decision made before page loads' },
];

export function StatsSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1A1A2E] border border-[#1A1A2E] rounded-2xl overflow-hidden bg-[#0D0D1A]">
          {stats.map((s, i) => (
            <div key={s.label} className={`px-8 py-8 ${i < stats.length - 1 ? '' : ''}`}>
              <p
                className="text-4xl font-bold mb-1 tabular-nums"
                style={{
                  background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}
              </p>
              <p className="text-sm font-medium text-[#CBD5E1] mb-1">{s.label}</p>
              <p className="text-xs text-[#475569]">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
