import { useEffect, useState } from 'react';

const documents = [
  { id: 'kbis', label: 'KBIS', color: '#475569', filename: 'KBIS_Hotel_Belle_Vue.pdf' },
  { id: 'cni', label: 'CNI', color: '#3b82f6', filename: 'CNI_Dirigeant.pdf' },
  { id: 'rib', label: 'RIB', color: '#a855f7', filename: 'RIB_Belle_Vue.pdf' },
  { id: 'pdf', label: 'PDF', color: '#dc2626', filename: 'Statuts_SAS.pdf' },
  { id: 'rbe', label: 'RBE', color: 'var(--grimy-dark)', filename: 'Beneficiaires_effectifs.pdf' },
];

export default function GedAutoCard() {
  const [classified, setClassified] = useState<number[]>([]);
  const [falling, setFalling] = useState<number | null>(null);

  useEffect(() => {
    let timeouts: number[] = [];

    const runCycle = () => {
      setClassified([]);
      setFalling(null);

      documents.forEach((_, i) => {
        timeouts.push(window.setTimeout(() => {
          setFalling(i);
        }, i * 800 + 300));

        timeouts.push(window.setTimeout(() => {
          setClassified((prev) => [...prev, i]);
          setFalling(null);
        }, i * 800 + 1000));
      });

      timeouts.push(window.setTimeout(() => {
        runCycle();
      }, documents.length * 800 + 2500));
    };

    runCycle();

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative h-full min-h-[380px] flex flex-col">
      {/* Zone de pluie (haut) */}
      <div className="relative h-[140px] mb-4 overflow-hidden">
        {documents.map((doc, i) => (
          <div
            key={`falling-${i}`}
            className="absolute left-1/2 -translate-x-1/2 transition-all"
            style={{
              top: falling === i ? '110px' : '-40px',
              opacity: falling === i ? 1 : 0,
              transform: `translateX(-50%) ${falling === i ? 'rotate(-3deg)' : 'rotate(-15deg)'}`,
              transition: 'top 600ms cubic-bezier(.5,.05,.6,1.4), opacity 200ms, transform 600ms',
              left: `${30 + (i % 3) * 20}%`,
            }}
          >
            <div
              className="px-3 py-2 rounded-lg shadow-2xl flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/[.08]"
              style={{ boxShadow: '0 20px 40px -10px rgba(0,200,150,.3)' }}
            >
              <span
                className="w-8 h-5 rounded-sm flex items-center justify-center text-[8px] font-black text-white shrink-0"
                style={{ background: doc.color }}
              >
                {doc.label}
              </span>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-200 num">
                {doc.filename}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dossier client (bas) */}
      <div className="flex-1 rounded-xl border border-slate-200 dark:border-white/[.06] bg-slate-50/50 dark:bg-white/[.02] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-slate-500">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">Hôtel Belle-Vue</span>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full transition-all"
            style={{
              background: classified.length === documents.length ? 'var(--grimy)' : 'transparent',
              color: classified.length === documents.length ? '#0F172A' : '#94a3b8',
              border: classified.length === documents.length ? 'none' : '1px solid #cbd5e1',
            }}
          >
            {classified.length === documents.length ? '✓ Conforme NPLAB' : `${classified.length} / ${documents.length}`}
          </span>
        </div>

        <div className="space-y-1.5">
          {documents.map((doc, i) => (
            <div
              key={doc.id}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md border transition-all"
              style={{
                background: classified.includes(i)
                  ? 'color-mix(in oklab, var(--grimy) 6%, transparent)'
                  : 'transparent',
                borderColor: classified.includes(i)
                  ? 'color-mix(in oklab, var(--grimy) 20%, transparent)'
                  : 'transparent',
                opacity: classified.includes(i) ? 1 : 0.4,
                transform: classified.includes(i) ? 'translateY(0)' : 'translateY(2px)',
              }}
            >
              <span
                className="w-7 h-5 rounded-sm flex items-center justify-center text-[8px] font-black text-white shrink-0"
                style={{ background: doc.color }}
              >
                {doc.label}
              </span>
              <span className="text-[10.5px] text-slate-700 dark:text-slate-200 flex-1 truncate font-medium">
                {doc.filename}
              </span>
              {classified.includes(i) && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-emerald-500 shrink-0"
                  style={{ animation: 'check-pop .3s ease-out' }}
                >
                  <path d="M5 12l5 5L20 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
