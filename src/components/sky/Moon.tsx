import type { CSSProperties } from 'react';
import type { MoonPhaseInfo } from '../../lib/suncalc-helpers';

interface MoonProps {
  phase: MoonPhaseInfo;
  size?: number;
}

interface MoonStyle extends CSSProperties {
  '--moon-shadow-x'?: string;
  '--moon-shadow-opacity'?: number;
}

export function Moon({ phase, size = 56 }: MoonProps) {
  const waxing = phase.phase < 0.5;
  const phaseOffset = waxing ? (0.5 - phase.phase) * 2 : (phase.phase - 0.5) * 2;
  const shadowSide = waxing ? '20%' : '80%';
  const shadowOpacity = Math.min(0.85, 0.4 + phaseOffset * 0.5);

  const style: MoonStyle = {
    width: size,
    height: size,
    '--moon-shadow-x': shadowSide,
    '--moon-shadow-opacity': shadowOpacity,
  };

  return (
    <div
      className="moon-wrap"
      role="img"
      aria-label={`${phase.label}, ${phase.illumination}% illuminated`}
    >
      <div className="moon-bloom" />
      <div className="moon" style={style} />
    </div>
  );
}
