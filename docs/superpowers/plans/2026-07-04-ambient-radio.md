# v1b3topia Ambient Radio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent, opt-in, shuffled CC0 ambient radio that continues playing across v1b3topia page navigation.

**Architecture:** `BaseLayout.astro` becomes the shared client-navigation shell through Astro's `ClientRouter`. A persisted React island owns one HTML audio element, while a typed manifest is the SSOT for local audio files and license provenance. Pure shuffle logic stays in `src/lib` for deterministic tests.

**Tech Stack:** Astro 6.3, React 18, TypeScript 6, Vitest, Testing Library, HTMLMediaElement

---

### Task 1: Curate, normalize, and document the CC0 MVP playlist

**Files:**
- Create: `public/audio/please-dont-go.mp3`
- Create: `public/audio/busted-jazz.mp3`
- Create: `public/audio/coldness.mp3`
- Create: `docs/AMBIENT-RADIO-CREDITS.md`

- [ ] **Step 1: Download the three track-specific CC0 sources to a temporary directory**

Run:

```bash
mkdir -p /tmp/v1b3topia-radio
curl -L --fail \
  'https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/D5klwyMsZK8MgTqSPRiN7EziLUx5LaeDtJgTZ6IC.mp3' \
  -o /tmp/v1b3topia-radio/please-dont-go.source.mp3
curl -L --fail \
  'https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/gKRQyCxgKhxwPv4V3Hr0j8q1IaQU7fM7ROxkQVBJ.mp3' \
  -o /tmp/v1b3topia-radio/busted-jazz.source.mp3
curl -L --fail \
  'https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/AaqghOUzDGVfjrUgMVre0dkgAI3Es3PPrVZ8d6Qo.mp3' \
  -o /tmp/v1b3topia-radio/coldness.source.mp3
```

Expected: three non-empty MP3 files. The verified source pages are:

- `https://freemusicarchive.org/index.php/music/holiznacc0/be-happy-with-who-you-are/please-dont-go-1/`
- `https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill/busted-jazz/`
- `https://freemusicarchive.org/music/stranger/seven-elements/coldness/`

Each page states `CC0 1.0 Universal` for the individual track.

- [ ] **Step 2: Listen to the complete candidate tracks before shipping**

Play all three local source files. Confirm that each track belongs inside the
approved rail: melancholy jazzy/mellow hip-hop, piano or jazz-led, restrained
enough for reading, and not horror ambience or bright café music.

If any track fails the rail, stop Task 1 and report which track failed. Do not
substitute a track without another track-specific CC0 source page.

- [ ] **Step 3: Normalize and compress the approved assets**

Run:

```bash
mkdir -p public/audio
ffmpeg -y -i /tmp/v1b3topia-radio/please-dont-go.source.mp3 \
  -af loudnorm=I=-18:LRA=7:TP=-1.5 -codec:a libmp3lame -b:a 96k \
  public/audio/please-dont-go.mp3
ffmpeg -y -i /tmp/v1b3topia-radio/busted-jazz.source.mp3 \
  -af loudnorm=I=-18:LRA=7:TP=-1.5 -codec:a libmp3lame -b:a 96k \
  public/audio/busted-jazz.mp3
ffmpeg -y -i /tmp/v1b3topia-radio/coldness.source.mp3 \
  -af loudnorm=I=-18:LRA=7:TP=-1.5 -codec:a libmp3lame -b:a 96k \
  public/audio/coldness.mp3
```

Expected: three playable `audio/mpeg` files with a combined size below 15 MB.

- [ ] **Step 4: Write public provenance documentation**

Create `docs/AMBIENT-RADIO-CREDITS.md`:

```md
# v1b3topia ambient radio credits

All MVP tracks are redistributed under
[CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/).
The local MP3 files are volume-normalized, 96 kbps derivatives of the linked
source recordings.

| Local file | Track | Artist | Source and license evidence |
| --- | --- | --- | --- |
| `please-dont-go.mp3` | Please Don't Go | HoliznaCC0 | [Free Music Archive](https://freemusicarchive.org/index.php/music/holiznacc0/be-happy-with-who-you-are/please-dont-go-1/) |
| `busted-jazz.mp3` | Busted Jazz | HoliznaCC0 | [Free Music Archive](https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill/busted-jazz/) |
| `coldness.mp3` | Coldness | The Wanderer | [Free Music Archive](https://freemusicarchive.org/music/stranger/seven-elements/coldness/) |

CC0 does not require attribution. These credits remain part of the repository
so the source and rights of every runtime asset stay auditable.
```

- [ ] **Step 5: Verify asset format and weight**

Run:

```bash
file public/audio/*.mp3
du -ch public/audio/*.mp3
```

Expected: all files report MPEG audio and the total is below 15 MB.

### Task 2: Add the typed track manifest and shuffle bag

**Files:**
- Create: `src/data/ambient-tracks.ts`
- Create: `src/lib/shuffle-bag.ts`
- Create: `src/lib/shuffle-bag.test.ts`

- [ ] **Step 1: Write failing shuffle-bag tests**

Create `src/lib/shuffle-bag.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createShuffleBag } from './shuffle-bag';

describe('createShuffleBag', () => {
  it('contains every id exactly once', () => {
    expect(createShuffleBag(['a', 'b', 'c'], null, () => 0.5).sort())
      .toEqual(['a', 'b', 'c']);
  });

  it('avoids repeating the previous track first', () => {
    const bag = createShuffleBag(['a', 'b', 'c'], 'a', () => 0);
    expect(bag[0]).not.toBe('a');
  });

  it('supports a one-track playlist', () => {
    expect(createShuffleBag(['a'], 'a', () => 0)).toEqual(['a']);
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/lib/shuffle-bag.test.ts`

Expected: FAIL because `./shuffle-bag` does not exist.

- [ ] **Step 3: Implement the minimal shuffle bag**

Create `src/lib/shuffle-bag.ts`:

```ts
export function createShuffleBag<T>(
  items: readonly T[],
  previous: T | null,
  random: () => number = Math.random,
): T[] {
  const bag = [...items];

  for (let index = bag.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [bag[index], bag[swapIndex]] = [bag[swapIndex], bag[index]];
  }

  if (bag.length > 1 && previous !== null && bag[0] === previous) {
    [bag[0], bag[1]] = [bag[1], bag[0]];
  }

  return bag;
}
```

- [ ] **Step 4: Add the manifest SSOT**

Create `src/data/ambient-tracks.ts`:

```ts
export interface AmbientTrack {
  id: string;
  title: string;
  artist: string;
  src: `/audio/${string}.mp3`;
  sourceUrl: `https://${string}`;
  license: 'CC0-1.0';
  vocals: boolean;
  mood: readonly string[];
}

export const AMBIENT_TRACKS = [
  {
    id: 'please-dont-go',
    title: "Please Don't Go",
    artist: 'HoliznaCC0',
    src: '/audio/please-dont-go.mp3',
    sourceUrl: 'https://freemusicarchive.org/index.php/music/holiznacc0/be-happy-with-who-you-are/please-dont-go-1/',
    license: 'CC0-1.0',
    vocals: false,
    mood: ['melancholy', 'lo-fi', 'late-night'],
  },
  {
    id: 'busted-jazz',
    title: 'Busted Jazz',
    artist: 'HoliznaCC0',
    src: '/audio/busted-jazz.mp3',
    sourceUrl: 'https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill/busted-jazz/',
    license: 'CC0-1.0',
    vocals: false,
    mood: ['jazzy', 'dusty', 'warm'],
  },
  {
    id: 'coldness',
    title: 'Coldness',
    artist: 'The Wanderer',
    src: '/audio/coldness.mp3',
    sourceUrl: 'https://freemusicarchive.org/music/stranger/seven-elements/coldness/',
    license: 'CC0-1.0',
    vocals: false,
    mood: ['melancholy', 'piano', 'cinematic'],
  },
] as const satisfies readonly AmbientTrack[];
```

- [ ] **Step 5: Run the focused and full unit tests**

Run:

```bash
npm test -- src/lib/shuffle-bag.test.ts
npm test
```

Expected: focused tests pass and the existing suite remains green.

### Task 3: Build the persistent radio island

**Files:**
- Create: `src/components/audio/AmbientRadio.tsx`
- Create: `src/components/audio/AmbientRadio.test.tsx`
- Create: `src/styles/ambient-radio.css`

- [ ] **Step 1: Write failing component tests for consent and blocked autoplay**

Create `src/components/audio/AmbientRadio.test.tsx`:

```tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AmbientRadio } from './AmbientRadio';

describe('AmbientRadio', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  });

  it('requires explicit consent on a first visit', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play')
      .mockResolvedValue(undefined);

    render(<AmbientRadio />);

    expect(play).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /enter with sound/i }));

    await waitFor(() => expect(play).toHaveBeenCalledOnce());
    expect(localStorage.getItem('v1b3topia:ambient-radio')).toBe('enabled');
  });

  it('retries blocked returning autoplay on the first interaction', async () => {
    localStorage.setItem('v1b3topia:ambient-radio', 'enabled');
    const blocked = new DOMException('blocked', 'NotAllowedError');
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValueOnce(blocked)
      .mockResolvedValue(undefined);

    render(<AmbientRadio />);
    await waitFor(() => expect(play).toHaveBeenCalledOnce());

    fireEvent.pointerDown(document);

    await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
  });

  it('stops after every track fails once', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play')
      .mockResolvedValue(undefined);
    const { container } = render(<AmbientRadio />);
    const audio = container.querySelector('audio');
    if (!audio) throw new Error('audio element missing');

    fireEvent.click(screen.getByRole('button', { name: /enter with sound/i }));
    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));

    fireEvent.error(audio);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
    fireEvent.error(audio);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(3));
    fireEvent.error(audio);

    await screen.findByText(/radio · unavailable/i);
  });
});
```

- [ ] **Step 2: Run the focused component test and verify RED**

Run: `npm test -- src/components/audio/AmbientRadio.test.tsx`

Expected: FAIL because `AmbientRadio` does not exist.

- [ ] **Step 3: Implement the radio island**

Create `src/components/audio/AmbientRadio.tsx`:

```tsx
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

    if (queueRef.current.length === 0) {
      queueRef.current = createShuffleBag(
        AMBIENT_TRACKS.map((track) => track.id),
        currentRef.current?.id ?? null,
      );
    }

    while (queueRef.current.length > 0) {
      const id = queueRef.current.shift();
      if (!id || failedRef.current.has(id)) continue;
      return AMBIENT_TRACKS.find((track) => track.id === id) ?? null;
    }

    return nextAvailable();
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
      const track = nextAvailable();
      const audio = audioRef.current;
      if (!track || !audio) {
        setStatus('unavailable');
        return;
      }

      currentRef.current = track;
      setCurrent(track);
      audio.src = track.src;
      audio.load();
      await playCurrent();
    } catch {
      const failed = currentRef.current;
      if (failed) failedRef.current.add(failed.id);
      advancingRef.current = false;
      await advance();
      return;
    } finally {
      advancingRef.current = false;
    }
  }, [nextAvailable, playCurrent]);

  useEffect(() => {
    if (localStorage.getItem(PREFERENCE_KEY) === 'enabled') {
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
      localStorage.setItem(PREFERENCE_KEY, 'disabled');
      setStatus('paused');
      return;
    }

    localStorage.setItem(PREFERENCE_KEY, 'enabled');
    if (currentRef.current) void playCurrent();
    else void advance();
  };

  const handleFailure = () => {
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
```

- [ ] **Step 4: Add the compact radio styling**

Create `src/styles/ambient-radio.css`:

```css
.ambient-radio {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  max-width: min(32rem, calc(100vw - 2rem));
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--c-line);
  border-radius: 4px;
  background: color-mix(in srgb, var(--c-bg-deepest) 88%, transparent);
  backdrop-filter: blur(12px);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
}

.ambient-radio button,
.ambient-radio a {
  color: var(--c-ink-muted);
  font: inherit;
}

.ambient-radio button {
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.ambient-radio button:hover,
.ambient-radio button:focus-visible,
.ambient-radio a:hover,
.ambient-radio a:focus-visible {
  color: var(--c-accent-warm);
}

.ambient-radio__toggle {
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ambient-radio__source,
.ambient-radio__next {
  flex: none;
}

@media (max-width: 42rem) {
  .ambient-radio {
    left: 1rem;
    right: 1rem;
  }
}
```

- [ ] **Step 5: Run focused tests**

Run: `npm test -- src/components/audio/AmbientRadio.test.tsx`

Expected: 3 tests pass.

### Task 4: Persist the radio through Astro navigation

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add the shared client router and persistent player**

Update `src/layouts/BaseLayout.astro`:

```astro
---
import { ClientRouter } from "astro:transitions";
import { AmbientRadio } from "../components/audio/AmbientRadio";
import "../styles/ambient-radio.css";
import "../styles/global.css";

// Existing props stay unchanged.
---
```

Add `<ClientRouter />` inside `<head>`, then mount the radio immediately after
the skip link:

```astro
<ClientRouter />
```

```astro
<a href="#main" class="skip-link">skip to content</a>
<AmbientRadio client:load transition:persist />
<slot />
```

- [ ] **Step 2: Run automated integration checks**

Run:

```bash
npm test
npx astro check
npm run build
```

Expected: all tests pass, Astro reports zero errors, and the production build
completes.

- [ ] **Step 3: Browser-test persistent navigation on the existing dev port**

Start exactly one server on port 4321. If the port is already occupied by this
project, reuse it; otherwise stop the stale process before starting:

```bash
npm run dev -- --host 127.0.0.1 --port 4321
```

Verify:

1. First load shows `enter with sound` and downloads no MP3.
2. Activating sound begins one of the three tracks.
3. Opening a project preserves the same audio element, current track, and
   playback position.
4. Browser back preserves playback.
5. Next changes track without an immediate repeat.
6. Pause survives internal navigation.
7. Keyboard focus reaches play/pause, source, and next controls.
8. Mobile width does not overlap the project back link.

### Task 5: Update the task log and finish the branch

**Files:**
- Modify: `NEXT-SESSION.md`

- [ ] **Step 1: Record the shipped MVP**

Under `## Done this session`, add:

```md
- Added the persistent `v1b3topia radio`: an opt-in, no-repeat CC0 playlist
  that survives Astro client navigation, with explicit provenance for every
  local audio asset.
```

- [ ] **Step 2: Audit the final scope**

Run:

```bash
git status --short
git diff --check
git diff --stat origin/main...HEAD
```

Expected: only the ambient-radio spec, plan, audio assets, manifest, shuffle
logic, player, shared-layout integration, credits, tests, styles, and task-log
update are present.

- [ ] **Step 3: Commit in reviewable units**

Commit the implementation in this order:

```bash
git add public/audio docs/AMBIENT-RADIO-CREDITS.md
git commit -m "feat(audio): add verified CC0 radio assets"

git add src/data/ambient-tracks.ts src/lib/shuffle-bag.ts src/lib/shuffle-bag.test.ts
git commit -m "feat(audio): add typed ambient playlist"

git add src/components/audio/AmbientRadio.tsx src/components/audio/AmbientRadio.test.tsx src/styles/ambient-radio.css src/layouts/BaseLayout.astro
git commit -m "feat(audio): persist ambient radio across pages"

git add NEXT-SESSION.md docs/superpowers/plans/2026-07-04-ambient-radio.md
git commit -m "docs: record ambient radio rollout"
```

- [ ] **Step 4: Push and open a separate draft PR**

Push `codex/ambient-radio` and open a draft PR targeting `main`. The PR body
must list all three track-specific CC0 source pages and the verification
commands.
