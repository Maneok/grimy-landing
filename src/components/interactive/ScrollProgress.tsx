import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setW(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none">
      <div
        className="h-full transition-[width] duration-100"
        style={{
          width: `${w}%`,
          background: 'linear-gradient(90deg, var(--grimy) 0%, var(--grimy-dark) 100%)',
          boxShadow: '0 0 8px var(--grimy)',
        }}
      />
    </div>
  );
}
