import { useState, useEffect } from 'react';

const heroSources = [
  { name: 'INPI', state: 'ok', delay: 180 },
  { name: 'Pappers', state: 'ok', delay: 320 },
  { name: 'BODACC', state: 'ok', delay: 460 },
  { name: 'OpenSanctions', state: 'ok', delay: 620 },
  { name: 'DG Trésor', state: 'ok', delay: 780 },
  { name: 'PEP', state: 'warn', delay: 940 },
  { name: 'Infogreffe', state: 'ok', delay: 1080 },
  { name: 'IBAN', state: 'ok', delay: 1220 },
  { name: 'OFAC', state: 'ok', delay: 1380 },
];

const stMap = {
  ok: { dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', ring: 'border-emerald-200 dark:border-emerald-500/20' },
  warn: { dot: 'bg-amber-500', text: 'text-amber-800 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', ring: 'border-amber-200 dark:border-amber-500/20' },
};

export default function HeroDemo() {
  const [siren, setSiren] = useState('552 081 317');
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(-1);
  const [userClicked, setUserClicked] = useState(false);

  const runDemo = () => {
    setRunning(true);
    setCompleted(-1);
    heroSources.forEach((s, i) => setTimeout(() => setCompleted(i), s.delay));
    setTimeout(() => setRunning(false), heroSources[heroSources.length - 1].delay + 300);
  };

  const handleUserLaunch = () => {
    setUserClicked(true);
    runDemo();
  };

  // Auto-launch on mount
  useEffect(() => {
    const t = setTimeout(runDemo, 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative">
      {/* floating chips */}
      <div className="hidden lg:flex absolute -top-4 -left-4 items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[.08] rounded-full px-3 py-1.5 shadow-md z-10">
        <span className="relative flex w-1.5 h-1.5">
          <span className="absolute inset-0 rounded-full live-pulse" style={{ background: 'var(--grimy)' }} />
          <span className="relative inline-flex w-1.5 h-1.5 rounded-full" style={{ background: 'var(--grimy)' }} />
        </span>
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Démo en direct</span>
      </div>
      <div className="hidden lg:flex absolute -bottom-3 -right-3 items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[.08] rounded-full px-3 py-1.5 shadow-md z-10">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Rapport archivé</span>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 mock-shadow border border-slate-200 dark:border-white/[.06] overflow-hidden">
        {/* chrome */}
        <div className="flex items-center gap-2 px-3.5 py-2 border-b border-slate-200 dark:border-white/[.06] bg-slate-50/50 dark:bg-white/[.02]">
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/15" />
          <div className="ml-2 flex-1 text-[10.5px] text-slate-500 dark:text-slate-400 bg-white dark:bg-white/[.04] border border-slate-200 dark:border-white/[.06] rounded-md px-2 py-0.5 num flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            app.grimy.fr/verifier
          </div>
        </div>

        <div className="p-5">
          <div className="text-[11px] uppercase tracking-wider font-bold mb-2" style={{ color: 'var(--grimy-dark)' }}>Vérifier un client</div>
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              <input
                aria-label="Numéro SIREN à vérifier"
                value={siren}
                onChange={(e) => setSiren(e.target.value)}
                className="num w-full pl-9 pr-3 py-2.5 text-[13.5px] bg-slate-50 dark:bg-white/[.04] border border-slate-200 dark:border-white/[.08] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': 'var(--grimy)' } as React.CSSProperties}
              />
            </div>
            <button
              onClick={handleUserLaunch}
              disabled={running}
              className={`relative inline-flex items-center gap-1.5 text-[13px] font-semibold text-white px-4 py-2.5 rounded-lg btn-magnetic disabled:opacity-60 ${!userClicked && !running ? 'cta-attract' : ''}`}
            >
              {running ? (
                <span className="w-3 h-3 border-2 border-white border-r-transparent rounded-full animate-spin" />
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              )}
              {running ? 'Analyse…' : 'Vérifier'}
            </button>
          </div>

          {/* Sources grid */}
          <div className="grid grid-cols-3 gap-1.5">
            {heroSources.map((s, i) => {
              const st = stMap[s.state as keyof typeof stMap];
              const done = completed >= i;
              const cur = running && completed + 1 === i;
              return (
                <div
                  key={i}
                  className={`relative rounded-md border px-2 py-1.5 h-[30px] flex items-center transition-all duration-300 ${done ? `${st.bg} ${st.ring}` : 'bg-slate-50 dark:bg-white/[.02] border-slate-200 dark:border-white/[.06]'}`}
                  style={{ opacity: done || !running ? 1 : cur ? 0.9 : 0.35 }}
                >
                  {cur && (
                    <span className="absolute inset-0 rounded-md border-2 ring-scan pointer-events-none" style={{ borderColor: 'var(--grimy)' }} />
                  )}
                  <div className="flex items-center gap-1.5 min-w-0">
                    {done && <span className={`w-1.5 h-1.5 rounded-full ${st.dot} flex-shrink-0`} />}
                    {cur && <span className="w-2.5 h-2.5 border-[1.5px] border-current border-r-transparent rounded-full animate-spin flex-shrink-0" style={{ color: 'var(--grimy-dark)' }} />}
                    {!done && !cur && <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/15 flex-shrink-0" />}
                    <span className={`text-[11px] font-semibold whitespace-nowrap truncate ${done ? st.text : 'text-slate-500 dark:text-slate-400'}`}>{s.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer summary */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[.06] flex items-center justify-between text-[11.5px]">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              {!running && completed >= heroSources.length - 1 ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                  <span><span className="font-semibold text-emerald-700 dark:text-emerald-400">9 sources OK</span> &middot; 1 point d'attention</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full live-pulse" style={{ background: 'var(--grimy)' }} />
                  <span>Interrogation des bases…</span>
                </>
              )}
            </div>
            <span className="num text-slate-500 dark:text-slate-400">~ 3 s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
