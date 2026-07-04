import { useCallback, useEffect, useRef, useState } from 'react';
import { AMBIENT_TRACKS, type AmbientTrack } from '../../data/ambient-tracks';
import { createShuffleBag } from '../../lib/shuffle-bag';

const PREFERENCE_KEY = 'v1b3topia:ambient-radio';

type RadioStatus =
  | 'off'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'blocked'
  | 'unavailable';

function isAutoplayBlock(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'NotAllowedError';
}

export function AmbientRadio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const queueRef = useRef<string[]>([]);
  const failedRef = useRef(new Set<string>());
  const currentRef = useRef<AmbientTrack | null>(null);
  const advancingRef = useRef(false);
  const [current, setCurrent] = useState<AmbientTrack | null>(null);
  const [status, setStatus] = useState<RadioStatus>('off');

  const nextAvailable = useCallback((): AmbientTrack | null => {
    if (failedRef.current.size >= AMBIENT_TRACKS.length) return null;

    for (let attempt = 0; attempt < AMBIENT_TRACKS.length * 2; attempt += 1) {
      if (queueRef.current.length === 0) {
        queueRef.current = createShuffleBag(
          AMBIENT_TRACKS.map((track) => track.id),
          currentRef.current?.id ?? null,
        );
      }

      const id = queueRef.current.shift();
      if (!id || failedRef.current.has(id)) continue;

      const track = AMBIENT_TRACKS.find((candidate) => candidate.id === id);
      if (track) return track;
    }

    return null;
  }, []);

  const playCurrent = useCallback(async (): Promise<void> => {
    const audio = audioRef.current;
    if (!audio) return;

    setStatus('loading');
    try {
      await audio.play();
      setStatus('playing');
    } catch (error) {
      if (isAutoplayBlock(error)) {
        setStatus('blocked');
        return;
      }
      throw error;
    }
  }, []);

  const advance = useCallback(async (): Promise<void> => {
    if (advancingRef.current) return;
    advancingRef.current = true;

    try {
      while (failedRef.current.size < AMBIENT_TRACKS.length) {
        const track = nextAvailable();
        const audio = audioRef.current;
        if (!track || !audio) break;

        currentRef.current = track;
        setCurrent(track);
        audio.src = track.src;
        audio.load();

        try {
          await playCurrent();
          return;
        } catch {
          failedRef.current.add(track.id);
        }
      }

      setStatus('unavailable');
    } finally {
      advancingRef.current = false;
    }
  }, [nextAvailable, playCurrent]);

  useEffect(() => {
    if (window.localStorage.getItem(PREFERENCE_KEY) === 'enabled') {
      void advance();
    }
  }, [advance]);

  useEffect(() => {
    if (status !== 'blocked') return;

    const unlock = () => {
      void playCurrent();
    };

    document.addEventListener('pointerdown', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });

    return () => {
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
    };
  }, [playCurrent, status]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (status === 'playing' || status === 'loading') {
      audio.pause();
      window.localStorage.setItem(PREFERENCE_KEY, 'disabled');
      setStatus('paused');
      return;
    }

    window.localStorage.setItem(PREFERENCE_KEY, 'enabled');
    if (currentRef.current) void playCurrent();
    else void advance();
  };

  const handleFailure = () => {
    if (advancingRef.current) return;

    const failed = currentRef.current;
    if (failed) failedRef.current.add(failed.id);
    void advance();
  };

  const label =
    status === 'off' ? 'v1b3topia radio · enter with sound'
    : status === 'loading' ? 'v1b3topia radio · tuning…'
    : status === 'paused' ? 'v1b3topia radio · paused'
    : status === 'unavailable' ? 'v1b3topia radio · unavailable'
    : current ? `♪ ${current.title} — ${current.artist}`
    : 'v1b3topia radio · enter with sound';

  return (
    <aside className="ambient-radio" aria-label="v1b3topia radio">
      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => void advance()}
        onError={handleFailure}
      />
      <button
        className="ambient-radio__toggle"
        type="button"
        onClick={toggle}
        disabled={status === 'unavailable'}
        aria-label={
          status === 'playing' || status === 'loading'
            ? 'pause v1b3topia radio'
            : 'enter with sound'
        }
      >
        {label}
      </button>
      {current && (
        <>
          <a
            className="ambient-radio__source"
            href={current.sourceUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`source and license for ${current.title}`}
          >
            cc0
          </a>
          <button
            className="ambient-radio__next"
            type="button"
            onClick={() => void advance()}
            disabled={status === 'unavailable'}
            aria-label="play next ambient track"
          >
            next
          </button>
        </>
      )}
    </aside>
  );
}
