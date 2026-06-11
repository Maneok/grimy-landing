import { useState, useEffect, useRef, useMemo } from 'react';

function useCountUp(target: number, duration = 1100): [React.RefObject<HTMLDivElement | null>, number] {
  const [val, setVal] = useState(target);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let started = false;

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !started) {
          started = true;
          io.disconnect();
          setVal(0);
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min((t - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(p < 1 ? target * eased : target);
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      }
    }, { rootMargin: '0px 0px -40px 0px' });

    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, duration]);

  return [ref, val];
}

const Ic = {
  lock: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400 flex-shrink-0"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  search: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  plus: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M12 5v14M5 12h14"/></svg>,
  alert: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 flex-shrink-0"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>,
  shield: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  clock: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

const sidebarItems = [
  ['Tableau de bord', false],
  ['Clients', true],
  ['Lettres', false, '24'],
  ['Revues', false, '7'],
  ['Alertes', false, '2'],
  ['Vérification', false],
  ['Documents', false],
  ['Manuel LAB', false],
] as const;

const scoreColor = (s: number) =>
  s < 35
    ? 'bg-emerald-500'
    : s < 65
    ? 'bg-amber-500'
    : 'bg-red-500';

const scoreTextColor = (s: number) =>
  s < 35
    ? 'text-emerald-700 dark:text-emerald-400'
    : s < 65
    ? 'text-amber-700 dark:text-amber-400'
    : 'text-red-700 dark:text-red-400';

function MiniKpi({ label, value, sub, pct, tone }: { label: string; value: number; sub: string; pct: number; tone: string }) {
  const [ref, v] = useCountUp(value, 1100);
  const map: Record<string, { txt: string; bar: string; sub: string }> = {
    emerald: { txt: 'text-emerald-700 dark:text-emerald-400', bar: 'bg-emerald-500', sub: 'text-emerald-600/80 dark:text-emerald-400/70' },
    amber: { txt: 'text-amber-800 dark:text-amber-400', bar: 'bg-amber-500', sub: 'text-amber-700/80 dark:text-amber-400/70' },
    red: { txt: 'text-red-700 dark:text-red-400', bar: 'bg-red-500', sub: 'text-red-600/80 dark:text-red-400/70' },
    slate: { txt: 'text-slate-900 dark:text-white', bar: 'bg-slate-400', sub: 'text-slate-500 dark:text-slate-400' },
  };
  const m = map[tone];
  return (
    <div ref={ref} className="group rounded-lg border border-slate-200 dark:border-white/[.06] bg-white dark:bg-white/[.02] px-3.5 pt-3 pb-3.5 relative overflow-hidden card-lift">
      <div className="text-[10px] uppercase tracking-[.08em] text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">{label}</div>
      <div className={`num text-[24px] font-bold mt-1 leading-none tracking-tight ${m.txt} tabular-nums`}>{Math.round(v)}</div>
      <div className={`text-[10.5px] mt-1.5 leading-tight truncate ${m.sub}`}>{sub}</div>
      <div className="absolute left-0 right-0 bottom-0 h-1 bg-slate-100 dark:bg-white/[.04]">
        <div className={`h-full bar-fill ${m.bar}`} style={{ width: `${pct}%`, animationDelay: '.4s' }} />
      </div>
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

  const rowTint = (c: typeof baseClients[number]) => {
    if (c.status === 'À revoir' && c.level === 'renforcee') return 'bg-red-50/50 dark:bg-red-500/[.04]';
    if (c.status === 'À revoir') return 'bg-amber-50/60 dark:bg-amber-500/[.04]';
    return '';
  };

  return (
    <div className="relative">
      {/* floating chip top-left */}
      <div className="hidden lg:flex absolute -top-4 -left-4 items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[.08] rounded-full px-3 py-1.5 shadow-md z-10">
        <span className="relative flex w-1.5 h-1.5">
          <span className="absolute inset-0 rounded-full live-pulse" style={{ background: 'var(--grimy)' }} />
          <span className="relative inline-flex w-1.5 h-1.5 rounded-full" style={{ background: 'var(--grimy)' }} />
        </span>
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tableau de bord live</span>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 mock-shadow border border-slate-200 dark:border-white/[.06] overflow-hidden">
        {/* browser chrome */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-slate-200 dark:border-white/[.06] bg-slate-50/60 dark:bg-white/[.02]">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/15" />
          <div className="ml-2 flex-1 min-w-0 text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-white/[.04] border border-slate-200 dark:border-white/[.06] rounded-md px-2.5 py-1 num flex items-center gap-1.5">
            {Ic.lock}
            <span className="truncate">app.grimy.fr/clients</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-emerald-700 dark:text-emerald-400 flex-shrink-0">
            <span className="relative flex w-1.5 h-1.5"><span className="absolute inset-0 rounded-full bg-emerald-500 live-pulse" /><span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" /></span>
            LIVE
          </div>
        </div>

        <div className="flex">
          {/* sidebar */}
          <aside className="flex-shrink-0 border-r border-slate-200 dark:border-white/[.06] bg-[#FAFAF7] dark:bg-[#0F1729] px-2.5 py-3 hidden md:block w-[160px] xl:w-[180px] xl:px-3">
            <div className="px-1.5 pb-3 mb-2 border-b border-slate-200/70 dark:border-white/[.04]">
              <span className="wordmark text-[14px] text-slate-900 dark:text-white">GRIMY<span className="grimy-dot" /></span>
            </div>

            {/* Cabinet card */}
            <div className="flex items-center gap-2 px-1.5 py-2 mb-3 rounded-lg bg-white dark:bg-white/[.04] border border-slate-200/70 dark:border-white/[.04]">
              <span className="flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--grimy), var(--grimy-dark))' }}>JM</span>
              <div className="min-w-0 leading-tight">
                <div className="text-[11px] font-semibold text-slate-900 dark:text-white truncate">Cabinet Lefèvre</div>
                <div className="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">Lyon · 3 collab.</div>
              </div>
            </div>

            <nav className="space-y-0.5">
              {sidebarItems.map(([label, active, badge], i) => (
                <a key={i} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] xl:text-[11.5px] transition ${active ? 'bg-white dark:bg-white/[.06] text-slate-900 dark:text-white font-semibold border border-slate-200 dark:border-white/[.04] shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/[.03]'}`}>
                  <span className="flex-1 truncate">{label}</span>
                  {badge && <span className="text-[9px] font-bold leading-none px-1.5 py-1 rounded-md text-white flex-shrink-0" style={{ background: 'var(--grimy-dark)' }}>{badge}</span>}
                </a>
              ))}
            </nav>
          </aside>

          <div className="flex-1 min-w-0">
            {/* page header */}
            <div className="flex items-start justify-between px-4 xl:px-5 py-3.5 border-b border-slate-200 dark:border-white/[.06] gap-3">
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white tracking-tight leading-tight">Clients</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">128 dossiers &middot; 4 à revoir &middot; 1 en retard</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="hidden xl:flex items-center gap-1.5 bg-slate-50 dark:bg-white/[.04] border border-slate-200 dark:border-white/[.06] rounded-md px-2.5 py-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {Ic.search}
                  <span>Rechercher…</span>
                  <kbd className="ml-2 px-1.5 py-0.5 border border-slate-200 dark:border-white/[.08] rounded text-[9.5px] font-medium tabular-nums">⌘K</kbd>
                </div>
                <button className="inline-flex items-center gap-1 text-[11px] font-semibold text-white px-2.5 py-1.5 rounded-md transition hover:opacity-95 active:translate-y-px whitespace-nowrap" style={{ background: 'var(--grimy-dark)' }}>
                  {Ic.plus} Nouveau
                </button>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 xl:gap-3 px-4 xl:px-5 py-3.5">
              <MiniKpi label="Conformes" value={124} sub="+3 cette sem." pct={97} tone="emerald" />
              <MiniKpi label="À revoir" value={4} sub="↑ 1 cette sem." pct={18} tone="amber" />
              <MiniKpi label="Renforcées" value={7} sub="stable" pct={28} tone="red" />
              <MiniKpi label="Lettres" value={116} sub="91 % signées" pct={91} tone="slate" />
            </div>

            {/* table */}
            <div className="px-4 xl:px-5 pb-4">
              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/[.06]">
                <table className="w-full table-fixed text-[12.5px]">
                  <colgroup>
                    <col className="w-[48%] sm:w-[46%] xl:w-[42%]" />
                    <col className="hidden xl:table-column xl:w-[18%]" />
                    <col className="w-[22%] xl:w-[18%]" />
                    <col className="w-[30%] sm:w-[32%] xl:w-[22%]" />
                  </colgroup>
                  <thead className="bg-slate-50 dark:bg-white/[.025]">
                    <tr className="text-left text-[10px] uppercase tracking-[.08em] text-slate-500 dark:text-slate-400 font-semibold">
                      <th className="pl-3 pr-2 py-3 whitespace-nowrap">Client</th>
                      <th className="px-2 py-3 whitespace-nowrap hidden xl:table-cell">SIREN</th>
                      <th className="px-2 py-3 whitespace-nowrap">Score</th>
                      <th className="pl-2 pr-3 py-3 whitespace-nowrap text-right">Vigilance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/[.04]">
                    {baseClients.map((c, i) => {
                      const score = scores[i];
                      const tint = rowTint(c);
                      return (
                        <tr
                          key={i}
                          className={`row-hover transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[.025] ${tint} ${highlight === i ? 'highlight-row' : ''}`}
                        >
                          <td className="pl-3 pr-2 py-3 text-slate-900 dark:text-white font-medium">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[c.status]}`}
                                role="img"
                                aria-label={`Statut : ${c.status}`}
                                title={c.status}
                              />
                              <span className="truncate">{c.name}</span>
                              {c.flag && Ic.alert}
                            </div>
                          </td>
                          <td className="px-2 py-3 text-slate-500 dark:text-slate-400 num tabular-nums whitespace-nowrap hidden xl:table-cell">{c.siren}</td>
                          <td className="px-2 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className={`num font-semibold tabular-nums text-[12.5px] ${scoreTextColor(score)}`}>
                                <span key={score} className={highlight === i ? 'count-flip inline-block' : 'inline-block'}>{score}</span>
                                <span className="text-slate-400 dark:text-slate-500 font-normal">/100</span>
                              </span>
                              <div className="hidden lg:block flex-1 min-w-[28px] max-w-[44px] h-1 rounded-full bg-slate-100 dark:bg-white/[.06] overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ease-out ${scoreColor(score)}`}
                                  style={{ width: `${Math.min(100, Math.max(4, score))}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="pl-2 pr-3 py-3 text-right">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10.5px] font-semibold border whitespace-nowrap ${lvlPill[c.level]}`}>{c.vig}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-between px-4 xl:px-5 py-2.5 border-t border-slate-200 dark:border-white/[.06] bg-slate-50/40 dark:bg-white/[.015] text-[10.5px] text-slate-500 dark:text-slate-400 gap-3">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap truncate">
                <span className="text-emerald-600 dark:text-emerald-400">{Ic.shield}</span>
                <span className="truncate"><span className="font-semibold text-slate-700 dark:text-slate-300">128 archivés</span> · conservation 5 ans · norme NPLAB</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
                {Ic.clock}
                Sync à l'instant
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
