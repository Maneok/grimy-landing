const phrases = ['sans stress', 'sans paperasse', 'sans prise de tête', 'sans doute'];

export default function HeroPhraseRotator() {
  return (
    <span className="hero-rotator-wrapper relative inline-block" aria-live="polite">
      {phrases.map((phrase, i) => (
        <span
          key={i}
          className="hero-rotator-phrase dash-under inline-block absolute left-0 top-0 whitespace-nowrap"
          style={{
            animationDelay: `${i * 2.6}s`,
            willChange: 'opacity, transform',
          }}
        >
          {phrase}
        </span>
      ))}
      {/* Reserve space with longest phrase */}
      <span className="invisible whitespace-nowrap">sans prise de tête</span>
    </span>
  );
}
