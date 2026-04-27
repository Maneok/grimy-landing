import { useEffect, useRef } from 'react';

const alertes = [
  { id: 1, label: 'OFAC', text: 'Sanction détectée — DUPONT SARL', time: "à l'instant", color: '#ef4444', delay: 0.4, critical: true },
  { id: 2, label: 'Dirigeant', text: 'Changement — CARRELAGES MOREAU', time: 'il y a 2 min', color: '#f59e0b', delay: 1.1, critical: false },
  { id: 3, label: 'Revue', text: 'Revue OK — Pharmacie Place', time: 'il y a 5 min', color: '#10b981', delay: 1.8, critical: false },
];

export default function AlertesLive() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => { el.classList.toggle('in-view', entry.isIntersecting); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="alertes-card space-y-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[.18em] font-bold text-slate-400 dark:text-slate-500">
          Activité en direct
        </span>
        <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" style={{ animation: 'critical-pulse 1.4s ease-in-out infinite' }} />
          1 critique
        </span>
      </div>

      <div className="space-y-2">
        {alertes.map((alerte) => (
          <div
            key={alerte.id}
            className="alerte-toast flex items-start gap-2 p-2.5 rounded-lg bg-slate-50/80 dark:bg-white/[.02] border border-slate-200 dark:border-white/[.06]"
            style={{
              animationDelay: `${alerte.delay}s`,
              borderLeftWidth: '3px',
              borderLeftColor: alerte.color,
              willChange: 'transform, opacity',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
              style={{
                background: alerte.color,
                animation: alerte.critical ? 'critical-pulse 1.4s ease-in-out infinite' : 'none',
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
