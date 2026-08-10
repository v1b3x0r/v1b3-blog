import { useEffect, useState } from 'react';
import { useLastFm } from '../../hooks/useLastFm';
import { formatPlayedAgo, isListeningAlive, type ListeningRow } from '../../lib/lastfm';
import { AmbientRadio } from './AmbientRadio';

function ArtworkFallback({ modifier }: { modifier: string }) {
  return (
    <span className={`${modifier} listening-art--fallback`} aria-hidden="true">
      ♪
    </span>
  );
}

function Artwork({ src, size, modifier }: { src: string | null; size: number; modifier: string }) {
  if (!src) return <ArtworkFallback modifier={modifier} />;
  return <img className={modifier} src={src} alt="" width={size} height={size} />;
}

function Equalizer() {
  return (
    <span className="listening-eq" aria-hidden="true">
      <span /><span /><span />
    </span>
  );
}

function PastRow({ row, now }: { row: ListeningRow; now: number }) {
  const ago = formatPlayedAgo(row.playedAt, now);

  return (
    <li>
      <a
        className="listening-past"
        href={row.youtubeUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Listen to ${row.title} by ${row.artist} on YouTube`}
      >
        <Artwork src={row.artworkUrl} size={28} modifier="listening-past__art" />
        <span className="listening-past__copy">
          <span className="listening-past__title">{row.title}</span>
          <span className="listening-past__meta">
            {row.artist}{ago ? ` · ${ago}` : ''}
          </span>
        </span>
      </a>
    </li>
  );
}

export function ListeningDock() {
  const lastfm = useLastFm();
  const [now, setNow] = useState(Date.now());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (lastfm === undefined) return null;
  if (!lastfm || !isListeningAlive(lastfm, now) || !lastfm.youtubeUrl) {
    return <AmbientRadio />;
  }

  const status = lastfm.nowPlaying ? 'playing at my place' : 'recently at my place';
  const history = lastfm.history ?? [];

  return (
    <aside
      className={`listening-dock${expanded ? ' listening-dock--expanded' : ''}`}
      aria-label="music at v1b3topia"
    >
      <div className="listening-panel">
        <div className="listening-lead">
          <a
            className="listening-banner"
            href={lastfm.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Listen to ${lastfm.title} by ${lastfm.artist} on YouTube`}
          >
            <Artwork src={lastfm.artworkUrl} size={64} modifier="listening-banner__art" />
            <span className="listening-banner__copy">
              <span className="listening-banner__status">
                {lastfm.nowPlaying
                  ? <Equalizer />
                  : <span className="listening-banner__dot" aria-hidden="true" />}
                {status}
              </span>
              <strong className="listening-banner__title">{lastfm.title}</strong>
              <span className="listening-banner__artist">{lastfm.artist}</span>
            </span>
            <span className="listening-banner__invite" aria-hidden="true">↗</span>
          </a>

          {history.length > 0 && (
            <button
              className="listening-toggle"
              type="button"
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
              aria-controls="listening-history"
              aria-label={expanded ? 'hide what played before' : 'show what played before'}
            >
              <span className="listening-toggle__chevron" aria-hidden="true" />
            </button>
          )}
        </div>

        {history.length > 0 && (
          <ol className="listening-history" id="listening-history">
            {history.map((row) => (
              <PastRow key={`${row.artist}-${row.title}-${row.playedAt}`} row={row} now={now} />
            ))}
          </ol>
        )}
      </div>
    </aside>
  );
}
