# v1b3topia Ambient Radio Design

## Goal

Add a small, persistent ambient radio to v1b3topia. The radio should make the
site feel like one continuous melancholy world while visitors move between the
homepage and project pages.

The musical reference rail is Japanese jazzy and mellow hip-hop: piano-led,
warm drums, restrained jazz or orchestral color, and an emotional balance of
loneliness and lift. Re:plus, GOON TRAX, and Hidetake Takayama describe the
target vocabulary, but their recordings are not assets for this feature.

## MVP Scope

- Three to five locally served tracks with verified CC0 status.
- Instrumental and vocal tracks are both allowed.
- Random playback without repetition until every available track has played.
- A first-visit sound opt-in that satisfies browser autoplay policy.
- Best-effort automatic playback on later visits.
- Continuous playback across internal page navigation.
- Play/pause and next-track controls.
- Visible track title, artist, source, and license provenance.

## Non-Goals

- No Canvas, game engine, waveform visualizer, equalizer, volume mixer, or
  streaming-service integration.
- No use of the founder's Last.fm history as an audio source. Last.fm remains
  presence metadata and cannot supply streamable track audio.
- No attempt to bypass browser autoplay policy.
- No crossfade or gapless playback in the MVP.
- No ingestion pipeline for the founder's private music collection in this PR.

## Architecture

### Shared navigation shell

`BaseLayout.astro` will opt the site into Astro's `ClientRouter`. Every internal
page already uses this layout, so it is the narrowest shared integration point.

An `AmbientRadio` client island will also mount from `BaseLayout.astro`. The
island and its audio element will use `transition:persist` so Astro moves the
same live element into the next page instead of destroying and recreating it.
This preserves playback position and client state during internal navigation.

If client-side navigation is unavailable or JavaScript is disabled, normal
page navigation remains functional. Continuous audio is an enhancement, not a
requirement for reading the site.

### Track manifest as SSOT

`src/data/ambient-tracks.ts` will be the single source of truth for playable
audio and expose a typed immutable track list.

Each track must provide:

```ts
interface AmbientTrack {
  id: string;
  title: string;
  artist: string;
  src: `/audio/${string}.mp3`;
  sourceUrl: `https://${string}`;
  license: 'CC0-1.0';
  vocals: boolean;
  mood: readonly string[];
}
```

The player must not infer licensing or mood from filenames. Adding a future
personal track requires an explicit manifest entry and a different verified
rights value; that schema expansion belongs to the later ingestion project.

### Audio assets

MVP files live in `public/audio/` as normalized MP3 assets. Keep the complete
playlist below 15 MB so the prototype does not create unreasonable repository
or deployment weight.

Audio does not preload before consent. After playback starts, only the current
track is required. The next track may load when selected; the MVP does not
buffer the full playlist.

## Playback Model

### Shuffle bag

The queue uses a shuffle-bag algorithm:

1. Shuffle all track IDs.
2. Play each ID once.
3. When the bag is empty, reshuffle.
4. Prevent the first ID in the new bag from matching the track that just ended
   when more than one track is available.

Random selection accepts an injected random-number function so the behavior is
deterministically testable.

### Consent and autoplay

On a visitor's first visit, the control reads `enter with sound`. Playback
starts only from that explicit action.

The preference is stored locally:

```ts
type AmbientPreference = 'enabled' | 'disabled';
```

On a later visit with `enabled`:

1. Attempt playback immediately.
2. If `HTMLMediaElement.play()` rejects with an autoplay-policy error, enter a
   blocked state without showing a failure.
3. Resume playback on the first pointer, touch, or keyboard interaction.
4. Remove the temporary interaction listeners after playback succeeds or the
   visitor disables the radio.

The player does not store the current track or playback position across a hard
reload. Persistence across Astro client navigation comes from the live
persisted element, not duplicated storage state.

### Track completion and failure

- `ended` advances to the next shuffle-bag entry.
- A track load or decode failure marks that track unavailable for the current
  session and advances once.
- If every manifest entry fails, stop retrying and display `radio unavailable`.
- Pause when the visitor explicitly pauses. Do not automatically pause merely
  because `document.hidden` becomes true; background playback is expected for
  a radio the visitor enabled.

## Interface

The radio is a compact fixed control labeled `v1b3topia radio`, visually
separate from the founder's Last.fm row.

States:

- Off: `v1b3topia radio · enter with sound`
- Loading: `v1b3topia radio · tuning…`
- Playing: `♪ {title} — {artist}`
- Paused: `v1b3topia radio · paused`
- Exhausted: `v1b3topia radio · unavailable`

Controls:

- The main control toggles play/pause.
- A small next button skips to another shuffled track.
- The displayed title links to the track's source page for provenance.

The control remains keyboard accessible, has explicit labels, and does not
capture global keyboard shortcuts. On small screens it stays clear of the
project back link and safe-area inset.

## Music Curation Gate

Implementation may use a track only after verifying the license on the
track-specific source page. Collection-level labels, search filters, and the
phrase “royalty-free” are insufficient evidence.

The initial set must contain at least three tracks that collectively satisfy:

- piano or keyboard as a recurring melodic anchor;
- approximately 70–95 BPM or an equivalent half-time feel;
- jazz, soul, orchestral, or dusty hip-hop texture;
- melancholy without becoming horror ambience;
- no bright café/chillhop track added merely to reach the track count.

If fewer than three suitable CC0 tracks can be verified, stop the asset phase
and report the curation blocker. Do not quietly relax the license to CC BY,
non-commercial, or a platform-specific royalty-free license.

## Testing

Unit tests:

- shuffle bag plays every track once before repeating;
- reshuffle avoids an immediate repeat;
- a failed track is excluded for the session;
- stored preference restores enabled or disabled intent.

Component tests:

- first visit requires explicit activation;
- rejected autoplay waits for the first interaction;
- next advances the queue;
- all-track failure reaches the terminal unavailable state.

Integration checks:

- home-to-project and project-to-home navigation preserve the same audio
  element and playback position;
- project links, browser back/forward, skip link, and existing React islands
  still work under `ClientRouter`;
- `npm test`, `npx astro check`, and `npm run build` pass.

## Documentation

- Add track provenance and license evidence to
  `docs/AMBIENT-RADIO-CREDITS.md`.
- Update `NEXT-SESSION.md` after integration.
- Document the later private-library pipeline separately when that work begins;
  do not mix migration tooling into the runtime player.

## Acceptance Criteria

1. A new visitor can opt into audio with one explicit action.
2. An opted-in returning visitor starts automatically when the browser allows,
   or on their first natural interaction when it does not.
3. Playback continues without restarting through internal project navigation.
4. No track repeats until the available playlist is exhausted.
5. Every shipped track has track-specific CC0 evidence.
6. The readable site remains fully functional when audio is disabled,
   unavailable, or blocked.
