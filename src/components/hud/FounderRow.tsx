import { useEffect, useState } from 'react';

export interface SprintInfo {
  day: number;
  total: number;
  name: string;
}

interface FounderRowProps {
  sprint: SprintInfo | null;
}

export function FounderRow({ sprint }: FounderRowProps) {
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
    </div>
  );
}
