export function Atmosphere() {
  return (
    <>
      <div className="horizon-haze" aria-hidden="true" />
      <svg className="persp-grid" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
        {[0, 40, 80, 120, 160, 200].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1="100"
            x2="100"
            y2="55"
            stroke="rgba(208,138,90,0.16)"
            strokeWidth="0.15"
          />
        ))}
        {[60, 68, 78, 90].map((y, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={y}
            x2="200"
            y2={y}
            stroke="rgba(208,138,90,0.08)"
            strokeWidth="0.1"
          />
        ))}
      </svg>
      <div className="vignette" aria-hidden="true" />
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="v1b3-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.045 0" />
          </filter>
        </defs>
      </svg>
      <div
        className="grain"
        aria-hidden="true"
        style={{ filter: 'url(#v1b3-grain)' }}
      />
    </>
  );
}
