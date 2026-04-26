import { useEffect, useRef, useState } from 'react';

export default function FinalCTACursor() {
  const dotRef = useRef<HTMLSpanElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const card = document.getElementById('final-cta-card');
    const dot = dotRef.current;
    if (!card || !dot) return;

    let raf = 0;
    let x = 0, y = 0, tx = 0, ty = 0;

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      x += (tx - x) * 0.32;
      y += (ty - y) * 0.32;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (Math.hypot(tx - x, ty - y) > 0.4) raf = requestAnimationFrame(tick);
      else raf = 0;
    };

    const onEnter = () => {
      setHovering(true);
      card.classList.add('cta-card-hovering');
    };
    const onLeave = () => {
      setHovering(false);
      card.classList.remove('cta-card-hovering');
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);

    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <span ref={dotRef} aria-hidden="true" className="cta-cursor-dot" />;
}
