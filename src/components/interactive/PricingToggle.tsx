import { useState } from 'react';

export default function PricingToggle() {
  const [annual, setAnnual] = useState(true);

  const toggle = (isAnnual: boolean) => {
    setAnnual(isAnnual);
    // Update prices in the DOM
    const cards = document.getElementById('pricing-cards');
    if (!cards) return;
    cards.setAttribute('data-annual', isAnnual ? 'true' : 'false');
    const prices = cards.querySelectorAll<HTMLSpanElement>('[data-monthly]');
    prices.forEach((el) => {
      const m = el.getAttribute('data-monthly');
      const a = el.getAttribute('data-annual');
      el.textContent = `€${isAnnual ? a : m}`;
    });
    // Update billing text
    const billingTexts = cards.querySelectorAll<HTMLDivElement>('.text-\\[12px\\]');
    billingTexts.forEach((el) => {
      if (el.textContent?.includes('facturation')) {
        el.textContent = el.textContent.replace(
          isAnnual ? 'mensuelle' : 'annuelle',
          isAnnual ? 'annuelle' : 'mensuelle'
        );
      }
    });
  };

  return (
    <div className="inline-flex items-center gap-2 mt-7 p-1 bg-slate-200/60 dark:bg-white/[.04] rounded-full text-[13px] font-medium">
      <button
        onClick={() => toggle(false)}
        className={`px-4 py-1.5 rounded-full transition ${!annual ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
      >
        Mensuel
      </button>
      <button
        onClick={() => toggle(true)}
        className={`px-4 py-1.5 rounded-full transition flex items-center gap-2 ${annual ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
      >
        Annuel
        <span
          className="text-[10.5px] font-bold uppercase px-1.5 py-0.5 rounded text-white"
          style={{ background: 'var(--grimy-dark)' }}
        >
          −2 mois
        </span>
      </button>
    </div>
  );
}
