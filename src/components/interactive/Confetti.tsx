import { useState, useEffect } from 'react';

export default function Confetti() {
  const [bursts, setBursts] = useState<number[]>([]);

  useEffect(() => {
    (window as any).__triggerConfetti = () => {
      const id = Date.now();
      setBursts(b => [...b, id]);
      setTimeout(() => setBursts(b => b.filter(x => x !== id)), 1800);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {bursts.map(id => (
        <div key={id} className="absolute top-1/2 left-1/2">
          {[...Array(20)].map((_, i) => {
            const a = (i / 20) * Math.PI * 2;
            const dist = 80 + Math.random() * 120;
            const x = Math.cos(a) * dist;
            const y = Math.sin(a) * dist;
            const colors = ['var(--grimy)', '#3b82f6', '#f59e0b', '#ec4899', '#10b981'];
            return (
              <span
                key={i}
                className="absolute w-2 h-2 rounded-sm"
                style={{
                  background: colors[i % colors.length],
                  transform: 'translate(0,0)',
                  animation: `confetti-fly-${id}-${i} 1.4s cubic-bezier(.2,.7,.2,1) forwards`,
                }}
              />
            );
          })}
          <style>{[...Array(20)].map((_, i) => {
            const a = (i / 20) * Math.PI * 2;
            const dist = 80 + Math.random() * 120;
            const x = Math.cos(a) * dist;
            const y = Math.sin(a) * dist;
            return `@keyframes confetti-fly-${id}-${i} { to { transform: translate(${x}px, ${y}px) rotate(${Math.random() * 720}deg); opacity: 0; } }`;
          }).join('\n')}</style>
        </div>
      ))}
    </div>
  );
}
