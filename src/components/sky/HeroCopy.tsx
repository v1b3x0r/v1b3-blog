import { useMemo } from 'react';
import { usePayload } from '../layout/ContextResolver';
import { resolveHeroVariant } from '../../lib/text-variants';

export function HeroCopy() {
  const payload = usePayload();

  const copy = useMemo(() => {
    if (!payload) return { h1: 'building v1b3topia, somewhere in chiang mai.', sub: 'you came to watch — stay as long as you like.' };
    return resolveHeroVariant(payload.timeSpace);
  }, [payload]);

  const renderH1 = () => {
    const m = copy.h1.match(/^(.*?)(somewhere [^.]+\.|under this moon\.|still moon here\.|ที่ไหนซักที่[^,.]+)(.*)$/);
    if (!m) return <>{copy.h1}</>;
    return (
      <>
        {m[1]}
        <span className="hero-place">{m[2]}</span>
        {m[3]}
      </>
    );
  };

  return (
    <div className="hero-copy">
      <h1>{renderH1()}</h1>
      <p className="hero-sub">{copy.sub}</p>
    </div>
  );
}
