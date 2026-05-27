import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { readPayload } from '../../lib/payload';
import type { Payload } from '../../lib/payload.types';

const PayloadContext = createContext<Payload | null>(null);

export function ContextResolver({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<Payload | null>(null);

  useEffect(() => {
    setPayload(readPayload());

    const onResize = () => setPayload(readPayload());
    const onChange = () => setPayload(readPayload());

    window.addEventListener('resize', onResize);
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
      window.removeEventListener('resize', onResize);
      window.removeEventListener('online', onChange);
      window.removeEventListener('offline', onChange);
      mqls.forEach((mql) => mql.removeEventListener('change', onChange));
    };
  }, []);

  return <PayloadContext.Provider value={payload}>{children}</PayloadContext.Provider>;
}

export function usePayload(): Payload | null {
  return useContext(PayloadContext);
}
