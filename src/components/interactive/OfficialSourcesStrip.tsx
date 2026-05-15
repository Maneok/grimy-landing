import { useEffect, useRef, useState } from 'react';

type Logo = {
  id: string;
  label: string;
  href: string;
  badge?: string;
  render: () => React.ReactNode;
};

const OpenSanctionsLogo = () => (
  <div className="flex items-center gap-2.5 px-1">
    <svg width="34" height="34" viewBox="0 0 64 64" className="flex-shrink-0">
      <defs>
        <linearGradient id="osBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2b6bff" />
          <stop offset="100%" stopColor="#0f4cdc" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="12" fill="url(#osBg)" />
      <g fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="22" cy="32" r="7" />
        <circle cx="42" cy="32" r="7" />
        <circle cx="32" cy="20" r="6" />
        <circle cx="32" cy="44" r="6" />
        <line x1="27" y1="28" x2="37" y2="28" />
        <line x1="27" y1="36" x2="37" y2="36" />
      </g>
    </svg>
    <div className="leading-[1.05]">
      <div className="text-[13.5px] font-bold text-[#1d4ed8] dark:text-blue-300">open</div>
      <div className="text-[13.5px] font-bold text-[#1d4ed8] dark:text-blue-300 -mt-0.5">sanctions</div>
    </div>
  </div>
);

const TresorLogo = () => (
  <div className="flex flex-col items-center justify-center px-1">
    <div className="text-[18px] leading-none tracking-[.02em] font-black" style={{ color: '#e9a228', fontFamily: 'Georgia, "Times New Roman", serif' }}>TRÉSOR</div>
    <div className="mt-1 text-[8px] font-bold tracking-[.18em] text-[#1d3a8a] dark:text-blue-300">DIRECTION GÉNÉRALE</div>
  </div>
);

const DataGouvLogo = () => (
  <div className="flex items-center gap-1.5 px-1">
    <div className="text-[19px] leading-none font-black tracking-[-.02em] text-[#1e1b6d] dark:text-indigo-200" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>datagouv</div>
    <svg width="14" height="14" viewBox="0 0 32 32" className="flex-shrink-0 -mt-3">
      <g fill="#1e1b6d" className="dark:fill-indigo-300">
        <polygon points="16,4 28,10 28,22 16,28 4,22 4,10" opacity="0.95" />
        <polygon points="16,4 28,10 16,16 4,10" fill="#1e1b6d" opacity="0.7" className="dark:fill-indigo-400" />
        <polygon points="16,16 28,10 28,22 16,28" fill="#1e1b6d" opacity="0.5" className="dark:fill-indigo-500" />
      </g>
    </svg>
  </div>
);

const InpiLogo = () => (
  <div className="flex items-center gap-2 px-1">
    <div className="flex flex-col gap-px items-end leading-none">
      <div className="flex h-3 gap-px">
        <span className="w-1.5 bg-[#1e3a8a] dark:bg-blue-400" />
        <span className="w-1.5 bg-white border border-slate-200 dark:bg-slate-200 dark:border-slate-400" />
        <span className="w-1.5 bg-[#dc2626] dark:bg-red-500" />
      </div>
      <div className="text-[6px] font-bold tracking-[.05em] text-slate-700 dark:text-slate-200 mt-0.5">RF</div>
    </div>
    <div className="h-9 w-px bg-slate-300 dark:bg-white/15" />
    <div className="flex flex-col items-start leading-none">
      <div className="text-[20px] font-black tracking-[-.02em] text-[#1d3a8a] dark:text-blue-200">inpi</div>
      <div className="mt-0.5 h-[2px] w-7 bg-teal-500 dark:bg-teal-400" />
    </div>
  </div>
);

const PappersLogo = () => (
  <div className="px-1 leading-none">
    <div className="text-[22px] font-black tracking-[-.01em] text-[#1e3a8a] dark:text-blue-200" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Pappers</div>
  </div>
);

const LOGOS: Logo[] = [
  { id: 'inpi', label: 'INPI', href: 'https://www.inpi.fr', badge: 'Registre national', render: () => <InpiLogo /> },
  { id: 'pappers', label: 'Pappers', href: 'https://www.pappers.fr', badge: 'Données légales', render: () => <PappersLogo /> },
  { id: 'datagouv', label: 'data.gouv.fr', href: 'https://www.data.gouv.fr', badge: 'Open data État', render: () => <DataGouvLogo /> },
  { id: 'tresor', label: 'DG Trésor', href: 'https://www.tresor.economie.gouv.fr', badge: 'Sanctions FR', render: () => <TresorLogo /> },
  { id: 'opensanctions', label: 'OpenSanctions', href: 'https://www.opensanctions.org', badge: 'Sanctions monde', render: () => <OpenSanctionsLogo /> },
];

export default function OfficialSourcesStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [pingIdx, setPingIdx] = useState(-1);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setEntered(true); io.disconnect(); } });
    }, { rootMargin: '-40px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!entered) return;
    let i = 0;
    const tick = () => {
      setPingIdx(i % LOGOS.length);
      i++;
      setTimeout(() => setPingIdx(-1), 700);
    };
    const initial = setTimeout(tick, 1600);
    const id = setInterval(tick, 2400);
    return () => { clearTimeout(initial); clearInterval(id); };
  }, [entered]);

  return (
    <div ref={ref} className="mt-16 lg:mt-20">
      <div className="flex items-center gap-3 mb-6">
        <span className="relative flex w-2 h-2 flex-shrink-0">
          <span className="absolute inset-0 rounded-full bg-emerald-500 live-pulse" />
          <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[11px] uppercase tracking-[.18em] font-bold text-slate-600 dark:text-slate-400">Connecté en direct aux registres officiels</span>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {LOGOS.map((logo, i) => {
          const isPinging = pingIdx === i;
          return (
            <a
              key={logo.id}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Source officielle : ${logo.label}`}
              className="group relative rounded-xl bg-white dark:bg-white/[.03] border border-slate-200 dark:border-white/[.06] px-3 py-4 flex flex-col items-center justify-center gap-2.5 h-[112px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-white/[.12] hover:shadow-[0_10px_30px_-12px_rgba(15,42,75,.18)]"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? 'translateY(0)' : 'translateY(14px)',
                transition: `opacity .6s cubic-bezier(.2,.7,.2,1) ${i * 90}ms, transform .6s cubic-bezier(.2,.7,.2,1) ${i * 90}ms, border-color .3s, box-shadow .3s`,
              }}
            >
              {/* live dot top-right */}
              <span className="absolute top-2 right-2 flex w-1.5 h-1.5">
                <span
                  className="absolute inset-0 rounded-full bg-emerald-500"
                  style={{
                    animation: isPinging ? 'sources-ping 700ms ease-out' : 'none',
                  }}
                />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </span>

              {/* logo */}
              <div className="flex-1 flex items-center justify-center w-full transition-transform duration-300 group-hover:scale-[1.04]">
                {logo.render()}
              </div>

              {/* sub-label */}
              <div className="text-[10px] font-semibold uppercase tracking-[.1em] text-slate-500 dark:text-slate-400 text-center whitespace-nowrap">
                {logo.badge}
              </div>

              {/* scan line on ping */}
              {isPinging && (
                <span
                  className="absolute inset-x-0 top-0 h-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent, color-mix(in oklab, var(--grimy) 28%, transparent), transparent)',
                    animation: 'sources-scan 700ms ease-out forwards',
                  }}
                />
              )}
            </a>
          );
        })}
      </div>

      <style>{`
        @keyframes sources-ping { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(3.4); opacity: 0; } }
        @keyframes sources-scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}
