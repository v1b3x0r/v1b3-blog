import { useEffect, useState } from 'react';
import type { LastFmState } from '../lib/lastfm';

export function useLastFm(): LastFmState | null | undefined {
  const [lastfm, setLastfm] = useState<LastFmState | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const fetchTrack = async () => {
      try {
        const response = await fetch('/api/lastfm');
        if (!response.ok) {
          if (!cancelled) setLastfm((previous) => previous ?? null);
          return;
        }
        const data = await response.json() as LastFmState;
        if (!cancelled) setLastfm(data);
      } catch {
        // Keep the last successful heartbeat until its three-hour window expires.
        if (!cancelled) setLastfm((previous) => previous ?? null);
      }
    };

    void fetchTrack();
    const interval = window.setInterval(fetchTrack, 90_000);
    const onVisible = () => {
      if (!document.hidden) void fetchTrack();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return lastfm;
}
