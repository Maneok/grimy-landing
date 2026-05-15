import HeroDemo from './HeroDemo';
import FloatingSourceLogos from './FloatingSourceLogos';

export default function VerificationSection() {
  return (
    <section id="produit" className="max-w-[1280px] mx-auto px-6 py-24 overflow-visible">
      <div className="text-center max-w-3xl mx-auto mb-14 reveal">
        <div className="text-[12px] font-semibold uppercase tracking-[.18em] mb-3" style={{ color: 'var(--grimy-dark)' }}>01 — Vérification client</div>
        <h2 className="wordmark text-[44px] leading-[1.05] tracking-[-.035em] text-slate-900 dark:text-white text-balance">
          9 sources officielles.<br />Un rapport en 3 secondes.
        </h2>
      </div>

      <div className="relative max-w-[1100px] mx-auto reveal xl:pb-28">
        <FloatingSourceLogos />
        <div className="relative z-10 max-w-[680px] mx-auto">
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}
