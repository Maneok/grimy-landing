import { useState, useEffect } from 'react';

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('grimy-theme', next ? 'dark' : 'light');
  };

  const links = [
    ['Produit', '#produit'],
    ['Vérification', '#screening'],
    ['Lettre de mission', '#lettre'],
    ['Tarifs', '#tarifs'],
    ['FAQ', '#faq'],
  ];

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? 'backdrop-blur-md bg-[#F4F3EE]/85 dark:bg-[#0B1220]/85 border-b border-slate-200/60 dark:border-white/[.06]' : 'bg-transparent border-b border-transparent'}`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="wordmark text-[22px] tracking-[-.04em] text-slate-900 dark:text-white">
            GRIMY<span className="grimy-dot mint-pulse" />
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-1 text-[14px]">
          {links.map(([l, h]) => (
            <a
              key={l}
              href={h}
              className="px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40 dark:hover:bg-white/[.04] transition"
            >
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/[.06] transition relative"
            aria-label="Changer le thème"
          >
            {dark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M5 5l1.5 1.5M17.5 17.5L19 19M2 12h2M20 12h2M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <a href="https://app.grimy.fr/auth" className="hidden sm:block text-[14px] font-medium text-slate-700 dark:text-slate-200 px-3 py-1.5 hover:text-slate-900 dark:hover:text-white">
            Connexion
          </a>
          <a href="https://app.grimy.fr/auth" className="text-[14px] font-semibold text-white px-4 py-2 rounded-lg btn-magnetic">
            Démarrer
          </a>
        </div>
      </div>
    </header>
  );
}
