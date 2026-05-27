import { useEffect, useState } from 'react';

export interface CommitInfo {
  repo: string;
  msg: string;
  hash: string;
  relativeTime: string;
  timestamp: number;
}

export interface SprintInfo {
  day: number;
  total: number;
  name: string;
}

interface FounderRowProps {
  lastCommit: CommitInfo | null;
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

export function FounderRow({ lastCommit, sprint, hideTrack = false }: FounderRowProps) {
  const [lastfm, setLastfm] = useState<LastFmState | null>(null);

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

  if (!lastCommit && !sprint) return null;

  return (
    <div className="founder-row">
      <span className="founder-pill">FOUNDER</span>
      {lastCommit && (
        <>
          <span className="founder-item">last commit {lastCommit.relativeTime} · {lastCommit.repo}</span>
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
