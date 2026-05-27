import { useMemo } from 'react';

interface StarDef {
  top: string;
  left: string;
  tier: 'near' | 'mid' | 'far';
  delay: number;
}

function generateStars(count: number, seed: number): StarDef[] {
  let state = seed;
  const rand = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
  const stars: StarDef[] = [];
  for (let i = 0; i < count; i++) {
    const r = rand();
    stars.push({
      top: `${(rand() * 100).toFixed(2)}%`,
      left: `${(rand() * 100).toFixed(2)}%`,
      tier: r < 0.3 ? 'near' : r < 0.65 ? 'mid' : 'far',
      delay: rand() * 6,
    });
  }
  return stars;
}

export function Stars({ count = 14, seed = 42 }: { count?: number; seed?: number }) {
  const stars = useMemo(() => generateStars(count, seed), [count, seed]);

  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className={`star star-${s.tier}`}
          style={{ top: s.top, left: s.left, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  );
}
