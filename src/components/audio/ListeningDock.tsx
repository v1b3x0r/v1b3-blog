import { useEffect, useState } from 'react';
import { useLastFm } from '../../hooks/useLastFm';
import { isListeningAlive } from '../../lib/lastfm';
import { AmbientRadio } from './AmbientRadio';

function ArtworkFallback() {
  return (
    <span className="listening-banner__art listening-banner__art--fallback" aria-hidden="true">
      ♪
    </span>
  );
}

export function ListeningDock() {
  const lastfm = useLastFm();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (lastfm === undefined) return null;
  if (!lastfm || !isListeningAlive(lastfm, now) || !lastfm.youtubeUrl) {
    return <AmbientRadio />;
  }

  const status = lastfm.nowPlaying ? 'playing at my place' : 'recently at my place';

  return (
    <aside className="listening-dock" aria-label="music at v1b3topia">
      <a
        className="listening-banner"
        href={lastfm.youtubeUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Listen to ${lastfm.title} by ${lastfm.artist} on YouTube`}
      >
        {lastfm.artworkUrl ? (
          <img
            className="listening-banner__art"
            src={lastfm.artworkUrl}
            alt=""
            width="64"
            height="64"
          />
        ) : <ArtworkFallback />}
        <span className="listening-banner__copy">
          <span className="listening-banner__status">
            <span className="listening-banner__pulse" aria-hidden="true" />
            {status}
          </span>
          <strong className="listening-banner__title">{lastfm.title}</strong>
          <span className="listening-banner__artist">{lastfm.artist}</span>
        </span>
        <span className="listening-banner__invite" aria-hidden="true">↗</span>
      </a>
    </aside>
  );
}
