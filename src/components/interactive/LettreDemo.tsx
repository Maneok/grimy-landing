import { useState, useEffect, useRef } from 'react';

const TEMPLATES = [
  { id: 'charpentier', name: 'Charpentier & Faure', client: 'Hôtel Belle-Vue', siren: '503 219 884', signer: 'M. Charpentier' },
  { id: 'lefevre', name: 'Cabinet Lefèvre', client: 'Carrelages Moreau SARL', siren: '812 405 663', signer: 'S. Lefèvre' },
  { id: 'moreau', name: 'Moreau Expertise', client: 'Boulangerie du Centre', siren: '731 058 142', signer: 'A. Moreau' },
];

const pages = [
  { title: 'Lettre de mission', section: 'Article 7 — LCB-FT', widths: [100, 92, 86, 70] },
  { title: 'Annexe A — Honoraires', section: 'Tableau prévisionnel', widths: [88, 95, 100, 76] },
  { title: 'Annexe B — Confidentialité', section: 'Article 12 — RGPD', widths: [96, 82, 90, 100] },
];

const activity = [
  { name: 'Cabinet Lefèvre', action: 'a signé une lettre', time: 'il y a 2 min' },
  { name: 'Moreau Expertise', action: 'a exporté en PDF', time: 'il y a 5 min' },
  { name: 'Cabinet Charpentier', action: 'a envoyé pour signature', time: 'il y a 8 min' },
];

export default function LettreDemo() {
  const [tplIdx, setTplIdx] = useState(0);
  const [pageIdx, setPageIdx] = useState(0);
  const [elapsed, setElapsed] = useState(167);
  const [tilt, setTilt] = useState({ x: -9, y: 2 });
  const paperRef = useRef<HTMLDivElement>(null);

  const tpl = TEMPLATES[tplIdx];
  const page = pages[pageIdx];

  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  // Pause animations when off-screen
  useEffect(() => {
    if (!paperRef.current) return;
    const el = paperRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => { el.classList.toggle('in-view', entry.isIntersecting); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function onMove(e: React.MouseEvent) {
    const r = paperRef.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -9 + px * 8, y: 2 - py * 6 });
  }
  function onLeave() { setTilt({ x: -9, y: 2 }); }

  const CheckIcon = () => <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>;
  const ArrowIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
  const ClockIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;

  return (
    <div className="reveal relative">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/[.03] border border-slate-200 dark:border-white/[.06]">
          <span className="text-[10px] uppercase tracking-[.18em] font-bold text-slate-400 dark:text-slate-500 px-2.5">Modèle</span>
          {TEMPLATES.map((t, i) => (
            <button key={t.id} onClick={() => setTplIdx(i)} data-active={i === tplIdx} className="tpl-tab px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
              {t.name.split(' ')[0]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 save-dot" />
            <span>Enregistré <span className="num">à l'instant</span></span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 dark:bg-white/[.05] text-white dark:text-slate-200 num text-[11px] font-bold">
            <ClockIcon /><span>{mm}:{ss}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Paper */}
        <div className="lg:col-span-7 relative" style={{ minHeight: 620, perspective: '1400px' }}>
          <div className="absolute pointer-events-none" style={{ left: '8%', top: '12%', width: 380, height: 380, background: 'radial-gradient(circle, color-mix(in oklab, var(--grimy) 35%, transparent) 0%, transparent 65%)', filter: 'blur(40px)', opacity: 0.55 }} />
          <div ref={paperRef} onMouseMove={onMove} onMouseLeave={onLeave} className="relative paper-tilt paper-grain rounded-2xl bg-white dark:bg-slate-50 overflow-hidden" style={{ aspectRatio: '1 / 1.32', maxWidth: 460, '--tx': `${tilt.x}deg`, '--ty': `${tilt.y}deg`, boxShadow: '0 40px 60px -20px rgba(15,23,42,.35), 0 30px 60px -30px rgba(15,23,42,.4), 0 0 0 1px rgba(15,23,42,.06)' } as React.CSSProperties}>
            <div className="absolute inset-0 flex items-center justify-center watermark">GRIMY</div>
            <div className="binder-holes"><span className="binder-hole" /><span className="binder-hole" /><span className="binder-hole" /></div>
            <div className="absolute top-7 right-6 stamp-signed">
              <div className="rounded-full border-[3px] border-emerald-600 px-3.5 py-1.5 text-emerald-600 font-black text-[11px] tracking-[.2em] num bg-white/80 backdrop-blur-sm">SIGNÉ</div>
            </div>
            <div className="relative px-9 pt-9 pb-3 flex items-center gap-2 ml-8">
              {['Identifier', 'Rédiger', 'Exporter'].map((s, i) => (
                <span key={i} className="contents">
                  <div className={`w-2 h-2 rounded-full ${i < 2 ? 'bg-emerald-500' : 'mint-pulse'}`} style={i === 2 ? { background: 'var(--grimy-dark)' } : {}} />
                  {i < 2 && <div className={`flex-1 h-px ${i < 2 ? 'bg-emerald-300' : 'bg-slate-200'}`} style={{ maxWidth: 40 }} />}
                </span>
              ))}
              <span className="ml-auto text-[10px] uppercase tracking-[.18em] font-bold text-slate-400 num">3 / 3</span>
            </div>
            <div className="relative px-10 pt-2 pb-9 pl-16 text-slate-800">
              <div className="text-[9px] tracking-[.32em] text-slate-400 font-bold mb-3">{tpl.name.toUpperCase()}</div>
              <div className="text-[20px] font-bold tracking-tight text-slate-900 leading-tight mb-1">{page.title}</div>
              <div className="text-[11px] text-slate-500 mb-2 num">{tpl.client} &middot; SIREN {tpl.siren}</div>
              <div className="flex flex-wrap gap-1 mb-5">
                {['SIREN', 'Raison sociale', 'Capital', 'Dirigeant'].map((c, i) => (
                  <span key={c} className="lettre-chip text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 inline-flex items-center gap-1" style={{ animationDelay: `${0.3 + i * 0.3}s` }}><CheckIcon />{c}</span>
                ))}
              </div>
              <div className="space-y-2 mb-5">{page.widths.map((w, i) => (
                <div key={i} className="relative h-[6px] rounded-full bg-slate-100 overflow-hidden" style={{ width: `${w}%` }}>
                  <div className="lettre-bar absolute inset-y-0 left-0 bg-slate-300 rounded-full" style={{ ['--bar-width' as string]: '100%', animationDelay: `${1.5 + i * 0.7}s` }} />
                </div>
              ))}</div>
              <div className="relative mb-6">
                <div className="text-[10px] font-bold text-slate-700 mb-1.5">{page.section}</div>
                <div className="space-y-1.5">{[100, 88].map((w, i) => (
                  <div key={i} className="relative h-[5px] rounded-full bg-amber-100 overflow-hidden" style={{ width: `${w}%` }}>
                    <div className="lettre-highlight absolute inset-y-0 left-0 bg-amber-300 rounded-full" style={{ ['--bar-width' as string]: '100%', animationDelay: `${5.0 + i * 0.7}s` }} />
                  </div>
                ))}</div>
                <div className="absolute margin-note hidden md:block" style={{ right: -52, top: -8, width: 100 }}>Clause obligatoire LCB-FT</div>
              </div>
              <div className="space-y-2 mb-7">{[94, 78].map((w, i) => (
                <div key={i} className="relative h-[6px] rounded-full bg-slate-100 overflow-hidden" style={{ width: `${w}%` }}>
                  <div className="lettre-bar absolute inset-y-0 left-0 bg-slate-300 rounded-full" style={{ ['--bar-width' as string]: '100%', animationDelay: `${7.0 + i * 0.7}s` }} />
                </div>
              ))}</div>
              <div className="pt-4 border-t border-slate-200 flex items-end justify-between">
                <div>
                  <svg width="120" height="42" viewBox="0 0 120 42" className="sign-trace -mb-1.5"><path d="M5 28 Q 18 8, 30 22 T 54 26 Q 66 14, 78 28 T 110 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" /></svg>
                  <div className="text-[9px] text-slate-500 num">{tpl.signer} &middot; 03/2025</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-slate-400 num">page {pageIdx + 1} / 12</div>
                  <div className="text-[9px] font-semibold text-emerald-600 num">Conforme NPLAB</div>
                </div>
              </div>
            </div>
            <div className="corner-peel" />
          </div>
          <div className="mt-7 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase tracking-[.18em] font-bold text-slate-400 dark:text-slate-500 mr-2">12 pages &middot; cliquez</span>
            {Array.from({ length: 12 }).map((_, i) => (
              <button key={i} onClick={() => setPageIdx(i % 3)} aria-label={`Page ${i + 1}`} className={`page-thumb w-5 h-7 rounded-[3px] border ${pageIdx === (i % 3) && i < 3 ? 'active' : ''} ${i < 9 ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/[.08]' : 'bg-slate-50 dark:bg-white/[.02] border-slate-200 dark:border-white/[.06]'} flex flex-col gap-[2px] p-[3px]`}>
                <div className="h-px bg-slate-300 dark:bg-white/[.1] w-full" /><div className="h-px bg-slate-200 dark:bg-white/[.08] w-3/4" /><div className="h-px bg-slate-200 dark:bg-white/[.08] w-2/3" />
              </button>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-5 lg:pl-4">
          <div className="text-[11px] font-bold uppercase tracking-[.24em] mb-4" style={{ color: 'var(--grimy-dark)' }}>Étape 3 &middot; Export</div>
          <h3 className="wordmark text-[34px] leading-[1.05] tracking-[-.035em] text-slate-900 dark:text-white mb-3 text-balance">Prête. Modifiable.<br />Signée en 4 minutes.</h3>

          <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-white/[.03] border border-slate-200 dark:border-white/[.06]">
            <div className="text-[10px] uppercase tracking-[.18em] font-bold text-slate-400 dark:text-slate-500 mb-3">Temps moyen</div>
            <div className="space-y-2.5">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1"><span className="text-slate-500 dark:text-slate-400">Manuel (Word)</span><span className="font-bold text-slate-700 dark:text-slate-300 num">4 h 12 min</span></div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-white/[.06] overflow-hidden"><div className="h-full compare-manual rounded-full" style={{ background: 'linear-gradient(90deg, #94a3b8, #64748b)' }} /></div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1"><span className="text-slate-700 dark:text-slate-200 font-semibold">GRIMY</span><span className="font-bold num" style={{ color: 'var(--grimy-dark)' }}>4 min</span></div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-white/[.06] overflow-hidden"><div className="h-full compare-grimy rounded-full" style={{ background: 'linear-gradient(90deg, var(--grimy), var(--grimy-dark))' }} /></div>
              </div>
            </div>
            <div className="mt-3 text-[11px] font-bold" style={{ color: 'var(--grimy-dark)' }}>&minus;98 % de temps</div>
          </div>

          <div className="space-y-2.5 mt-5">
            <button aria-label="Exporter en Word" className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-white/[.08] bg-white dark:bg-white/[.02] hover:border-[var(--grimy-dark)] dark:hover:border-[var(--grimy)] transition group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#2B579A', color: '#fff' }}><span className="text-[15px] font-black">W</span></div>
              <div className="flex-1 text-left"><div className="text-[14px] font-semibold text-slate-900 dark:text-white">Word</div><div className="text-[10.5px] text-slate-500 dark:text-slate-400">Modifiable &middot; 12 pages &middot; 348 Ko</div></div>
              <ArrowIcon />
            </button>
            <button aria-label="Exporter en PDF" className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-white/[.08] bg-white dark:bg-white/[.02] hover:border-[var(--grimy-dark)] dark:hover:border-[var(--grimy)] transition group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#DC2626', color: '#fff' }}><span className="text-[10.5px] font-black">PDF</span></div>
              <div className="flex-1 text-left"><div className="text-[14px] font-semibold text-slate-900 dark:text-white">PDF</div><div className="text-[10.5px] text-slate-500 dark:text-slate-400">Verrouillé &middot; prêt à imprimer</div></div>
              <ArrowIcon />
            </button>
            <button aria-label="Signature en ligne" className="w-full flex items-center gap-3 p-3.5 rounded-xl mint-glow text-white font-semibold transition group" style={{ background: 'linear-gradient(135deg, var(--grimy-dark), var(--grimy))' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-white/20"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg></div>
              <div className="flex-1 text-left"><div className="text-[14px]">Signature en ligne</div><div className="text-[10.5px] text-white/80">Yousign &middot; DocuSign &middot; horodaté eIDAS</div></div>
              <ArrowIcon />
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/[.06]">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-pulse" />
              <span className="text-[10px] uppercase tracking-[.18em] font-bold text-slate-400 dark:text-slate-500">Activité en direct</span>
            </div>
            <div className="h-[36px] overflow-hidden relative">
              <div className="ticker-track absolute inset-x-0">
                {[...activity, ...activity].map((a, i) => (
                  <div key={i} className="h-[36px] flex items-center gap-2 text-[12px]">
                    <span className="font-semibold text-slate-900 dark:text-white truncate">{a.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 truncate">{a.action}</span>
                    <span className="ml-auto text-[10px] text-slate-400 num shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
              <span className="num font-bold text-slate-900 dark:text-white">1 247</span> lettres signées cette semaine
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
