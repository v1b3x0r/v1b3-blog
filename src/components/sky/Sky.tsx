import { useMemo, lazy, Suspense } from 'react';
import { usePayload } from '../layout/ContextResolver';
import { readSkyBodies } from '../../lib/suncalc-helpers';
import { Stars } from './Stars';
import { Moon } from './Moon';
import { Sun } from './Sun';
import { DoiSuthep } from './DoiSuthep';
import { Atmosphere } from './Atmosphere';
import '../../styles/sky.css';

const MeshBackground = lazy(() => import('./MeshBackground').then((m) => ({ default: m.MeshBackground })));

export function Sky() {
  const payload = usePayload();

  const bodies = useMemo(() => readSkyBodies(new Date()), []);

  const skyClass = payload ? `sky sky-${payload.atmosphere.colorScheme === 'dark' ? 'night' : 'dawn'}` : 'sky sky-night';
  const reduceMotion = payload?.atmosphere.reduceMotion ?? false;
  const isMobile = payload ? payload.embodiment.viewportW < 600 : false;
  const ridges: 1 | 3 = isMobile ? 1 : 3;

  return (
    <div className={`${skyClass} ${reduceMotion ? 'motion-still' : ''}`} role="img" aria-label={`night sky over chiang mai with ${bodies.moonPhase.label}`}>
      <Suspense fallback={null}>
        <MeshBackground />
      </Suspense>
      {!reduceMotion && <Stars count={isMobile ? 8 : 14} />}
      <Atmosphere />
      <DoiSuthep ridges={ridges} />
      {bodies.isMoonUp && (
        <Moon phase={bodies.moonPhase} size={isMobile ? 64 : 56} />
      )}
      {bodies.isSunUp && (
        <Sun altitude={bodies.sunAltitude} />
      )}
      <div className="moon-caption" aria-hidden="true">
        <div>{bodies.moonPhase.label.toUpperCase()}</div>
        <div className="phase-bar">
          {'▮'.repeat(Math.round(bodies.moonPhase.illumination / 20))}
          {'▯'.repeat(5 - Math.round(bodies.moonPhase.illumination / 20))}
          {' · '}{bodies.moonPhase.illumination}%
        </div>
      </div>
    </div>
  );
}
