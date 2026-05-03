import { useState, useEffect, useRef, useMemo } from 'react';

function useCountUp(target: number, duration = 1400): [React.RefObject<HTMLDivElement | null>, number] {
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
  lock: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  plus: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  alert: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>,
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

function KpiCard({ label, value, sub, pct, tone }: { label: string; value: number; sub: string; pct: number; tone: string }) {
  const [ref, v] = useCountUp(value, 1100);
  const map: Record<string, { txt: string; bar: string }> = {
    emerald: { txt: 'text-emerald-700 dark:text-emerald-400', bar: 'bg-emerald-500' },
    amber: { txt: 'text-amber-800 dark:text-amber-400', bar: 'bg-amber-500' },
    red: { txt: 'text-red-700 dark:text-red-400', bar: 'bg-red-500' },
    slate: { txt: 'text-slate-900 dark:text-white', bar: '' },
  };
  const m = map[tone];
  return (
    <div ref={ref} className="group rounded-lg border border-slate-200 dark:border-white/[.06] bg-white dark:bg-white/[.02] p-3 relative overflow-hidden card-lift">
      <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">{label}</div>
      <div className={`num text-[22px] font-bold mt-0.5 tracking-tight ${m.txt}`}>{Math.round(v)}</div>
      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{sub}</div>
      {m.bar && (
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-slate-100 dark:bg-white/[.04]">
          <div className={`h-full bar-fill ${m.bar}`} style={{ width: `${pct}%`, animationDelay: '.4s' }} />
        </div>
      )}
    </div>
  );
}

export default function DashboardSection() {
  const baseClients = useMemo(() => [
    { name: 'CARRELAGES MOREAU SAS', siren: '821 456 789', score: 32, level: 'standard', vig: 'Standard', status: 'À jour', updated: 'il y a 3j', flag: false },
    { name: 'Hôtel Belle-Vue', siren: '503 219 884', score: 58, level: 'standard', vig: 'Standard', status: 'À revoir', updated: 'il y a 8j', flag: true },
    { name: 'BERNARD CONSULTING', siren: '892 145 008', score: 24, level: 'standard', vig: 'Standard', status: 'À jour', updated: 'il y a 1j', flag: false },
    { name: 'Café des Sports — Mme Lopez', siren: '441 002 318', score: 78, level: 'renforcee', vig: 'Renforcée', status: 'En cours', updated: "aujourd'hui", flag: false },
    { name: 'NEGOCE INTERNATIONAL FR', siren: '304 882 005', score: 64, level: 'standard', vig: 'Standard', status: 'À revoir', updated: 'il y a 2j', flag: false },
    { name: 'Pharmacie de la Place', siren: '772 561 408', score: 19, level: 'standard', vig: 'Standard', status: 'À jour', updated: 'il y a 5j', flag: false },
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
    simplifiee: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
    standard: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
    renforcee: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20',
  };
  const statusDot: Record<string, string> = { 'À jour': 'bg-emerald-500', 'À revoir': 'bg-amber-500', 'En cours': 'bg-slate-400', 'Retard': 'bg-red-500' };

  return (
    <section id="produit" className="max-w-[1280px] mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-12 gap-10 items-end mb-12">
        <div className="lg:col-span-7 reveal">
          <div className="text-[12px] font-semibold uppercase tracking-[.18em] mb-3" style={{ color: 'var(--grimy-dark)' }}>01 — Tableau de bord</div>
          <h2 className="wordmark text-[44px] leading-[1.05] tracking-[-.035em] text-slate-900 dark:text-white text-balance">
            100 clients sous les yeux.<br/>En 1 clic.
          </h2>
        </div>
        <div className="lg:col-span-5 reveal">
          <p className="text-[16px] leading-[1.6] text-slate-600 dark:text-slate-300">
            Score de risque dynamique recalculé à chaque modification de SIREN, dirigeant, ou seuil de chiffre d'affaires.
            Les clients à revoir remontent en haut, automatiquement.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 mock-shadow overflow-hidden border border-slate-200 dark:border-white/[.06] reveal">
        {/* browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 dark:border-white/[.06] bg-slate-50/50 dark:bg-white/[.02]">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/15" />
          <div className="ml-3 flex-1 max-w-md text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-white/[.04] border border-slate-200 dark:border-white/[.06] rounded-md px-2.5 py-1 num flex items-center gap-2">
            {Ic.lock} app.grimy.fr/clients
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <span className="relative flex w-1.5 h-1.5"><span className="absolute inset-0 rounded-full bg-emerald-500 live-pulse" /><span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" /></span>
            LIVE
          </div>
        </div>

        <div className="flex">
          {/* sidebar */}
          <aside className="w-[210px] flex-shrink-0 border-r border-slate-200 dark:border-white/[.06] bg-[#FAFAF7] dark:bg-[#0F1729] p-3 hidden md:block">
            <div className="px-2 py-2 mb-3">
              <span className="wordmark text-[16px] text-slate-900 dark:text-white">GRIMY<span className="grimy-dot" /></span>
            </div>
            {sidebarItems.map(([label, active, badge], i) => (
              <a key={i} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] mb-0.5 transition ${active ? 'bg-white dark:bg-white/[.06] text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-white/[.04]' : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/[.03]'}`}>
                <span className="flex-1">{label}</span>
                {badge && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white" style={{ background: 'var(--grimy-dark)' }}>{badge}</span>}
              </a>
            ))}
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/[.06]">
              <div>
                <h3 className="text-[18px] font-semibold text-slate-900 dark:text-white tracking-tight">Clients</h3>
                <p className="text-[12px] text-slate-500 dark:text-slate-400">128 dossiers &middot; 4 à revoir &middot; 1 en retard</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-2 bg-slate-50 dark:bg-white/[.04] border border-slate-200 dark:border-white/[.06] rounded-md px-2.5 py-1.5 text-[12px] text-slate-500 dark:text-slate-400 w-56">
                  {Ic.search}
                  <span>Rechercher un client...</span>
                  <span className="ml-auto inline-flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500"><kbd className="px-1.5 py-0.5 border border-slate-200 dark:border-white/[.08] rounded text-[9.5px]">⌘K</kbd></span>
                </div>
                <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white px-3 py-1.5 rounded-md transition hover:opacity-95 active:translate-y-px" style={{ background: 'var(--grimy-dark)' }}>
                  {Ic.plus} Nouveau client
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 px-6 py-4">
              <KpiCard label="Conformes" value={124} sub="+3 cette semaine" pct={97} tone="emerald" />
              <KpiCard label="À revoir" value={4} sub="↑ 1" pct={18} tone="amber" />
              <KpiCard label="Renforcées" value={7} sub="stable" pct={28} tone="red" />
              <KpiCard label="Lettres signées" value={116} sub="/ 128 — 91 %" pct={91} tone="slate" />
            </div>

            <div className="px-6 pb-6">
              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/[.06]">
                <table className="w-full text-[13px]">
                  <thead className="bg-slate-50/70 dark:bg-white/[.02]">
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                      <th className="px-4 py-2.5">Client</th>
                      <th className="px-4 py-2.5">SIREN</th>
                      <th className="px-4 py-2.5">Score</th>
                      <th className="px-4 py-2.5">Vigilance</th>
                      <th className="px-4 py-2.5">Statut</th>
                      <th className="px-4 py-2.5 text-right">MAJ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/[.04]">
                    {baseClients.map((c, i) => (
                      <tr key={i} className={`row-hover ${highlight === i ? 'highlight-row' : ''}`}>
                        <td className="px-4 py-2.5 text-slate-900 dark:text-white font-medium">
                          <div className="flex items-center gap-2">{c.name}{c.flag && Ic.alert}</div>
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400 num">{c.siren}</td>
                        <td className="px-4 py-2.5 num font-semibold text-slate-700 dark:text-slate-200">
                          <span key={scores[i]} className={highlight === i ? 'count-flip inline-block' : 'inline-block'}>{scores[i]}/100</span>
                        </td>
                        <td className="px-4 py-2.5"><span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold border ${lvlPill[c.level]}`}>{c.vig}</span></td>
                        <td className="px-4 py-2.5"><span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300"><span className={`w-1.5 h-1.5 rounded-full ${statusDot[c.status]}`} />{c.status}</span></td>
                        <td className="px-4 py-2.5 text-right text-slate-500 dark:text-slate-400">{c.updated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
