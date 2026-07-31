import { useEffect, useState } from 'react';
import { useLastFm } from '../../hooks/useLastFm';
import { isListeningAlive } from '../../lib/lastfm';
import { usePayload } from '../layout/ContextResolver';

function formatTimeForTz(date: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
  } catch {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}

function tzShortLabel(tz: string): string {
  const parts = tz.split('/');
  return parts[parts.length - 1].replace(/_/g, ' ');
}

export function HUDStrip() {
  const payload = usePayload();
  const lastfm = useLastFm();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (!payload) return null;

  const visitorTz = payload.timeSpace.tz;
  const visitorTime = formatTimeForTz(now, visitorTz);
  const visitorCity = tzShortLabel(visitorTz);
  const cnxTime = formatTimeForTz(now, 'Asia/Bangkok');
  const isLive = isListeningAlive(lastfm, now.getTime());

  return (
    <div className="hud-strip">
      <span className="hud-brand">V1B3TOPIA</span>
      <span className="hud-sep">│</span>
      <span>under construction</span>
      <span className="hud-sep">·</span>
      <span>{visitorTime} {visitorCity}</span>
      {visitorCity.toLowerCase() !== 'bangkok' && (
        <>
          <span className="hud-sep">·</span>
          <span>{cnxTime} CNX</span>
        </>
      )}
      <span
        className={`hud-right ${isLive ? 'hud-right--live' : 'hud-right--quiet'}`}
        aria-label={isLive ? 'founder activity detected' : 'no recent founder activity'}
      >
        <span className="hud-live-dot" aria-hidden="true" />
        <span>{isLive ? 'live' : 'quiet'}</span>
      </span>
    </div>
  );
}
