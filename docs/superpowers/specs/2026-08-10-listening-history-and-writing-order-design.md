# Listening history + writing order — design

> 2026-08-10. Two scoped changes: the homepage writing list stops hiding new
> posts, and the listening dock shows the last three tracks instead of one.
> The Post-it idea explored in the same session is **out of scope** and parked.

## Problem

**1. A new post never reached the homepage.** `WritingList.astro` filters on
`data.featured` before sorting. The post published 2026-08-09 carries
`featured: false`, so it was removed from the set before the (already correct)
newest-first sort ran. The bug reads as a sort bug and is not one. Because
`featured` is set by hand in frontmatter, every future post inherits the same
trap.

**2. The dock only ever shows one track.** `/api/lastfm` requests `limit=1`.
The listening history exists upstream; it is simply never fetched.

## Scope

In: the player (`/api/lastfm`, `ListeningDock`, `listening-dock.css`,
`ambient-radio.css`) and the homepage writing order (`WritingList.astro`).

Out: Post-it / site narration, collaborative playlist, the duplicate
`/api/lastfm` fetch caused by `useLastFm` mounting in both `HUDStrip` and
`ListeningDock`, and the now-unused `featured` field on the `posts` schema.

## A. Writing order

Drop the `featured` predicate; take the three newest non-draft posts by date.

```js
const posts = (await getCollection("posts", ({ data }) => !data.draft))
  .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
  .slice(0, 3);
```

New posts now surface with no manual step. `featured` stays in the schema —
removing it is a separate decision — but nothing reads it for posts anymore.

## B. Player

### Data

`/api/lastfm` requests `limit=4` — one more than the three rows shown, because
the now-playing echo below is dropped and would otherwise leave the dock a row
short — and gains one field:

```ts
interface ListeningRow {
  artist: string;
  title: string;
  artworkUrl: string | null;
  youtubeUrl: string;
  playedAt: number | null;   // null while now-playing
  nowPlaying: boolean;
}

interface LastFmState {
  /* every existing field is unchanged */
  history: ListeningRow[];   // older tracks, newest first, max 2
}
```

Every existing top-level field keeps its current meaning, so `HUDStrip` —
which reads only `isListeningAlive(state)` — is unaffected. That constraint is
why history is added alongside the current shape rather than replacing it.

Two upstream quirks the transform must absorb:

- **A now-playing track has no `date`.** Recency for row 1 comes from
  `nowPlaying`, not from a timestamp.
- **Last.fm often repeats the now-playing track as the newest scrobble.** The
  duplicate is dropped by comparing artist + title, so a track never appears
  twice in one dock.

Artwork fallback (`track.getInfo`) still runs only for the leading track.
History rows use whatever artwork the feed carries and fall back to the `♪`
tile. This trades occasional missing art for a single extra request instead of
three.

Relative labels ("14 min ago") are computed client-side from `playedAt`, in
English to match the existing dock copy (`PLAYING AT MY PLACE`).

### Layout

The dock has two treatments, split at `100rem` (1600px).

**Below 100rem — flush bottom bar.** Full width, square corners, a single top
hairline, seated against the viewport bottom with
`env(safe-area-inset-bottom)` absorbed as padding. The surface is full-bleed
while its content stays aligned to the page column, via
`padding-inline: max(0.75rem, (100vw - var(--max-w)) / 2)`. One row is
visible; a chevron expands the two history rows and collapses them again. Each
track row is its own link; the chevron is a separate button so the two actions
never compete.

**At or above 100rem — bottom-right aside.** Keeps the glass card treatment,
`min(280px, (100vw - var(--max-w)) / 2 - 1.5rem)` wide, all three rows always
visible, no chevron.

The breakpoint is set by measurement rather than convention. `main` is capped
at `--max-w: 70rem`, so the gutter is exactly `(viewport - 1120px) / 2`: 160px
at 1440, 196px at 1512, 295px at 1710. An aside wide enough to read needs
roughly 280px, so anything narrower than ~1600px would have the card sitting on
top of the project rows and their status labels. Below that the bar treatment
is used instead, which overlaps nothing at any width. Measured at 1710px, the
aside's left edge lands at 1415px — the content column's right edge exactly.

### Motion

An animated three-bar equalizer replaces the pulse dot when `nowPlaying` is
true; history rows and stale tracks get a static dot, because they are not
playing. Last.fm exposes no playback position, so no progress bar is drawn —
a moving bar would be invented data, which the site's standing rule ("HUD data
must be real or absent") forbids.

Both `prefers-reduced-motion` and the existing `.motion-still` class disable
the animation, matching the current dock and glint behaviour.

### Ambient radio

`AmbientRadio` occupies the same slot and is positioned independently in
`ambient-radio.css` (`fixed; left: 50%; bottom`). It gets the same flush-bottom
and aside treatment; otherwise the dock would jump back to a floating centred
pill whenever the scrobble heartbeat goes quiet.

## Testing

Pure transforms are unit-tested in `src/lib/lastfm.test.ts`: row mapping,
duplicate suppression, missing artwork, missing timestamps, and relative-time
formatting across the minute/hour/day boundaries.

Layout is verified in the browser at 1710px (aside), 1180px and 430px (bar).
Because a maximised Chrome window refuses to resize, the two narrow widths are
checked by mounting the page in same-origin iframes of those widths — media
queries resolve against the iframe, so the real breakpoints are exercised
without disturbing the window.
