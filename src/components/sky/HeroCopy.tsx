import { useMemo } from 'react';
import { usePayload } from '../layout/ContextResolver';
import { resolveHeroVariant, heroIdentity } from '../../lib/text-variants';

/** A square envelope, drawn rather than lettered, so the shape says what the
 *  button does before the label is read. */
function EnvelopeIcon() {
  return (
    <svg
      className="hero-mail-icon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.6 7.2 8.4 5.9 8.4-5.9" />
    </svg>
  );
}

export function HeroCopy() {
  const payload = usePayload();

  const copy = useMemo(() => {
    if (!payload) return { h1: 'building v1b3topia, somewhere in chiang mai.', sub: '' };
    return resolveHeroVariant(payload.timeSpace);
  }, [payload]);

  return (
    <div className="hero-copy">
      <h1>
        {(() => {
          const m = copy.h1.match(/^(.*?)(somewhere [^.]+\.|under this moon\.|still moon here\.)(.*)$/);
          if (!m) return copy.h1;
          return (
            <>
              {m[1]}
              <span className="hero-place">{m[2]}</span>
              {m[3]}
            </>
          );
        })()}
      </h1>
      {copy.sub && <p className="hero-sub">{copy.sub}</p>}
      <p className="hero-identity">{heroIdentity.line}</p>
      <p className="hero-doors">
        <a className="hero-door hero-door--ghost" href={heroIdentity.whoamiHref}>
          {heroIdentity.whoamiLabel} <span aria-hidden="true">→</span>
        </a>
        <a className="hero-door hero-mail" href={heroIdentity.mailHref}>
          <EnvelopeIcon />
          {heroIdentity.mailLabel}
        </a>
      </p>
    </div>
  );
}
