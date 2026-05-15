import { useState, useEffect, useRef, useMemo } from 'react';

function useCountUp(target: number, duration = 1100): [React.RefObject<HTMLDivElement | null>, number] {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    let raf: number;
    const startAnim = (t0: number) => {
      started.current = true;
      const tick = (t: number) => {
        const p = Math.min((t - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(target * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const check = () => {
      if (started.current || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      if (r.top < window.innerHeight - 40 && r.bottom > 0) startAnim(performance.now());
    };
    check();
    const id = setInterval(() => { if (!started.current) check(); else clearInterval(id); }, 150);
    return () => { clearInterval(id); cancelAnimationFrame(raf); };
  }, [target, duration]);
  return [ref, val];
}

const Ic = {
  lock: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  search: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  plus: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  alert: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>,
};

const sidebarItems = [
  ['Tableau de bord', false],
  ['Clients', true],
  ['Lettres de mission', false, '24'],
  ['Revue périodique', false, '7'],
  ['Alertes dossiers', false, '2'],
  ['Vérification', false],
  ['Documents', false],
  ['Manuel interne LAB', false],
] as const;

function MiniKpi({ label, value, sub, pct, tone }: { label: string; value: number; sub: string; pct: number; tone: string }) {
  const [ref, v] = useCountUp(value, 1100);
  const map: Record<string, { txt: string; bar: string }> = {
    emerald: { txt: 'text-emerald-700 dark:text-emerald-400', bar: 'bg-emerald-500' },
    amber: { txt: 'text-amber-800 dark:text-amber-400', bar: 'bg-amber-500' },
    red: { txt: 'text-red-700 dark:text-red-400', bar: 'bg-red-500' },
    slate: { txt: 'text-slate-900 dark:text-white', bar: '' },
  };
  const m = map[tone];
  return (
    <div ref={ref} className="group rounded-lg border border-slate-200 dark:border-white/[.06] bg-white dark:bg-white/[.02] p-2.5 relative overflow-hidden card-lift">
      <div className="text-[9.5px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">{label}</div>
      <div className={`num text-[18px] font-bold mt-0.5 leading-tight tracking-tight ${m.txt}`}>{Math.round(v)}</div>
      <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{sub}</div>
      {m.bar && (
        <div className="absolute left-0 right-0 bottom-0 h-[3px] bg-slate-100 dark:bg-white/[.04]">
          <div className={`h-full bar-fill ${m.bar}`} style={{ width: `${pct}%`, animationDelay: '.4s' }} />
        </div>
      )}
    </div>
  );
}

export default function HeroClientsDashboard() {
  const baseClients = useMemo(() => [
    { name: 'CARRELAGES MOREAU SAS', siren: '821 456 789', score: 36, level: 'standard', vig: 'Standard', status: 'À jour', updated: 'il y a 3j', flag: false },
    { name: 'Hôtel Belle-Vue', siren: '503 219 884', score: 62, level: 'renforcee', vig: 'Renforcée', status: 'À revoir', updated: 'il y a 8j', flag: true },
    { name: 'BERNARD CONSULTING', siren: '892 145 008', score: 8, level: 'standard', vig: 'Standard', status: 'À jour', updated: 'il y a 1j', flag: false },
    { name: 'Café des Sports — Mme Lopez', siren: '441 002 318', score: 79, level: 'renforcee', vig: 'Renforcée', status: 'En cours', updated: "aujourd'hui", flag: false },
    { name: 'NEGOCE INTERNATIONAL FR', siren: '304 882 005', score: 55, level: 'renforcee', vig: 'Renforcée', status: 'À revoir', updated: 'il y a 2j', flag: false },
    { name: 'Pharmacie de la Place', siren: '772 561 408', score: 21, level: 'standard', vig: 'Standard', status: 'À jour', updated: 'il y a 5j', flag: false },
  ], []);

  const [scores, setScores] = useState(baseClients.map(c => c.score));
  const [highlight, setHighlight] = useState(-1);
  useEffect(() => {
    const t = setInterval(() => {
      const i = Math.floor(Math.random() * baseClients.length);
      setScores(prev => {
        const next = [...prev];
        const drift = (Math.random() - 0.5) * 6;
        next[i] = Math.max(5, Math.min(95, Math.round(next[i] + drift)));
        return next;
      });
      setHighlight(i);
      setTimeout(() => setHighlight(-1), 1200);
    }, 3200);
    return () => clearInterval(t);
  }, [baseClients]);

  const lvlPill: Record<string, string> = {
    standard: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
    renforcee: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20',
  };
  const statusDot: Record<string, string> = { 'À jour': 'bg-emerald-500', 'À revoir': 'bg-amber-500', 'En cours': 'bg-slate-400', 'Retard': 'bg-red-500' };

  return (
    <div className="relative">
      {/* floating chips */}
      <div className="hidden lg:flex absolute -top-4 -left-4 items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[.08] rounded-full px-3 py-1.5 shadow-md z-10">
        <span className="relative flex w-1.5 h-1.5">
          <span className="absolute inset-0 rounded-full live-pulse" style={{ background: 'var(--grimy)' }} />
          <span className="relative inline-flex w-1.5 h-1.5 rounded-full" style={{ background: 'var(--grimy)' }} />
        </span>
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Tableau de bord live</span>
      </div>
      <div className="hidden lg:flex absolute -bottom-3 -right-3 items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[.08] rounded-full px-3 py-1.5 shadow-md z-10">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">128 dossiers</span>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 mock-shadow border border-slate-200 dark:border-white/[.06] overflow-hidden">
        {/* browser chrome */}
        <div className="flex items-center gap-2 px-3.5 py-2 border-b border-slate-200 dark:border-white/[.06] bg-slate-50/50 dark:bg-white/[.02]">
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/15" />
          <div className="ml-2 flex-1 text-[10.5px] text-slate-500 dark:text-slate-400 bg-white dark:bg-white/[.04] border border-slate-200 dark:border-white/[.06] rounded-md px-2 py-0.5 num flex items-center gap-1.5">
            {Ic.lock}
            app.grimy.fr/clients
          </div>
          <div className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <span className="relative flex w-1.5 h-1.5"><span className="absolute inset-0 rounded-full bg-emerald-500 live-pulse" /><span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" /></span>
            LIVE
          </div>
        </div>

        <div className="flex">
          {/* sidebar */}
          <aside className="w-[140px] flex-shrink-0 border-r border-slate-200 dark:border-white/[.06] bg-[#FAFAF7] dark:bg-[#0F1729] p-2 hidden sm:block">
            <div className="px-1.5 py-1.5 mb-2">
              <span className="wordmark text-[13px] text-slate-900 dark:text-white">GRIMY<span className="grimy-dot" /></span>
            </div>
            {sidebarItems.map(([label, active, badge], i) => (
              <a key={i} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] mb-0.5 transition ${active ? 'bg-white dark:bg-white/[.06] text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-white/[.04]' : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/[.03]'}`}>
                <span className="flex-1 truncate">{label}</span>
                {badge && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md text-white" style={{ background: 'var(--grimy-dark)' }}>{badge}</span>}
              </a>
            ))}
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-200 dark:border-white/[.06] gap-2">
              <div className="min-w-0">
                <h3 className="text-[14px] font-semibold text-slate-900 dark:text-white tracking-tight leading-tight">Clients</h3>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight truncate">128 dossiers &middot; 4 à revoir &middot; 1 en retard</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="hidden xl:flex items-center gap-1.5 bg-slate-50 dark:bg-white/[.04] border border-slate-200 dark:border-white/[.06] rounded-md px-2 py-1 text-[10.5px] text-slate-500 dark:text-slate-400">
                  {Ic.search}
                  <span>Rechercher…</span>
                  <kbd className="ml-1 px-1 py-0.5 border border-slate-200 dark:border-white/[.08] rounded text-[9px]">⌘K</kbd>
                </div>
                <button className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-white px-2 py-1 rounded-md transition hover:opacity-95 active:translate-y-px" style={{ background: 'var(--grimy-dark)' }}>
                  {Ic.plus} Nouveau
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 px-3.5 py-2.5">
              <MiniKpi label="Conformes" value={124} sub="+3" pct={97} tone="emerald" />
              <MiniKpi label="À revoir" value={4} sub="↑ 1" pct={18} tone="amber" />
              <MiniKpi label="Renforcées" value={7} sub="stable" pct={28} tone="red" />
              <MiniKpi label="Lettres" value={116} sub="91 %" pct={91} tone="slate" />
            </div>

            <div className="px-3.5 pb-3.5">
              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/[.06]">
                <table className="w-full text-[11px]">
                  <thead className="bg-slate-50/70 dark:bg-white/[.02]">
                    <tr className="text-left text-[9.5px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                      <th className="px-2.5 py-1.5">Client</th>
                      <th className="px-2.5 py-1.5 hidden md:table-cell">SIREN</th>
                      <th className="px-2.5 py-1.5">Score</th>
                      <th className="px-2.5 py-1.5">Vigilance</th>
                      <th className="px-2.5 py-1.5 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/[.04]">
                    {baseClients.map((c, i) => (
                      <tr key={i} className={`row-hover ${highlight === i ? 'highlight-row' : ''}`}>
                        <td className="px-2.5 py-1.5 text-slate-900 dark:text-white font-medium">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="truncate">{c.name}</span>
                            {c.flag && Ic.alert}
                          </div>
                        </td>
                        <td className="px-2.5 py-1.5 text-slate-500 dark:text-slate-400 num hidden md:table-cell">{c.siren}</td>
                        <td className="px-2.5 py-1.5 num font-semibold text-slate-700 dark:text-slate-200">
                          <span key={scores[i]} className={highlight === i ? 'count-flip inline-block' : 'inline-block'}>{scores[i]}/100</span>
                        </td>
                        <td className="px-2.5 py-1.5">
                          <span className={`inline-block px-1.5 py-0.5 rounded-md text-[9.5px] font-semibold border ${lvlPill[c.level]}`}>{c.vig}</span>
                        </td>
                        <td className="px-2.5 py-1.5 text-right">
                          <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 text-[10.5px] whitespace-nowrap">
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDot[c.status]}`} />
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
