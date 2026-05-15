import HeroDemo from './HeroDemo';

export default function VerificationSection() {
  return (
    <section id="produit" className="max-w-[1280px] mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-12 gap-10 items-end mb-12">
        <div className="lg:col-span-7 reveal">
          <div className="text-[12px] font-semibold uppercase tracking-[.18em] mb-3" style={{ color: 'var(--grimy-dark)' }}>01 — Vérification client</div>
          <h2 className="wordmark text-[44px] leading-[1.05] tracking-[-.035em] text-slate-900 dark:text-white text-balance">
            9 sources officielles.<br />Un rapport en 3 secondes.
          </h2>
        </div>
        <div className="lg:col-span-5 reveal">
          <p className="text-[16px] leading-[1.6] text-slate-600 dark:text-slate-300">
            INPI, Pappers, BODACC, OpenSanctions, DG Trésor, PEP, Infogreffe, IBAN, OFAC — vérifiés en parallèle.
            Le rapport est horodaté et archivé automatiquement.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 reveal order-2 lg:order-1">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white" style={{ background: 'var(--grimy-dark)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              <div>
                <div className="text-[15px] font-semibold text-slate-900 dark:text-white">Identification automatique</div>
                <div className="text-[13.5px] text-slate-600 dark:text-slate-400 leading-[1.5]">SIREN, dirigeants, bénéficiaires effectifs, statuts — récupérés sans saisie.</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white" style={{ background: 'var(--grimy-dark)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              <div>
                <div className="text-[15px] font-semibold text-slate-900 dark:text-white">Listes de sanctions et PEP</div>
                <div className="text-[13.5px] text-slate-600 dark:text-slate-400 leading-[1.5]">Filtrage OFAC, DG Trésor, OpenSanctions et personnes politiquement exposées.</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white" style={{ background: 'var(--grimy-dark)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              <div>
                <div className="text-[15px] font-semibold text-slate-900 dark:text-white">Rapport horodaté et archivé</div>
                <div className="text-[13.5px] text-slate-600 dark:text-slate-400 leading-[1.5]">Preuve opposable conservée 5 ans, conforme à la norme NPLAB.</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7 reveal order-1 lg:order-2">
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}
