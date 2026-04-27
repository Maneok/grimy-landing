import { useState, useEffect, useRef } from 'react';

const RISK_AXES = [
  { id: 'activite', name: 'Activité', score: 42, prev: 38, benchmark: 35, grimy: false, desc: "Secteur d'activité du client.", items: [
    { label: 'Hôtellerie-restauration', tone: 'warn', value: 'Secteur sensible (espèces)' },
    { label: 'Code APE', tone: 'ok', value: '5510Z — Hôtels' },
    { label: 'Flux espèces déclarés', tone: 'warn', value: '12 % du CA' },
    { label: 'Secteur sanctionné', tone: 'ok', value: 'Non' },
  ], action: { label: 'Reclasser en sous-secteur précis', delta: -8 } },
  { id: 'client', name: 'Client', score: 58, prev: 55, benchmark: 40, grimy: false, desc: 'Caractéristiques du client.', items: [
    { label: 'Forme juridique', tone: 'ok', value: 'SAS' },
    { label: 'Bénéficiaires effectifs', tone: 'ok', value: '2 identifiés (INPI)' },
    { label: 'Personne politiquement exposée', tone: 'warn', value: 'Match potentiel · dirigeant' },
    { label: 'Sanctions internationales', tone: 'ok', value: 'Aucune correspondance' },
  ], action: { label: 'Lever le doute PEP du dirigeant', delta: -22 } },
  { id: 'localisation', name: 'Localisation', score: 18, prev: 18, benchmark: 22, grimy: false, desc: 'Géographie : siège, dirigeants.', items: [
    { label: 'Siège social', tone: 'ok', value: 'Lyon, France' },
    { label: 'Nationalité dirigeants', tone: 'ok', value: 'France · France' },
    { label: 'Pays de résidence', tone: 'ok', value: 'France' },
    { label: 'Pays sensible (GAFI)', tone: 'ok', value: 'Aucun' },
  ], action: null },
  { id: 'mission', name: 'Mission', score: 35, prev: 30, benchmark: 32, grimy: false, desc: 'Missions confiées au cabinet.', items: [
    { label: 'Mission principale', tone: 'ok', value: 'Tenue + révision' },
    { label: 'Conseil fiscal', tone: 'warn', value: 'Optimisation IS' },
    { label: 'Opérations atypiques', tone: 'ok', value: 'Aucune signalée' },
    { label: 'Lettre de mission', tone: 'ok', value: 'Signée 12/2024' },
  ], action: { label: 'Encadrer le conseil fiscal par avenant', delta: -10 } },
  { id: 'maturite', name: 'Maturité', score: 71, prev: 52, benchmark: 30, grimy: true, desc: 'Signature GRIMY : ancienneté × effectif.', items: [
    { label: 'Ancienneté société', tone: 'warn', value: '14 mois · récente' },
    { label: 'Effectif salariés', tone: 'warn', value: '38 personnes' },
    { label: 'Cohérence âge × effectif', tone: 'warn', value: 'Croissance atypique' },
    { label: 'Relation à distance', tone: 'warn', value: 'Aucune rencontre physique' },
    { label: 'Règlements en espèces', tone: 'ok', value: 'Aucun · virement uniquement' },
  ], action: { label: 'Organiser une rencontre physique', delta: -28 } },
];

const N = RISK_AXES.length;
const cx = 240, cy = 240, R = 175;
const pt = (i: number, r: number): [number, number] => {
  const a = (-90 + i * (360 / N)) * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

export default function ScreeningDemo() {
  const [selected, setSelected] = useState('maturite');
  const [hover, setHover] = useState<string | null>(null);
  const [simActive, setSimActive] = useState(false);
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [entered, setEntered] = useState(false);
  const radarRef = useRef<HTMLDivElement>(null);

  const eff = (axId: string) => {
    const a = RISK_AXES.find(x => x.id === axId)!;
    if (simActive && axId === selected && a.action) return Math.max(0, a.score + a.action.delta);
    return a.score;
  };

  const selIdx = RISK_AXES.findIndex(a => a.id === selected);
  const sel = RISK_AXES[selIdx];
  const selScore = eff(selected);
  const weighted = Math.round(RISK_AXES.reduce((s, a) => s + eff(a.id), 0) / N);
  const baseWeighted = Math.round(RISK_AXES.reduce((s, a) => s + a.score, 0) / N);
  const vigilance = weighted < 30 ? { label: 'Allégée', color: '#10b981' }
    : weighted < 60 ? { label: 'Standard', color: '#f59e0b' }
    : { label: 'Renforcée', color: '#dc2626' };

  const polygon = RISK_AXES.map((ax, i) => pt(i, (eff(ax.id) / 100) * R).join(',')).join(' ');
  const benchPoly = RISK_AXES.map((ax, i) => pt(i, (ax.benchmark / 100) * R).join(',')).join(' ');

  useEffect(() => { setSimActive(false); }, [selected]);

  useEffect(() => {
    if (!radarRef.current || entered) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting && e.intersectionRatio > 0.3) { setEntered(true); obs.disconnect(); } });
    }, { threshold: [0, 0.3, 0.6] });
    obs.observe(radarRef.current);
    return () => obs.disconnect();
  }, [entered]);

  return (
    <section id="screening" className="max-w-[1280px] mx-auto px-6 py-24">
      <div className="text-center mb-12 reveal">
        <div className="text-[12px] font-semibold uppercase tracking-[.18em] mb-3" style={{ color: 'var(--grimy-dark)' }}>02 — Toile des risques</div>
        <h2 className="wordmark text-[clamp(40px,5vw,56px)] leading-[1] tracking-[-.04em] text-slate-900 dark:text-white text-balance">
          Quatre axes NPLAB. <span className="text-slate-400 dark:text-slate-500">Plus un.</span>
        </h2>
        <p className="text-[15px] text-slate-600 dark:text-slate-400 mt-4 max-w-[560px] mx-auto leading-relaxed">
          Les 4 axes NPLAB obligatoires, plus la <strong className="text-slate-800 dark:text-slate-200">Maturité</strong> — un calcul exclusif GRIMY.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* RADAR */}
        <div className="lg:col-span-7 lg:order-2 reveal h-full" ref={radarRef}>
          <div className="relative h-[480px] flex flex-col" style={{ minHeight: 480 }}>
            <div className="absolute pointer-events-none" style={{ left: '50%', top: '52%', width: 440, height: 440, transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, color-mix(in oklab, var(--grimy) 38%, transparent) 0%, transparent 60%)', filter: 'blur(50px)', opacity: entered ? 0.65 : 0, transition: 'opacity .5s ease' }} />
            <div className="relative flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-pulse" />
                <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">Hôtel Belle-Vue</span>
              </div>
              <button onClick={() => setShowBenchmark(b => !b)} aria-label="Afficher la moyenne secteur" className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                {showBenchmark ? '✓ Moyenne secteur' : '+ Moyenne secteur'}
              </button>
            </div>

            <svg viewBox="0 0 480 480" className="w-full flex-1 relative" style={{ maxHeight: 400 }}>
              <defs>
                <radialGradient id="webFill" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="var(--grimy)" stopOpacity=".55" /><stop offset="100%" stopColor="var(--grimy)" stopOpacity=".15" /></radialGradient>
                <radialGradient id="benchFill" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#94a3b8" stopOpacity=".18" /><stop offset="100%" stopColor="#94a3b8" stopOpacity=".05" /></radialGradient>
              </defs>
              {[0.25, 0.5, 0.75, 1].map((k, gi) => {
                const pts = RISK_AXES.map((_, i) => pt(i, R * k).join(',')).join(' ');
                return <polygon key={gi} points={pts} fill="none" stroke="currentColor" strokeWidth=".7" className={'text-slate-300 dark:text-white/10 radar-ring' + (entered ? ' in' : '')} style={{ animationDelay: (30 + (3 - gi) * 45) + 'ms' }} />;
              })}
              {RISK_AXES.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" strokeWidth=".8" className={'text-slate-300 dark:text-white/10 radar-spoke' + (entered ? ' in' : '')} style={{ animationDelay: (190 + i * 36) + 'ms' }} />; })}
              {showBenchmark && <polygon points={benchPoly} fill="url(#benchFill)" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 3" strokeLinejoin="round" style={{ opacity: entered ? 0.7 : 0, transition: 'opacity .4s ease' }} />}
              <polygon points={polygon} fill="url(#webFill)" stroke="var(--grimy-dark)" strokeWidth="2" strokeLinejoin="round" className={'radar-poly' + (entered ? ' in' : '')} style={{ animationDelay: '380ms', transition: entered ? 'all .35s ease' : 'none' }} />
              {RISK_AXES.map((ax, i) => {
                const [x, y] = pt(i, (eff(ax.id) / 100) * R);
                const isSel = selected === ax.id;
                return (
                  <g key={i} onClick={() => setSelected(ax.id)} onMouseEnter={() => setHover(ax.id)} onMouseLeave={() => setHover(null)} className={'radar-vertex' + (entered ? ' in' : '')} style={{ cursor: 'pointer', animationDelay: (480 + i * 45) + 'ms' }}>
                    <circle cx={x} cy={y} r={isSel ? 7 : hover === ax.id ? 6 : 5} fill={ax.grimy ? 'var(--grimy)' : 'white'} stroke="var(--grimy-dark)" strokeWidth={isSel ? 2.5 : 2} />
                  </g>
                );
              })}
              {RISK_AXES.map((ax, i) => {
                const [lx, ly] = pt(i, R + 30);
                const isSel = selected === ax.id;
                const anchor = lx < cx - 8 ? 'end' : lx > cx + 8 ? 'start' : 'middle';
                return (
                  <text key={i} x={lx} y={ly} textAnchor={anchor} fontSize="13" fontWeight={isSel ? 800 : 700} fill={ax.grimy || isSel ? 'var(--grimy-dark)' : 'currentColor'} className={'radar-label' + (entered ? ' in' : '')} style={{ cursor: 'pointer', animationDelay: (530 + i * 40) + 'ms' }} onClick={() => setSelected(ax.id)}>
                    {ax.name}
                  </text>
                );
              })}
              <circle cx={cx} cy={cy} r="3" fill="var(--grimy-dark)" style={{ opacity: entered ? 1 : 0, transition: 'opacity .4s ease 900ms' }} />
            </svg>

            <div className="relative mt-3 pt-3 border-t border-slate-200 dark:border-white/[.06] flex items-center justify-between gap-4" style={{ opacity: entered ? 1 : 0, transform: entered ? 'translateY(0)' : 'translateY(8px)', transition: 'all .4s cubic-bezier(.2,.7,.2,1) .7s' }}>
              <div>
                <div className="text-[10px] uppercase tracking-[.2em] font-bold text-slate-400 dark:text-slate-500">Score pondéré</div>
                <div className="flex items-baseline gap-1.5">
                  <div className="text-[26px] font-black tracking-tight text-slate-900 dark:text-white num leading-none">{weighted}<span className="text-[13px] text-slate-400">/100</span></div>
                  {simActive && weighted !== baseWeighted && (
                    <span className="text-[11px] font-black num px-1.5 py-0.5 rounded" style={{ background: 'color-mix(in oklab, var(--grimy) 18%, transparent)', color: 'var(--grimy-dark)' }}>↓{baseWeighted - weighted}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[.2em] font-bold text-slate-400 dark:text-slate-500">Vigilance</div>
                <div className="text-[15px] font-bold flex items-center gap-1.5 justify-end" style={{ color: vigilance.color }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: vigilance.color }} />{vigilance.label}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AXIS DETAIL */}
        <div className="lg:col-span-5 lg:order-1 reveal flex flex-col h-full">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[.06] overflow-hidden flex flex-col h-[480px] relative">
            <div className="relative px-5 pt-4 pb-3 border-b border-slate-200 dark:border-white/[.06]">
              <div className="flex items-center flex-wrap gap-1.5 text-[12.5px]">
                {RISK_AXES.map(ax => {
                  const isSel = selected === ax.id;
                  return (
                    <button key={ax.id} onClick={() => setSelected(ax.id)} className={`relative px-2.5 py-1 rounded-md font-semibold transition-all ${isSel ? '' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[.05]'}`} style={isSel ? { background: ax.grimy ? 'var(--grimy)' : '#0f172a', color: ax.grimy ? '#0F172A' : '#ffffff' } : {}}>
                      {ax.name}
                      {ax.grimy && !isSel && <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full" style={{ background: 'var(--grimy)' }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative p-5 border-b border-slate-200 dark:border-white/[.06] flex items-end justify-between gap-3" style={{ background: sel.grimy ? 'color-mix(in oklab, var(--grimy) 8%, transparent)' : '' }}>
              <div className="min-w-0 flex-1">
                <div className="text-[22px] font-black tracking-tight text-slate-900 dark:text-white leading-none mb-1.5">{sel.name}</div>
                <div className="text-[11.5px] text-slate-500 dark:text-slate-400">{sel.grimy ? 'Exclusivité GRIMY' : `Critère NPLAB ${selIdx + 1}/4`}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[36px] font-black tracking-tight num text-slate-900 dark:text-white leading-none">{selScore}</div>
                <div className="text-[10px] uppercase tracking-wider font-bold mt-1" style={{ color: selScore < 30 ? '#10b981' : selScore < 60 ? '#f59e0b' : '#dc2626' }}>
                  {selScore < 30 ? 'Faible' : selScore < 60 ? 'Modéré' : 'Élevé'}
                </div>
              </div>
            </div>

            <ul className="divide-y divide-slate-200 dark:divide-white/[.06] flex-1 overflow-y-auto relative">
              {sel.items.map((it, i) => (
                <li key={`${selected}-${i}`} className="px-5 py-2.5 flex items-center gap-3 hover:bg-slate-50/60 dark:hover:bg-white/[.02] transition">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${it.tone === 'warn' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-semibold text-slate-900 dark:text-white">{it.label}</div>
                    <div className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 num">{it.value}</div>
                  </div>
                </li>
              ))}
            </ul>

            {sel.action && (
              <div className="relative p-4 border-t border-slate-200 dark:border-white/[.06] flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-white/[.02]" style={simActive ? { background: 'color-mix(in oklab, var(--grimy) 10%, transparent)' } : {}}>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-[.18em] font-bold text-slate-400 dark:text-slate-500 mb-0.5">Action recommandée</div>
                  <div className="text-[12.5px] font-bold text-slate-900 dark:text-white">{sel.action.label}</div>
                </div>
                <button onClick={() => setSimActive(s => !s)} className="inline-flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1.5 rounded-md transition num shrink-0" style={simActive ? { background: 'var(--grimy-dark)', color: 'white' } : { background: 'transparent', color: 'var(--grimy-dark)', border: '1px solid var(--grimy-dark)' }}>
                  {simActive ? `✓ ↓${Math.abs(sel.action.delta)}` : `Simuler ↓${Math.abs(sel.action.delta)}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
