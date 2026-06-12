import { useEffect, useState } from 'react';

export interface SprintInfo {
  day: number;
  total: number;
  name: string;
}

interface FounderRowProps {
  sprint: SprintInfo | null;
  hideTrack?: boolean;
}

interface LastFmState {
  track: string | null;
  playedAt: number | null;
  nowPlaying: boolean;
}

function timeAgo(timestamp: number): string {
  const secAgo = Math.floor((Date.now() - timestamp) / 1000);
  if (secAgo < 60) return 'just now';
  if (secAgo < 3600) return `${Math.floor(secAgo / 60)}m ago`;
  if (secAgo < 86400) return `${Math.floor(secAgo / 3600)}h ago`;
  return `${Math.floor(secAgo / 86400)}d ago`;
}

export function FounderRow({ sprint, hideTrack = false }: FounderRowProps) {
  const [lastfm, setLastfm] = useState<LastFmState | null>(null);
  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchWeather = async () => {
      try {
        const r = await fetch('/api/weather');
        const data = await r.json();
        if (!cancelled && data.weather) setWeather(data.weather);
      } catch { /* graceful */ }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (hideTrack) return;
    let cancelled = false;

    const fetchTrack = async () => {
      try {
        const r = await fetch('/api/lastfm');
        const data = await r.json();
        if (!cancelled && data.track) setLastfm(data);
      } catch { /* graceful */ }
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 90_000);

    const onVisible = () => { if (!document.hidden) fetchTrack(); };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [hideTrack]);

  return (
    <div className="founder-row">
      <span className="founder-pill">FOUNDER</span>
      {weather && (
        <>
          <span className="founder-item">Chiang Mai {weather}</span>
          {sprint && <span className="founder-sep">·</span>}
        </>
      )}
      {sprint && (
        <span className="founder-item">Day {sprint.day} of {sprint.total} · {sprint.name}</span>
      )}
      {lastfm?.track && (
        <>
          <span className="founder-sep">·</span>
          <span className="founder-track">
            ♪ {lastfm.track}
            {lastfm.playedAt && !lastfm.nowPlaying && ` (${timeAgo(lastfm.playedAt)})`}
            {lastfm.nowPlaying && ' (now)'}
          </span>
        </>
      )}
    </div>
  );
}
