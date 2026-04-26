import { useState, useRef } from 'react';

export default function BeforeAfterSlider() {
  const [pos, setPos] = useState(50);
  const refDrag = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1 || !refDrag.current) return;
    const r = refDrag.current.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!refDrag.current) return;
    const r = refDrag.current.getBoundingClientRect();
    const x = e.touches[0].clientX - r.left;
    setPos(Math.max(0, Math.min(100, (x / r.width) * 100)));
  };

  return (
    <div
      ref={refDrag}
      className="relative rounded-2xl overflow-hidden mock-shadow border border-slate-200 dark:border-white/[.06] aspect-[16/9] bg-white dark:bg-slate-900 select-none cursor-ew-resize reveal"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {/* AFTER (under) */}
      <div className="absolute inset-0 p-8 bg-white dark:bg-slate-900">
        <div className="text-[11px] uppercase tracking-wider font-bold mb-4" style={{ color: 'var(--grimy-dark)' }}>Avec GRIMY</div>
        <div className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight mb-1">128 clients &middot; 4 à revoir &middot; 1 en retard</div>
        <div className="text-[13px] text-slate-500 dark:text-slate-400 mb-6">Tout est à jour. Les alertes remontent en haut. Vous arbitrez.</div>
        <div className="grid grid-cols-4 gap-3 mb-5">
          {([['Conformes', 124, 'emerald'], ['À revoir', 4, 'amber'], ['Renforcées', 7, 'red'], ['Lettres', 116, 'slate']] as const).map(([l, v, c], i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-white/[.03] border border-slate-200 dark:border-white/[.06]">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{l}</div>
              <div className={`num text-[22px] font-bold ${c === 'emerald' ? 'text-emerald-700 dark:text-emerald-400' : c === 'amber' ? 'text-amber-700 dark:text-amber-400' : c === 'red' ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>{v}</div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-white/[.06] divide-y divide-slate-100 dark:divide-white/[.04]">
          {['CARRELAGES MOREAU SAS · score 32/100 · ✓ À jour', 'Hôtel Belle-Vue · score 58/100 · ⚠ À revoir', 'BERNARD CONSULTING · score 24/100 · ✓ À jour'].map((s, i) => (
            <div key={i} className="px-4 py-2.5 text-[13px] text-slate-700 dark:text-slate-200 flex items-center justify-between">
              <span>{s}</span>
              <span className="num text-[11px] text-slate-400">{i === 0 ? 'il y a 3j' : i === 1 ? 'il y a 8j' : 'il y a 1j'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BEFORE (over with clip) */}
      <div className="absolute inset-0 bg-[#fafafa] dark:bg-[#0d1525] p-8 transition-[clip-path] duration-100" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <div className="text-[11px] uppercase tracking-wider font-bold mb-4 text-red-600 dark:text-red-400">Avant — Excel</div>
        <div className="font-mono text-[10.5px] leading-[1.5] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/[.08] rounded p-2 overflow-hidden h-[80%]">
          <div className="grid grid-cols-6 gap-px bg-slate-300 dark:bg-white/[.08] -m-px">
            {['Client', 'SIREN', 'Score', 'Vigilance', 'Lettre', 'Dernière MAJ'].map((h, i) => (
              <div key={i} className="bg-slate-100 dark:bg-white/[.05] px-2 py-1 font-bold">{h}</div>
            ))}
            {[
              ['CARRELAGES MOREAU', '821456789', '?', '?', '?', '?'],
              ['Hôtel Belle-Vue', '503219884', '??', 'À revoir', 'signée 2022', '12/03/2024'],
              ['BERNARD CONSULTING', '892145008', '?', '?', '?', '?'],
              ['Café des Sports', '441002318', 'élevé', 'renforcée', 'en attente', '06/2023'],
              ['NEGOCE INTL', '304882005', '?', '?', '?', '?'],
              ['Pharmacie Place', '772561408', 'faible', 'simple', '?', '11/2023'],
              ['CONSTRUCTIONS X', '998441002', '?', '?', '?', '?'],
            ].map((row, r) =>
              row.map((c, ci) => (
                <div key={`${r}-${ci}`} className={`bg-white dark:bg-slate-900 px-2 py-1 ${c === '?' ? 'text-red-500 font-bold' : ''}`}>{c}</div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Drag handle */}
      <div className="absolute top-0 bottom-0 w-px shadow-[0_0_0_1px_rgba(0,200,150,.3)]" style={{ left: `${pos}%`, background: 'var(--grimy)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center shadow-lg" style={{ borderColor: 'var(--grimy)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6" /></svg>
        </div>
      </div>

      {/* Tap hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/[.08]">
        &larr; Glissez le curseur &rarr;
      </div>
    </div>
  );
}
