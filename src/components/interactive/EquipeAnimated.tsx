import { useEffect, useRef, useState } from 'react';

export default function EquipeAnimated() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const members = [
    { id: 'mc', cx: 110, cy: 14, color: 'var(--grimy-dark)', initials: 'MC', label: 'Associé · Décl.', delay: 100, isBoss: true },
    { id: 'sf', cx: 40, cy: 70, color: '#3b82f6', initials: 'SF', label: 'Manager', delay: 600, isBoss: false },
    { id: 'lp', cx: 110, cy: 70, color: '#a855f7', initials: 'LP', label: 'Collab.', delay: 750, isBoss: false },
    { id: 'ab', cx: 180, cy: 70, color: '#f59e0b', initials: 'AB', label: 'Collab.', delay: 900, isBoss: false },
  ];

  return (
    <div ref={ref} className="relative">
      <svg viewBox="0 0 220 110" className="w-full h-[100px]" preserveAspectRatio="xMidYMid meet">
        {members.slice(1).map((m) => (
          <line
            key={`line-${m.id}`}
            x1="110" y1="22" x2={m.cx} y2={m.cy - 8}
            stroke="currentColor" strokeWidth="1"
            className="text-slate-300 dark:text-white/[.12]"
            style={{
              strokeDasharray: 100,
              strokeDashoffset: visible ? 0 : 100,
              transition: `stroke-dashoffset 600ms ease ${m.delay - 200}ms`,
            }}
          />
        ))}

        {members.map((m) => (
          <g
            key={m.id}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'scale(1)' : 'scale(0)',
              transformOrigin: `${m.cx}px ${m.cy}px`,
              transition: `all 400ms cubic-bezier(.34,1.56,.64,1) ${m.delay}ms`,
            }}
          >
            <circle cx={m.cx} cy={m.cy} r={m.isBoss ? 11 : 9} fill={m.color} />
            <text x={m.cx} y={m.cy + 3} textAnchor="middle" fontSize={m.isBoss ? 8 : 7.5} fontWeight="800" fill="white" className="num">
              {m.initials}
            </text>
            <text x={m.cx} y={m.cy + (m.isBoss ? 23 : 19)} textAnchor="middle" fontSize="7" fill="currentColor" className="text-slate-500 dark:text-slate-400">
              {m.label}
            </text>
          </g>
        ))}

        {visible && (
          <circle cx="110" cy="14" r="11" fill="none" stroke="var(--grimy)" strokeWidth="1.5"
            style={{ animation: 'team-pulse 2s ease-out infinite 1500ms', opacity: 0 }}
          />
        )}
      </svg>

      <div className="mt-2 flex items-center justify-between text-[10px]">
        <span className="text-slate-500 dark:text-slate-400">5 collaborateurs habilités</span>
        <span
          className="font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 transition-all"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0.8)',
            transition: 'all 400ms ease 1100ms',
          }}
        >
          100 % formés
        </span>
      </div>
    </div>
  );
}
