import { useEffect, useState } from 'react';

const alertes = [
  { id: 1, type: 'critical', label: 'OFAC', text: 'Sanction détectée — DUPONT SARL', time: "à l'instant", color: '#ef4444' },
  { id: 2, type: 'warning', label: 'Dirigeant', text: 'Changement — CARRELAGES MOREAU', time: 'il y a 2 min', color: '#f59e0b' },
  { id: 3, type: 'success', label: 'Revue', text: 'Revue OK — Pharmacie Place', time: 'il y a 5 min', color: '#10b981' },
];

export default function AlertesLive() {
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    let timeouts: number[] = [];

    const cycle = () => {
      setVisible([]);

      alertes.forEach((_, i) => {
        timeouts.push(window.setTimeout(() => {
          setVisible((prev) => [...prev, i]);
        }, i * 700 + 400));
      });

      timeouts.push(window.setTimeout(cycle, 6000));
    };

    cycle();
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[.18em] font-bold text-slate-400 dark:text-slate-500">
          Activité en direct
        </span>
        <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          1 critique
        </span>
      </div>

      <div className="space-y-2">
        {alertes.map((alerte, i) => (
          <div
            key={alerte.id}
            className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50/80 dark:bg-white/[.02] border border-slate-200 dark:border-white/[.06] transition-all"
            style={{
              opacity: visible.includes(i) ? 1 : 0,
              transform: visible.includes(i) ? 'translateX(0)' : 'translateX(20px)',
              transition: 'all 400ms cubic-bezier(.2,.7,.2,1)',
              borderLeftWidth: '3px',
              borderLeftColor: alerte.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
              style={{
                background: alerte.color,
                animation: alerte.type === 'critical' ? 'critical-pulse 1.4s ease-in-out infinite' : 'none',
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-bold text-slate-900 dark:text-white truncate">
                {alerte.label}
              </div>
              <div className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                {alerte.text}
              </div>
            </div>
            <span className="text-[9.5px] text-slate-400 num shrink-0 mt-0.5">
              {alerte.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
