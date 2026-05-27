# v1b3topia redesign — design spec

> Date locked: 2026-05-27
> Scope: rebuild homepage + project pages of `v1b3-blog` (Astro 6) with payload-aware Context Resolver pattern, Moon & Sun celestial hero, Doi Suthep horizon, and Kuzco-flavored brand voice as v1b3topia.

---

## 1. Vision

A personal portfolio that behaves like a **construction site at 3am** — quiet, atmospheric, with the founder visibly present (last commit, currently-playing track) and the visitor noticed (payload-tuned rendering). The site is not a marketing surface; it's a window into a place being built.

Aesthetic target: **almost-realistic romantic vibe**. Lonely portfolio. Late-night listening room. Sky before dawn with one figure still awake. Avoid: SVG-rigid vector look, dashboard-y tech-demo energy, marketing-page polish.

Hero metaphor: *"same sky, different bodies showing"*. Visitor and founder share one sky; each sees the celestial body their local time reveals — moon, sun, or both at dawn/dusk. The Chiang Mai horizon (Doi Suthep silhouette) anchors the founder's location.

---

## 2. Core Concept: Context Resolver

**Payload → Resolver → Page.**

The visitor brings a payload (device, atmosphere, state, time, locale). The resolver reads payload at request + hydration time and tunes ~20 knobs on the page. Each visitor sees a personalized rendering. **Signals stay hidden; the response surfaces.**

Anti-pattern (rejected): dashboard that displays the signals (oscilloscope/orbit/satellite frames). This is "signal man" energy and violates the artist principle.

---

## 3. Architecture

### Stack
- **Astro 6** (existing) — static + island orchestration
- **React island** (`@astrojs/react`) — only for the Sky scene, HUD strip, payload resolver. Everything else stays static HTML.
- **SunCalc** (`suncalc`, ~5kb gz) — moon phase + sun/moon position from lat/lon + datetime
- **Motion** (`motion`, ~12kb gz) — declarative entry animations + scroll triggers
- **Lenis** (`lenis`, ~1.5kb gz) — smooth scroll
- **@paper-design/shaders-react** (~28kb gz) — mesh gradient layer behind hero (organic, anti-SVG-rigid)
- **No** Three.js, no R3F, no Magic UI / Aceternity (intentionally restrained).

### Deploy target
- **Vercel** (Astro adapter `@astrojs/vercel`) — needed for edge functions (Last.fm + Open-Meteo proxies) and `Astro.locals.runtime` for visitor geo headers.

### Bundle budget
- Total JS gz: **≤ 65kb**
- Total CSS gz: **≤ 15kb**
- LCP target: < 1.8s on 4g
- INP target: < 200ms
- Save-data + reduce-motion: degrade to ~10kb total JS (skip shaders, skip animation)

---

## 4. File Plan

### New files
```
src/
  components/
    sky/
      Sky.tsx                  React island; orchestrates moon/sun/stars/mountains/grain
      Moon.tsx                 phase-aware rendering via SunCalc
      Sun.tsx                  position + corona pulse
      Stars.tsx                3-tier depth, sized + alpha
      DoiSuthep.tsx            3 mountain ridges + temple hint, blurred for organic edge
      Atmosphere.tsx           haze gradient + vignette + film grain
      MeshBackground.tsx       paper-design shader layer (skipped on save-data)
    hud/
      HUDStrip.tsx             top live status: payload + founder + time
      FounderRow.tsx           commit + Last.fm track + sprint day
      VisitorNoticed.tsx       micro-acknowledgment fade-in on first interaction
    layout/
      ContextResolver.tsx      reads payload + provides via context
      PayloadDebug.tsx         dev-only payload inspector (?debug=payload)
  lib/
    payload.ts                 client-side payload reader (5 categories)
    suncalc-helpers.ts         moon phase string, sun altitude, light/dark hour
    last-build.ts              build-time git data baked at static build
    text-variants.ts           payload → copy variant resolver
  pages/
    index.astro                rebuilt homepage
    api/
      lastfm.ts                edge proxy for Last.fm getRecentTracks
      weather.ts               edge proxy for Open-Meteo (CNX)
    404.astro                  "scary beyond all reason"
    offline.astro              "no touch-a my groove · you're offline"
  content/
    copy/
      hero.json                payload → copy variant table (TH + EN)
      easter-eggs.json         Kuzco-flavored state messages
      founder.json             static founder facts (name, location, social)
  styles/
    tokens.css                 design tokens (colors, type, motion)
    global.css                 base + reset (rewritten)
    sky.css                    sky scene styles
    ground.css                 dot-grid editorial ground
docs/
  superpowers/specs/2026-05-27-v1b3topia-redesign-design.md   (this file)
```

### Files to modify
```
src/layouts/BaseLayout.astro     dark default, font stack, motion-preference body class
src/pages/projects/[...slug].astro   apply atmospheric style refinements
astro.config.mjs                 add @astrojs/react, @astrojs/vercel
package.json                     add deps: react, suncalc, motion, lenis, @paper-design/shaders-react
```

### Files removed
- (none — content collection preserved)

---

## 5. Payload Categories

Five categories of edge-readable signals. The resolver reads them at hydration + maps each to UI knobs. **Edge-derived (country/ASN) and permission-gated (camera/mic/precise geo) are deferred to v2.**

### 5.1 EMBODIMENT
| signal | API | knob |
|---|---|---|
| pointer.type | `@media (pointer:fine\|coarse)` | tooltip ↔ tap-reveal |
| hover.capable | `@media (hover)` | hover effects on/off |
| viewport × dpr | `innerWidth, devicePixelRatio` | density, shader fidelity |
| orientation | `screen.orientation` | portrait ↔ landscape layout |
| gyro/tilt | `DeviceOrientationEvent` | sky parallax on mobile |

### 5.2 ATMOSPHERE
| signal | API | knob |
|---|---|---|
| color-scheme | `prefers-color-scheme` | light/dark palette |
| motion preference | `prefers-reduced-motion` | animations on/off |
| contrast | `prefers-contrast` | subtle ↔ stark |
| color gamut | `@media (color-gamut)` | srgb ↔ p3 deeper colors |
| forced-colors | `@media (forced-colors)` | Windows HC fallback |

### 5.3 STATE
| signal | API | knob |
|---|---|---|
| battery.level | Battery API (FF/Safari) | dim shader if < 20% |
| battery.charging | Battery API | full motion when plugged |
| network.tier | `connection.effectiveType` | shader ↔ static fallback |
| save-data flag | `connection.saveData` | strip animations + shaders |
| tab.visible | Page Visibility API | pause when hidden |
| online ↔ offline | `navigator.onLine` | graceful fallback to 404-style |

### 5.4 TIME · SPACE
| signal | API | knob |
|---|---|---|
| timezone | `Intl.DateTimeFormat().resolvedOptions().timeZone` | "ICT" ↔ "JST" greeting |
| locale | `navigator.language` | copy variant (TH ↔ EN) |
| local hour | computed from tz | dawn / day / dusk / night sky |
| day-of-week | `Date` | weekday ↔ weekend hero copy |

### 5.5 SOFTWARE
| signal | API | knob |
|---|---|---|
| OS family | UA-CH `navigator.userAgentData` | shortcut hints (Cmd ↔ Ctrl) |
| WebGL availability | `canvas.getContext('webgl')` | shader ↔ svg+css fallback |
| GPU class | unmasked renderer (where available) | shader complexity knob |

---

## 6. Founder Presence

Three persistent sources rendered as a thin row beneath the HUD strip — **on every variant including phone**. The visitor "catches a glimpse" of the founder being alive in v1b3topia.

| source | reads | tier | refresh |
|---|---|---|---|
| **GIT** | "last commit 2h ago · homelog" | BUILD-TIME (git log across configured repos) | per deploy |
| **LAST.FM** | "♪ Daughter — Youth (4m ago)" | EDGE FN (proxy to last.fm/user.getRecentTracks) | client fetch on hydration, 60s cache |
| **SPRINT** | "Day 11 of 14 · access core loop" | BUILD-TIME (computed from sprint-start constant) | per deploy |

Optional (deferrable):
- **WORLD-LOG** last entry from `.remember/today-*.md` (require build script to read parent repo path; skip v1)
- **WEATHER CNX** from Open-Meteo (low priority; skip v1 unless trivial)

### Last.fm setup
- Founder creates Last.fm API account at https://www.last.fm/api/account/create
- Callback URL: anything valid (we don't use it)
- Store API key in Vercel env: `LASTFM_API_KEY`
- Store username in: `LASTFM_USER`
- Web Scrobbler Chrome extension scrobbles YouTube/Spotify/Apple Music → Last.fm

### Endpoint contract
```
GET /api/lastfm
→ 200 { track: "Daughter — Youth", playedAt: 1709047200, nowPlaying: false }
→ 200 { track: null, error: "no_recent_track" }   (fallback to git commit)
```
- Edge runtime (Vercel Edge Function)
- 60s cache-control + stale-while-revalidate 300s
- 503 if last.fm down → client shows git commit only

### Display rules
- **Desktop**: full row (commit · track · sprint day)
- **Phone vertical**: 2 lines (commit + track), small mono
- **Phone landscape (save-data)**: commit only (no last.fm fetch), single line
- **Offline**: skip founder row, show "founder offline · last seen 23m ago"

---

## 7. Visual System

### Tokens

```css
/* tokens.css — partial */
:root {
  /* core palette (dark default) */
  --c-bg-deepest: #08070a;
  --c-bg-sky-top: #0a0c1c;
  --c-bg-sky-horizon: #2a1d24;
  --c-bg-ground: #100c0a;
  --c-ink: rgba(245, 238, 222, 0.95);
  --c-ink-muted: rgba(255, 255, 255, 0.55);
  --c-ink-faint: rgba(255, 255, 255, 0.35);
  --c-accent: #d08a5a;
  --c-accent-warm: #f0bd8e;
  --c-accent-cream: #f8d4a8;

  /* night sky cool variant */
  --c-night-moon: #fffaf0;
  --c-night-haze: rgba(110, 140, 180, 0.18);

  /* dawn variant */
  --c-dawn-sky-top: #fbf2e4;
  --c-dawn-sky-mid: #f4d9c0;
  --c-dawn-sky-bottom: #c97a45;
  --c-dawn-sun-core: #fff9e8;
  --c-dawn-sun-mid: #fde4a8;
  --c-dawn-sun-edge: #f5b860;

  /* type */
  --font-mono: ui-monospace, "SFMono-Regular", "Cascadia Code", Menlo, monospace;
  --font-sans: system-ui, -apple-system, "Inter", sans-serif;

  /* motion */
  --ease-out-soft: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --dur-slow: 800ms;
  --dur-med: 400ms;
}

@media (prefers-color-scheme: light) {
  :root { /* dawn variant overrides */ }
}
```

### Sky scene layers (back to front)

1. **Deep sky gradient** — `linear-gradient` 4-stop, deep night→horizon
2. **Mesh background** — `@paper-design/shaders-react` `<MeshGradient>` 6-color drift, very subtle (opacity .35), skipped on save-data
3. **Stars** — 3 tiers (near/mid/far) sized 0.8/1.3/1.8px, twinkle 4-6s, ~14 desktop / 8 mobile
4. **Perspective grid** — SVG lines converging to vanishing point at horizon, copper at 18% alpha
5. **Atmospheric haze** — gradient + 1px blur, color graduates from cool night to warm dusk near horizon
6. **Doi Suthep silhouette** — 3 SVG mountain ridges + temple-hint triangle. **Apply `filter: blur(0.4px)` to soften SVG edge** + radial-gradient `mask` to fade ridge tops. Color: far #3c2837 alpha .7, mid #231e22 alpha .85, near #0f0a0c alpha .95.
7. **Moon bloom halo** — 220px radial-gradient ring at .07 alpha
8. **Moon** — CSS radial-gradient + box-shadow multi-stop bloom + phase shadow + crater texture (3 radial-gradients via `::after` mix-blend-mode multiply)
9. **Sun** — radial-gradient + 3-stop corona pulse animation (5s ease-in-out)
10. **Vignette** — `inset box-shadow 80px 30px rgba(0,0,0,.5)`
11. **Film grain** — inline SVG `feTurbulence` baseFrequency .9 numOctaves 2, opacity .045 mix-blend-mode overlay

### Mountains: anti-SVG-stiff treatment
- Path points jittered slightly between sibling layers (not perfectly aligned ridge peaks → organic)
- `filter: blur(0.4px)` on each ridge SVG (softens line edges)
- Mountain colors blend into haze gradient (radial-gradient mask fades top of ridge by ~15%)
- Tiny temple-hint triangle on Doi Suthep peak: `polygon(...)` SVG, ~3px wide

### Ground (project list)
- Background: `radial-gradient(rgba(208,138,90,0.08) 0.7px, transparent 1px)` at `background-size: 18px 18px` (dot grid Linear/Vercel style)
- Top border: `linear-gradient(90deg, transparent, rgba(208,138,90,0.4), transparent)` 1px (fade-in horizon line)
- Project rows: editorial mono, 9.5px name + 8.5px desc, status pill copper

### Romantic-glow refinements
- All glow halos: **multi-stop** (3-4 stops) radial-gradients, not single
- Moon bloom: 3 nested halos at different sizes (60px, 120px, 220px) with decreasing alpha
- Sun corona: similar 3-stop bloom
- Hero copy: `text-shadow: 0 1px 12px rgba(0,0,0,0.4)` to lift over haze
- All transitions: `--ease-out-soft` not linear (yearning, not snappy)

---

## 8. Brand Voice

**v1b3topia** — Kuzco-flavored, restrained, self-mythologizing.

### Hero copy (canonical, EN)
- "building v1b3topia, *somewhere under this moon.*" (night, both at night)
- "the sun rising on you · *still moon here.*" (visitor dawn, founder night)
- "building v1b3topia, *somewhere in chiang mai.*" (default fallback)

### Hero copy (TH, when locale=th-* or visitor TZ in CNX)
- "ดวงจันทร์ของเธอ คือดวงเดียวกัน" (CNX night, founder + visitor)
- "v1b3topia (ก่อสร้างอยู่)" (subline)

### Subline variants
- "we're sharing the same one tonight — you in {city}, me in chiang mai." (dual-night)
- "you came to watch — stay as long as you like." (universal)
- "(politely. you're on save-data.)" (save-data mode)

### Easter eggs (state → message)
| state | message |
|---|---|
| 404 | "scary beyond all reason." |
| offline (navigator.onLine = false) | "no touch-a my groove. (you're offline.)" |
| loading / transition | "boom, baby." |
| returning visitor (localStorage flag) | "oh, it's you again." |
| save-data | "keep moving forward. (light edition.)" |
| print media query | "why are you printing this?" |

### Tone rules
- Never use exclamation marks except in easter eggs.
- Never use marketing speak ("amazing", "innovative", "revolutionary").
- Lowercase preferred for hero / copy; uppercase reserved for HUD labels and section dividers.
- Italics for the *place clause* ("somewhere under this moon").
- TH copy avoids translation-direct phrases; phrase in natural Thai.

---

## 9. Behavior

### Visitor-noticed micro-acknowledgment
- First `mousemove` or first `touchstart` → trigger fade-in of small badge near hero area:
  - Desktop: "✓ visitor noticed · 03:47 PST · SF"  (uses visitor TZ + edge-derived city if available, else timezone city)
  - Phone vertical TH: "เธอแวะมาดู? นั่งก่อนได้"
  - Phone landscape: skip (respects save-data)
- Animation: opacity 0 → 1 over 800ms, hold 4s, fade out 1.2s
- Triggers **once per session** only; persisted in `sessionStorage`

### Smooth scroll
- Lenis full-page, with `prefers-reduced-motion` fallback to native scroll

### Cursor parallax (desktop only)
- Sky elements (moon + mountains) get subtle cursor parallax: max ±4px translate, eased
- Disabled if `prefers-reduced-motion`

### Gyro tilt (mobile only)
- DeviceOrientation `gamma` → translate sky background ±6px on x-axis
- Disabled if `prefers-reduced-motion` or save-data

### Tab visibility
- When `document.hidden = true` → pause animations
- Resume on visible

### Last.fm refresh
- Initial fetch on hydration
- Refetch every 90s while tab visible
- No refetch if tab hidden

---

## 10. Pages

### `/` (homepage)
1. **HUD strip** (top, sticky in some configs but default static): `V1B3TOPIA | under construction | {visitor.tz time} {visitor.city} · {cnx time} CNX | live ●`
2. **Founder row** (just below HUD): commit · last.fm track · sprint day
3. **Sky scene** (50-70vh hero) with moon and/or sun + mountains + atmosphere
4. **Hero copy** floating over horizon line: hero h1 + subline (payload-varying)
5. **Ground** (dot grid bg): editorial project list (5 projects featured, link to detail)
6. **Footer**: tiny brand + signature ("from chiang mai · with melancholy")

### `/projects/[slug]`
- Refined editorial layout (atmospheric haze top, dot grid bg)
- Tiny sky band at top showing moon/sun phase (reminder visitor is in v1b3topia)
- Project article body uses content collection (existing)
- Related projects retained
- Back to home link styled as "← return to sky"

### `/404`
- Black background, single line of text: "scary beyond all reason."
- Subline: "this isn't on the map of v1b3topia."
- Link: "← return to chiang mai"

### `/offline` (Service Worker offline fallback — optional v2)
- Skip in v1 unless PWA scope expands

---

## 11. Endpoints

### `/api/lastfm`
- **Runtime**: Vercel Edge
- **Cache**: `s-maxage=60, stale-while-revalidate=300`
- **Implementation**:
  ```ts
  export const config = { runtime: 'edge' };
  export default async function handler(req: Request) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;
    const r = await fetch(url, { cf: { cacheTtl: 60 } });
    if (!r.ok) return Response.json({ track: null, error: 'lastfm_down' }, { status: 503 });
    const data = await r.json();
    const t = data?.recenttracks?.track?.[0];
    if (!t) return Response.json({ track: null });
    return Response.json({
      track: `${t.artist['#text']} — ${t.name}`,
      playedAt: t.date ? parseInt(t.date.uts, 10) * 1000 : null,
      nowPlaying: !!t['@attr']?.nowplaying,
    }, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } });
  }
  ```
- **Failure mode**: 503 → client hides track row, keeps git commit + sprint day

### `/api/weather` (deferrable to v2)
- Open-Meteo for Chiang Mai
- Cache 30 min
- Returns temperature + condition string for HUD

---

## 12. Build-time Data

### Git data baker (`scripts/bake-git.mjs`)
- Run as Astro integration during `astro build`
- `git log -1 --format='%cr|%s|%H'` for each watched repo (configured list)
- Output: `src/data/founder-build.json`:
  ```json
  {
    "lastCommit": { "repo": "homelog", "msg": "Track A+F coalescer", "relativeTime": "2h ago", "hash": "abc1234" },
    "sprintDay": { "day": 11, "total": 14, "name": "access core loop" },
    "buildTime": "2026-05-27T17:47:00+07:00"
  }
  ```
- Imported as static at build time; no runtime git access

### Sprint config (`src/data/sprint.ts`)
- Static constant: sprint start date + total days + name
- Computes current day at build via Date diff
- **After a sprint ends**: edit this file to point to the next sprint (or set to `null` to hide the sprint row entirely). The FounderRow component reads this; no component code changes needed.
- Example shape:
  ```ts
  export const sprint = {
    name: "access core loop",
    start: "2026-05-17",   // ISO date
    days: 14,
  } as const;
  // set to null when no active sprint
  ```

---

## 13. Content collections

### `content/projects/` (existing)
- Keep schema
- Add field: `kind` (existing) used for status mapping in UI

### `content/copy/hero.json` (new)
- Payload-conditional hero copy
- Schema:
  ```ts
  {
    variant: {
      key: string;  // "dual-night" | "dawn-on-you" | "default"
      conditions: { localHour?: [n,n]; locale?: string; cnxHour?: [n,n] };
      copy: { en: { h1: string; sub: string }; th?: { h1: string; sub: string } };
    }[];
  }
  ```

### `content/copy/easter-eggs.json` (new)
- State → message map

---

## 14. Performance & Accessibility

### Performance
- Initial HTML < 25kb gz (server-rendered)
- Critical CSS inlined for hero + HUD
- React island deferred via Astro `client:idle` (not client:load)
- Mesh shader: `client:visible` (start after hero visible)
- Last.fm fetch: `client:idle`
- `save-data` true → no mesh shader, no last.fm fetch, no film grain animation

### Accessibility
- **Reduced motion**: full path. All animations gate on `@media (prefers-reduced-motion: no-preference)`. Sky scene becomes static composition.
- **Color contrast**: hero copy ≥ AAA against sky (4.5:1 minimum)
- **Keyboard nav**: visible focus rings on all links, skip-to-content link
- **Screen reader**: semantic header/main/footer, sky scene marked `role="img"` with descriptive `aria-label="night sky over chiang mai with waxing gibbous moon"` (dynamic)
- **Forced colors**: full Windows HC fallback (no gradients, system colors)
- **Locale**: `<html lang>` set from `navigator.language` fallback `en`

---

## 15. Implementation Phases

Eight phases, each independently shippable, in order:

### Phase 1 — Foundation (estimate: 1 session)
- Add `@astrojs/react`, `@astrojs/vercel`, react, react-dom to package.json
- Set up `tsconfig.json` for React JSX
- Create `tokens.css`, restructure `global.css`
- BaseLayout updates: font stack, body class for motion preference, dark default
- **Acceptance**: `astro build` succeeds; existing pages render unchanged

### Phase 2 — Payload reader (estimate: 1 session)
- Implement `lib/payload.ts` — reads all 5 categories at hydration
- Implement `ContextResolver.tsx` (React context provider)
- Add `PayloadDebug.tsx` accessible via `?debug=payload` query
- Write unit tests for payload combinators (jest or vitest)
- **Acceptance**: `?debug=payload` shows current visitor's full payload as JSON overlay

### Phase 3 — Sky scene (estimate: 2 sessions)
- `Sky.tsx` orchestrator
- `Moon.tsx` with SunCalc phase + position math
- `Sun.tsx` with corona pulse
- `Stars.tsx` 3-tier
- `DoiSuthep.tsx` 3 ridges + temple hint + blur
- `Atmosphere.tsx` haze + vignette + grain
- Layer composition CSS in `sky.css`
- **Acceptance**: hero matches mockup v9 visual; renders correctly at desktop 1440px, mobile 390x844, landscape 844x390

### Phase 4 — Mesh background (estimate: 1 session)
- Integrate `@paper-design/shaders-react` `MeshGradient`
- Skip on save-data + reduce-motion via payload context
- **Acceptance**: subtle warm mesh visible behind sky; performance budget held

### Phase 5 — HUD + Founder presence (estimate: 1 session)
- `HUDStrip.tsx` with payload-derived time + city
- `FounderRow.tsx` rendering git commit + last.fm track + sprint day
- `pages/api/lastfm.ts` edge function
- `scripts/bake-git.mjs` Astro integration
- **Acceptance**: HUD updates per second client-side; last.fm row shows real track; git commit renders

### Phase 6 — Content + copy variants (estimate: 1 session)
- `content/copy/hero.json` + `content/copy/easter-eggs.json`
- `lib/text-variants.ts` resolver: payload → variant key → copy
- Hero component reads + renders selected variant
- TH and EN copy paths
- **Acceptance**: visitor with `?force-payload=...` query renders all variants correctly

### Phase 7 — Project list refinement (estimate: 1 session)
- Refactor existing project rows with dot-grid bg
- Update ProjectLayout styling for atmospheric continuity
- 404 page + offline page
- **Acceptance**: project list reads from collection, links work, individual project pages match new atmospheric system

### Phase 8 — Polish, performance, a11y QA (estimate: 1-2 sessions)
- Lighthouse audit: perf, a11y, best-practices, SEO
- Bundle analysis (must hit budget)
- Cross-browser: Safari/Firefox/Chrome
- Mobile: iOS Safari + Android Chrome
- Reduced-motion + forced-colors + save-data: full audit
- Animation timing fine-tuning
- **Acceptance**: Lighthouse mobile ≥ 95 perf, ≥ 100 a11y; bundle within budget

### Deferred to v2 (out of scope for this spec)
- Weather endpoint + display
- Edge-derived city from CDN headers
- Permission-gated signals (camera, mic, precise geo)
- WorldLog last-entry parsing
- PWA + offline service worker
- Returning-visitor logic (localStorage greeting)
- Print stylesheet refinement

---

## 16. Risks & Open Questions

### Risks
- **paper-design/shaders bundle size** — verify gzipped size; budget can absorb but verify
- **SunCalc geographic scope** — v1 renders sky from **CNX coordinates only** (lat 18.79, lng 98.99). Visitor's local time only selects copy variant (dawn/day/dusk/night) and sky-color palette. The moon/sun positions in the rendered sky are *founder's view*, not visitor's. This is intentional (the metaphor is "you're peeking into where I am"). Visitor's actual local sky is NOT rendered in v1.
- **Last.fm API quota** — public read endpoint has no documented hard quota but be respectful; 60s cache should keep us under any reasonable limit
- **Vercel free-tier edge fn quota** — Vercel hobby plan: 1M edge requests / month, easily within budget

### Open questions
- **Last.fm graceful degradation timing** — if API down for hours, do we cache last known good and show "(last seen 2h ago)" or hide row? Default: hide after 5min stale.
- **Project ordering by payload** — should mobile visitors see mobile-relevant projects ranked higher? Default v1: same order for all.
- **Greeting copy on returning visitor** — deferred until v2 (need localStorage strategy; out of scope).

### Things explicitly NOT in scope
- Analytics/tracking
- Cookie banner (no cookies)
- Newsletter signup
- Contact form
- Blog with multiple posts (this is a portfolio, not a blog)
- Comments
- Search

---

## 17. Visual references (kept locally)

Mockup iterations in `.superpowers/brainstorm/32258-1779876783/content/`:
- `direction-v2.html` — initial Orb/Signal/NodeField direction comparison
- `direction-v3.html` — refined globe + signal stream with 7 channels
- `payload-inventory.html` — Context Resolver reframe with full signal inventory
- `payload-render-clear.html` — first clean "same page, 3 payloads" demo
- `payload-render-kuzco.html` — Kuzcotopia voice landing
- `payload-render-v6.html` — observable + founder presence layer
- `orbit-demo.html` — sci-fi orbits direction (rejected as too meta)
- `payload-render-v8-sky.html` — Moon & Sun direction (the lock direction, simpler)
- `payload-render-v9-depth.html` — final locked direction with depth + Doi Suthep ← canonical

These are local-only (`.superpowers/` is gitignored). The canonical visual reference is **v9-depth**.

---

## 18. Success criteria

The redesign is "done" when:

1. A visitor on macOS Chrome at 3am PST sees a night sky with a 78% waxing gibbous moon over Doi Suthep, hero copy reading "*building v1b3topia, somewhere under this moon*", founder row showing the actual last commit and currently-playing track from Last.fm.
2. The same content URL opened on an iPhone Safari at 7am JST shows a dawn sky with sun rising over distant hills, save-data layout, copy reading "*the sun rising on you · still moon here.*", and a single founder row with the latest git commit.
3. A user in Chiang Mai at 11pm on Android Chrome sees a Thai-language hero "ดวงจันทร์ของเธอ คือดวงเดียวกัน" with the same waxing gibbous moon, founder row in Thai, and gyro tilt parallax on the sky.
4. Lighthouse mobile perf ≥ 95.
5. The portfolio feels **lonely**, **romantic**, **almost-realistic** — not techy, not slick.

If you (the reviewer) read this spec and ask *"this is just a personal portfolio — why does it need all this?"*, the answer is: **it's a love letter from chiang mai, not a marketing surface**. The technical depth IS the design.

— v1b3x0r, 2026-05-27
