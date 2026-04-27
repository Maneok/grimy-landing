import { useEffect, useRef } from 'react';

const documents = [
  { id: 'kbis', label: 'KBIS', color: '#475569', filename: 'KBIS_Hotel_Belle_Vue.pdf', delay: 0 },
  { id: 'cni', label: 'CNI', color: '#3b82f6', filename: 'CNI_Dirigeant.pdf', delay: 1.5 },
  { id: 'rib', label: 'RIB', color: '#a855f7', filename: 'RIB_Belle_Vue.pdf', delay: 3 },
  { id: 'pdf', label: 'PDF', color: '#dc2626', filename: 'Statuts_SAS.pdf', delay: 4.5 },
  { id: 'rbe', label: 'RBE', color: 'var(--grimy-dark)', filename: 'Beneficiaires_RBE.pdf', delay: 6 },
];

export default function GedAutoCard() {
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
    <div ref={ref} className="ged-card relative h-full min-h-[380px] flex flex-col">
      {/* Zone de pluie */}
      <div className="relative h-[140px] mb-4 overflow-hidden">
        {documents.map((doc, i) => (
          <div
            key={doc.id}
            className="ged-falling-doc absolute"
            style={{
              left: `${30 + (i % 3) * 20}%`,
              animationDelay: `${doc.delay}s`,
              willChange: 'transform, opacity',
            }}
          >
            <div className="px-3 py-2 rounded-lg shadow-2xl flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/[.08]"
              style={{ boxShadow: '0 20px 40px -10px rgba(0,200,150,.3)' }}>
              <span className="w-8 h-5 rounded-sm flex items-center justify-center text-[8px] font-black text-white shrink-0"
                style={{ background: doc.color }}>
                {doc.label}
              </span>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-200 num">
                {doc.filename}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dossier client */}
      <div className="flex-1 rounded-xl border border-slate-200 dark:border-white/[.06] bg-slate-50/50 dark:bg-white/[.02] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-slate-500">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">Hôtel Belle-Vue</span>
          </div>
          <span className="ged-badge text-[10px] font-bold px-2 py-0.5 rounded-full">
            ✓ Conforme NPLAB
          </span>
        </div>

        <div className="space-y-1.5">
          {documents.map((doc) => (
            <div key={doc.id} className="ged-row flex items-center gap-2 px-2 py-1.5 rounded-md border"
              style={{ animationDelay: `${doc.delay + 0.7}s`, willChange: 'opacity, transform' }}>
              <span className="w-7 h-5 rounded-sm flex items-center justify-center text-[8px] font-black text-white shrink-0"
                style={{ background: doc.color }}>
                {doc.label}
              </span>
              <span className="text-[10.5px] text-slate-700 dark:text-slate-200 flex-1 truncate font-medium">
                {doc.filename}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500 shrink-0">
                <path d="M5 12l5 5L20 7"/>
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
