import { useEffect, useState } from 'react';

const phrases = ['sans stress', 'sans paperasse', 'sans prise de tête', 'sans doute'];

export default function HeroPhraseRotator() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % phrases.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <span key={idx} className="dash-under count-flip inline-block">
      {phrases[idx]}
    </span>
  );
}
