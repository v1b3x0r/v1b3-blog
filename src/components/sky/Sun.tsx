import type { CSSProperties } from 'react';

interface SunProps {
  size?: number;
  altitude?: number;
}

interface SunStyle extends CSSProperties {
  '--sun-size'?: string;
  '--sun-bottom'?: string;
}

export function Sun({ size = 56, altitude = 0.2 }: SunProps) {
  const bottomPct = Math.max(-10, Math.min(80, altitude * 80));

  const style: SunStyle = {
    '--sun-size': `${size}px`,
    '--sun-bottom': `${bottomPct}%`,
  };

  return (
    <div className="sun-wrap" role="img" aria-label="sun" style={style}>
      <div className="sun-corona" />
      <div className="sun-disc" />
    </div>
  );
}
