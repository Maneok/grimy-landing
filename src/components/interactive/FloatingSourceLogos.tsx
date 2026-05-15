import { useEffect, useRef, useState } from 'react';

const OpenSanctionsMark = () => (
  <div className="flex items-center gap-2.5 select-none">
    <svg width="40" height="40" viewBox="0 0 64 64" className="flex-shrink-0 drop-shadow-[0_8px_14px_rgba(29,78,216,.25)]">
      <defs>
        <linearGradient id="osMarkBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2b6bff" />
          <stop offset="100%" stopColor="#0f4cdc" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#osMarkBg)" />
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
      <div className="text-[14px] font-bold text-[#1d4ed8] dark:text-blue-300">open</div>
      <div className="text-[14px] font-bold text-[#1d4ed8] dark:text-blue-300 -mt-0.5">sanctions</div>
    </div>
  </div>
);

const TresorMark = () => (
  <div className="flex flex-col items-center justify-center select-none">
    <div className="text-[24px] leading-none tracking-[.02em] font-black drop-shadow-[0_6px_10px_rgba(233,162,40,.25)]" style={{ color: '#e9a228', fontFamily: 'Georgia, "Times New Roman", serif' }}>TRÉSOR</div>
    <div className="mt-1 text-[9px] font-bold tracking-[.22em] text-[#1d3a8a] dark:text-blue-300">DIRECTION GÉNÉRALE</div>
  </div>
);

const DataGouvMark = () => (
  <div className="flex items-start gap-1 select-none">
    <div className="text-[26px] leading-none font-black tracking-[-.02em] text-[#1e1b6d] dark:text-indigo-200 drop-shadow-[0_6px_10px_rgba(30,27,109,.18)]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>datagouv</div>
    <svg width="14" height="14" viewBox="0 0 32 32" className="flex-shrink-0 mt-1">
      <g className="fill-[#1e1b6d] dark:fill-indigo-300">
        <polygon points="16,4 28,10 28,22 16,28 4,22 4,10" />
        <polygon points="16,4 28,10 16,16 4,10" fill="#0f0b4a" className="dark:fill-indigo-400" />
        <polygon points="16,16 28,10 28,22 16,28" fill="#15125e" className="dark:fill-indigo-500" />
      </g>
    </svg>
  </div>
);

const InpiMark = () => (
  <div className="flex items-center gap-2 select-none drop-shadow-[0_6px_12px_rgba(29,58,138,.18)]">
    <div className="flex flex-col gap-px items-end leading-none">
      <div className="flex h-3.5 gap-px">
        <span className="w-1.5 bg-[#1e3a8a] dark:bg-blue-400" />
        <span className="w-1.5 bg-white dark:bg-slate-200" />
        <span className="w-1.5 bg-[#dc2626] dark:bg-red-500" />
      </div>
      <div className="text-[6.5px] font-bold tracking-[.05em] text-slate-700 dark:text-slate-300 mt-0.5">RF</div>
    </div>
    <div className="h-10 w-px bg-slate-400/50 dark:bg-white/20" />
    <div className="flex flex-col items-start leading-none">
      <div className="text-[24px] font-black tracking-[-.02em] text-[#1d3a8a] dark:text-blue-200">inpi</div>
      <div className="mt-0.5 h-[2.5px] w-8 bg-teal-500 dark:bg-teal-400" />
    </div>
  </div>
);

const PappersMark = () => (
  <div className="select-none leading-none">
    <div className="text-[28px] font-black tracking-[-.01em] text-[#1e3a8a] dark:text-blue-200 drop-shadow-[0_6px_12px_rgba(30,58,138,.2)]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Pappers</div>
  </div>
);

type FloatingLogo = {
  id: string;
  render: () => React.ReactNode;
  pos: string;
  anim: number;
  delay: number;
};

const LOGOS: FloatingLogo[] = [
  { id: 'inpi', render: () => <InpiMark />, pos: 'top-[4%] left-[2%] lg:left-[4%]', anim: 0, delay: 0 },
  { id: 'pappers', render: () => <PappersMark />, pos: 'top-[10%] right-[3%] lg:right-[5%]', anim: 1, delay: 200 },
  { id: 'datagouv', render: () => <DataGouvMark />, pos: 'top-[58%] left-[0%] lg:left-[2%]', anim: 2, delay: 400 },
  { id: 'tresor', render: () => <TresorMark />, pos: 'top-[62%] right-[1%] lg:right-[3%]', anim: 3, delay: 600 },
  { id: 'opensanctions', render: () => <OpenSanctionsMark />, pos: 'bottom-[2%] left-[42%]', anim: 4, delay: 800 },
];

export default function FloatingSourceLogos() {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-20 hidden xl:block" aria-hidden="true">
      {LOGOS.map((logo) => (
        <div
          key={logo.id}
          className={`absolute ${logo.pos}`}
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? 'scale(1)' : 'scale(.7)',
            transition: `opacity .9s cubic-bezier(.2,.7,.2,1) ${logo.delay}ms, transform .9s cubic-bezier(.2,.7,.2,1) ${logo.delay}ms`,
          }}
        >
          <div className={`float-${logo.anim} drift-glow`}>
            {logo.render()}
          </div>
        </div>
      ))}

      <style>{`
        @keyframes float-0 {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          25%     { transform: translate(6px,-10px) rotate(1.6deg); }
          50%     { transform: translate(-4px,-18px) rotate(-1deg); }
          75%     { transform: translate(-8px,-8px) rotate(.8deg); }
        }
        @keyframes float-1 {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          33%     { transform: translate(-10px,-12px) rotate(-1.8deg); }
          66%     { transform: translate(8px,-6px) rotate(1.4deg); }
        }
        @keyframes float-2 {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          20%     { transform: translate(8px,-8px) rotate(1deg); }
          50%     { transform: translate(12px,-14px) rotate(2.2deg); }
          80%     { transform: translate(4px,-4px) rotate(.6deg); }
        }
        @keyframes float-3 {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          30%     { transform: translate(-8px,-14px) rotate(-1.4deg); }
          60%     { transform: translate(6px,-10px) rotate(1deg); }
          85%     { transform: translate(-2px,-4px) rotate(-.4deg); }
        }
        @keyframes float-4 {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          25%     { transform: translate(-6px,-12px) rotate(1.2deg); }
          55%     { transform: translate(10px,-18px) rotate(-1.8deg); }
          80%     { transform: translate(4px,-6px) rotate(.6deg); }
        }
        .float-0 { animation: float-0 11s ease-in-out infinite; }
        .float-1 { animation: float-1 9.5s ease-in-out infinite .8s; }
        .float-2 { animation: float-2 12s ease-in-out infinite .4s; }
        .float-3 { animation: float-3 10.5s ease-in-out infinite 1.2s; }
        .float-4 { animation: float-4 13s ease-in-out infinite .6s; }
        .drift-glow { filter: drop-shadow(0 8px 24px rgba(13,33,68,.08)); }
        @media (prefers-reduced-motion: reduce) {
          .float-0, .float-1, .float-2, .float-3, .float-4 { animation: none; }
        }
      `}</style>
    </div>
  );
}
