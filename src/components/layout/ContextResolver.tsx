import { useEffect, useState, type ReactNode } from 'react';
import { readPayload } from '../../lib/payload';
import type { Payload } from '../../lib/payload.types';

// ContextResolver is a pass-through wrapper kept for layout grouping.
// usePayload() is now a self-contained hook — each component reads payload
// independently. This works around Astro's per-island React-root isolation.
export function ContextResolver({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function usePayload(): Payload | null {
  const [payload, setPayload] = useState<Payload | null>(null);

  useEffect(() => {
    setPayload(readPayload());

    const onChange = () => setPayload(readPayload());

    window.addEventListener('resize', onChange);
    window.addEventListener('online', onChange);
    window.addEventListener('offline', onChange);

    const mqls = [
      '(prefers-color-scheme: dark)',
      '(prefers-reduced-motion: reduce)',
      '(orientation: portrait)',
    ].map((q) => {
      const mql = window.matchMedia(q);
      mql.addEventListener('change', onChange);
      return mql;
    });

    return () => {
      window.removeEventListener('resize', onChange);
      window.removeEventListener('online', onChange);
      window.removeEventListener('offline', onChange);
      mqls.forEach((mql) => mql.removeEventListener('change', onChange));
    };
  }, []);

  return payload;
}
