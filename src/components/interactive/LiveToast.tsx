import { useState, useEffect } from 'react';

const ACTIVITIES = [
  { who: 'Cabinet Lefèvre', what: 'a mis à jour 8 dossiers', loc: 'Lyon' },
  { who: 'Comptaplus & Associés', what: 'a vérifié 47 clients', loc: 'Bordeaux' },
  { who: 'Cabinet Mercier', what: 'a signé 12 lettres', loc: 'Nantes' },
  { who: 'Fiducial Petit', what: 'a importé 86 SIREN', loc: 'Lille' },
  { who: 'Cabinet Roussel', what: 'a clôturé 3 revues', loc: 'Strasbourg' },
];

export default function LiveToast() {
  const [i, setI] = useState(-1);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let idx = -1;
    const cycle = () => {
      if (cancelled) return;
      idx = (idx + 1) % ACTIVITIES.length;
      setI(idx);
      setVisible(true);
      setTimeout(() => { if (!cancelled) setVisible(false); }, 4500);
      setTimeout(() => { if (!cancelled) cycle(); }, 7500);
    };
    const t = setTimeout(cycle, 3500);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);
  if (i < 0) return null;
  const a = ACTIVITIES[i];
  return (
    <div
      className={`fixed bottom-6 left-6 z-40 max-w-[300px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[.08] shadow-xl p-3.5 flex items-start gap-3 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}
    >
      <span className="relative flex w-2 h-2 mt-1.5">
        <span className="absolute inset-0 rounded-full live-pulse" style={{ background: 'var(--grimy)' }} />
        <span className="relative inline-flex w-2 h-2 rounded-full" style={{ background: 'var(--grimy)' }} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] text-slate-900 dark:text-white">
          <strong className="font-semibold">{a.who}</strong> {a.what}
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          {a.loc} &middot; à l'instant
        </div>
      </div>
    </div>
  );
}
