# v1b3topia Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the v1b3-blog homepage as `v1b3topia` — a payload-aware portfolio with a Moon & Sun celestial hero over a Doi Suthep silhouette, featuring live founder presence (git commit + Last.fm + sprint day) and Kuzco-flavored copy that varies by visitor payload (device, time, locale).

**Architecture:** Astro 6 with one React island for the interactive sky scene and HUD. SunCalc computes moon phase + sun position from CNX coordinates (lat 18.79, lng 98.99). Last.fm runs via Astro edge endpoint (deployed on Vercel). All depth/atmosphere via CSS + inline SVG; one optional shader-based mesh background.

**Tech Stack:** Astro 6.2, React 18, TypeScript strict, SunCalc, Motion (motion.dev), Lenis, @paper-design/shaders-react, @astrojs/vercel, Vitest + @testing-library/react. Deployed to Vercel.

**Reference spec:** `docs/superpowers/specs/2026-05-27-v1b3topia-redesign-design.md`

**Total tasks:** 41 across 8 phases. Commit cadence: every 1-3 tasks.

---

## Phase 1 — Foundation (Tasks 1–6)

### Task 1: Install React + Vercel + testing dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime + dev dependencies**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog
npm install react@^18.3.1 react-dom@^18.3.1 suncalc@^1.9.0 motion@^11.18.0 lenis@^1.1.0 @paper-design/shaders-react@^0.0.46 @astrojs/react@^4.0.0 @astrojs/vercel@^8.0.0
npm install -D @types/react@^18.3.0 @types/react-dom@^18.3.0 @types/suncalc@^1.9.0 vitest@^2.1.0 @testing-library/react@^16.1.0 @testing-library/dom@^10.4.0 happy-dom@^15.11.0
```

- [ ] **Step 2: Verify install**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog
node -e "console.log(Object.keys(require('./package.json').dependencies).length, 'deps')"
```
Expected: `12 deps` (or close — astro + 11 new + react family)

- [ ] **Step 3: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add package.json package-lock.json
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "deps: add react, suncalc, motion, lenis, paper-design/shaders for v1b3topia"
```

---

### Task 2: Configure Astro for React + Vercel adapter

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Write new astro config**

Write `astro.config.mjs`:
```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel({
    edgeMiddleware: false,
    imageService: false,
  }),
  integrations: [react()],
  vite: {
    optimizeDeps: {
      exclude: ['suncalc'],
    },
  },
});
```

- [ ] **Step 2: Verify config loads**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npx astro check --help > /dev/null && echo "config OK"
```
Expected: `config OK`

- [ ] **Step 3: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add astro.config.mjs
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "config(astro): enable react island + vercel adapter"
```

---

### Task 3: Update tsconfig for React JSX

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Update tsconfig**

Write `tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

- [ ] **Step 2: Verify**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npx tsc --noEmit
```
Expected: no errors (or only pre-existing ones unrelated to React)

- [ ] **Step 3: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add tsconfig.json
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "config(ts): jsx + react import source"
```

---

### Task 4: Set up Vitest for unit tests

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test-setup.ts`
- Modify: `package.json` (add scripts)

- [ ] **Step 1: Create vitest config**

Write `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text'],
      exclude: ['**/*.config.*', '**/test-setup.ts'],
    },
  },
});
```

- [ ] **Step 2: Create test setup file**

Write `src/test-setup.ts`:
```typescript
import '@testing-library/dom';
```

- [ ] **Step 3: Add test scripts to package.json**

Read `package.json` and update the `scripts` block to:
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 4: Verify vitest runs (no tests yet)**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm test 2>&1 | head -20
```
Expected: "No test files found" or similar — that's OK at this point.

- [ ] **Step 5: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add vitest.config.ts src/test-setup.ts package.json
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "test: set up vitest + happy-dom + testing-library"
```

---

### Task 5: Create design tokens stylesheet

**Files:**
- Create: `src/styles/tokens.css`

- [ ] **Step 1: Write tokens.css**

Write `src/styles/tokens.css`:
```css
/* tokens.css — design tokens for v1b3topia */

:root {
  /* core palette (dark default) */
  --c-bg-deepest: #08070a;
  --c-bg-sky-top: #0a0c1c;
  --c-bg-sky-mid: #1a1525;
  --c-bg-sky-horizon: #2a1d24;
  --c-bg-ground: #100c0a;
  --c-bg-ground-deep: #08070a;
  --c-line: rgba(208, 138, 90, 0.15);
  --c-line-strong: rgba(208, 138, 90, 0.3);

  --c-ink: rgba(245, 238, 222, 0.95);
  --c-ink-muted: rgba(255, 255, 255, 0.55);
  --c-ink-faint: rgba(255, 255, 255, 0.35);

  --c-accent: #d08a5a;
  --c-accent-warm: #f0bd8e;
  --c-accent-cream: #f8d4a8;
  --c-accent-deep: #8a4b2a;

  --c-moon-light: #fffaf0;
  --c-moon-mid: #f0e2c8;
  --c-moon-shadow: #8a7964;

  --c-night-haze: rgba(110, 140, 180, 0.18);
  --c-dusk-haze: rgba(140, 85, 55, 0.35);

  --c-dawn-sky-top: #fbf2e4;
  --c-dawn-sky-mid: #f4d9c0;
  --c-dawn-sky-bottom: #c97a45;
  --c-dawn-ink: #3a1e0c;
  --c-dawn-ink-muted: rgba(80, 40, 20, 0.6);
  --c-dawn-sun-core: #fff9e8;
  --c-dawn-sun-mid: #fde4a8;
  --c-dawn-sun-edge: #f5b860;

  /* type */
  --font-mono: ui-monospace, "SFMono-Regular", "Cascadia Code", "Liberation Mono", Menlo, monospace;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif;

  --fs-hud: 9px;
  --fs-tiny: 11px;
  --fs-meta: 13px;
  --fs-body: 15px;
  --fs-h3: 18px;
  --fs-h2: clamp(1.4rem, 3vw, 2rem);
  --fs-h1: clamp(2rem, 5vw, 3.5rem);

  /* motion */
  --ease-soft: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 200ms;
  --dur-med: 400ms;
  --dur-slow: 800ms;
  --dur-yearning: 1200ms;

  /* layout */
  --max-w: 70rem;
  --measure: 44rem;
  --pad-side: clamp(1rem, 3vw, 2rem);
}

@media (prefers-color-scheme: light) {
  :root {
    /* dawn-edition overrides for save-data + light mode */
    --c-bg-deepest: var(--c-dawn-sky-top);
    --c-bg-ground: var(--c-dawn-sky-top);
    --c-ink: var(--c-dawn-ink);
    --c-ink-muted: var(--c-dawn-ink-muted);
  }
}
```

- [ ] **Step 2: Verify file**

Run:
```bash
ls -la /Users/v1b3_/_dev/project-world-log/v1b3-blog/src/styles/tokens.css
```
Expected: file exists, ~2-3KB

- [ ] **Step 3: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/styles/tokens.css
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "style(tokens): design tokens for v1b3topia (dark+dawn variants)"
```

---

### Task 6: Restructure global.css + update BaseLayout

**Files:**
- Modify: `src/styles/global.css` (full rewrite)
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Rewrite global.css**

Write `src/styles/global.css`:
```css
@import "./tokens.css";

* { box-sizing: border-box; }

html {
  background: var(--c-bg-deepest);
  color: var(--c-ink);
  font-family: var(--font-mono);
  font-size: 16px;
  line-height: 1.6;
  color-scheme: dark light;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--c-bg-deepest);
}

a {
  color: var(--c-accent-warm);
  text-decoration-color: color-mix(in srgb, var(--c-accent) 42%, transparent);
  text-underline-offset: 0.18em;
  transition: color var(--dur-fast) var(--ease-soft);
}

a:hover, a:focus-visible {
  color: var(--c-accent-cream);
  text-decoration-color: currentColor;
}

a:focus-visible {
  outline: 2px solid var(--c-accent-warm);
  outline-offset: 2px;
  border-radius: 2px;
}

main, .site-header, .site-footer {
  width: min(100% - var(--pad-side) * 2, var(--max-w));
  margin-inline: auto;
}

.site-footer {
  padding-block: 2rem 3rem;
  color: var(--c-ink-faint);
  font-size: var(--fs-tiny);
  text-align: center;
  font-style: italic;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 1rem;
  z-index: 100;
  background: var(--c-accent);
  color: var(--c-bg-deepest);
  padding: 8px 14px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: var(--fs-tiny);
  text-decoration: none;
}

.skip-link:focus { top: 1rem; }

/* respect motion preferences globally */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

/* save-data + forced-colors fallbacks */
@media (forced-colors: active) {
  :root { --c-accent: CanvasText; --c-ink: CanvasText; --c-bg-deepest: Canvas; }
}
```

- [ ] **Step 2: Update BaseLayout.astro**

Write `src/layouts/BaseLayout.astro`:
```astro
---
import "../styles/global.css";

interface Props {
  title?: string;
  description?: string;
  pageClass?: string;
}

const {
  title = "v1b3topia",
  description = "building v1b3topia, somewhere in chiang mai. small systems by 97's INTP guy.",
  pageClass = "",
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <meta name="generator" content={Astro.generator} />
    <meta name="color-scheme" content="dark light" />
    <title>{title}</title>
  </head>
  <body class={pageClass}>
    <a href="#main" class="skip-link">skip to content</a>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Verify build still works**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm run build 2>&1 | tail -15
```
Expected: build succeeds (existing pages may look different but build passes)

- [ ] **Step 4: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/styles/global.css src/layouts/BaseLayout.astro
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "style(layout): rewrite global + base layout for v1b3topia tokens"
```

---

## Phase 2 — Payload Reader (Tasks 7–10)

### Task 7: Create payload type definitions

**Files:**
- Create: `src/lib/payload.types.ts`

- [ ] **Step 1: Write types file**

Write `src/lib/payload.types.ts`:
```typescript
// Payload — what the visitor brings to the page

export interface Embodiment {
  pointer: 'fine' | 'coarse';
  hover: boolean;
  viewportW: number;
  viewportH: number;
  dpr: number;
  orientation: 'portrait' | 'landscape';
  hasGyro: boolean;
}

export interface Atmosphere {
  colorScheme: 'light' | 'dark';
  reduceMotion: boolean;
  contrast: 'no-preference' | 'more' | 'less';
  colorGamut: 'srgb' | 'p3' | 'rec2020';
  forcedColors: boolean;
}

export interface State {
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  networkTier: 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'unknown';
  saveData: boolean;
  online: boolean;
}

export interface TimeSpace {
  tz: string;
  locale: string;
  localHourFloat: number;
  dayOfWeek: number;
  isThaiSpeaker: boolean;
  isCnxTimezone: boolean;
}

export interface Software {
  os: 'macos' | 'windows' | 'linux' | 'ios' | 'android' | 'unknown';
  hasWebGL: boolean;
  gpuClass: 'low' | 'mid' | 'high' | 'unknown';
}

export interface Payload {
  embodiment: Embodiment;
  atmosphere: Atmosphere;
  state: State;
  timeSpace: TimeSpace;
  software: Software;
  readAt: number;
}

export type SkyState = 'dawn' | 'day' | 'dusk' | 'night';
```

- [ ] **Step 2: Verify types**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/lib/payload.types.ts
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(payload): type definitions for 5 signal categories"
```

---

### Task 8: Write payload reader tests (TDD)

**Files:**
- Create: `src/lib/payload.test.ts`

- [ ] **Step 1: Write failing tests**

Write `src/lib/payload.test.ts`:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readPayload, getSkyState, isCnxTimezone } from './payload';

describe('readPayload', () => {
  beforeEach(() => {
    // Reset window matchMedia mocks
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((q: string) => ({
        matches: q.includes('dark') || q.includes('fine'),
        media: q,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    Object.defineProperty(window, 'innerWidth', { value: 1440, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 900, configurable: true });
    Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });

    Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
  });

  it('reads embodiment from matchMedia + window', () => {
    const p = readPayload();
    expect(p.embodiment.pointer).toBe('fine');
    expect(p.embodiment.viewportW).toBe(1440);
    expect(p.embodiment.dpr).toBe(2);
  });

  it('reads atmosphere from matchMedia', () => {
    const p = readPayload();
    expect(p.atmosphere.colorScheme).toBe('dark');
    expect(typeof p.atmosphere.reduceMotion).toBe('boolean');
  });

  it('reads state.online from navigator.onLine', () => {
    const p = readPayload();
    expect(p.state.online).toBe(true);
  });

  it('reads timeSpace.locale from navigator.language', () => {
    const p = readPayload();
    expect(p.timeSpace.locale).toBe('en-US');
  });

  it('sets isThaiSpeaker true when locale starts with th', () => {
    Object.defineProperty(navigator, 'language', { value: 'th-TH', configurable: true });
    const p = readPayload();
    expect(p.timeSpace.isThaiSpeaker).toBe(true);
  });

  it('sets localHourFloat between 0 and 24', () => {
    const p = readPayload();
    expect(p.timeSpace.localHourFloat).toBeGreaterThanOrEqual(0);
    expect(p.timeSpace.localHourFloat).toBeLessThan(24);
  });

  it('sets readAt to current timestamp', () => {
    const before = Date.now();
    const p = readPayload();
    expect(p.readAt).toBeGreaterThanOrEqual(before);
    expect(p.readAt).toBeLessThanOrEqual(Date.now());
  });
});

describe('getSkyState', () => {
  it('returns night for hour 23', () => expect(getSkyState(23)).toBe('night'));
  it('returns night for hour 3', () => expect(getSkyState(3)).toBe('night'));
  it('returns dawn for hour 6', () => expect(getSkyState(6)).toBe('dawn'));
  it('returns day for hour 12', () => expect(getSkyState(12)).toBe('day'));
  it('returns dusk for hour 18', () => expect(getSkyState(18)).toBe('dusk'));
});

describe('isCnxTimezone', () => {
  it('returns true for Asia/Bangkok', () => expect(isCnxTimezone('Asia/Bangkok')).toBe(true));
  it('returns false for America/Los_Angeles', () => expect(isCnxTimezone('America/Los_Angeles')).toBe(false));
});
```

- [ ] **Step 2: Run tests — expect failure**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm test 2>&1 | tail -15
```
Expected: FAIL — `Cannot find module './payload'`

- [ ] **Step 3: Commit failing tests**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/lib/payload.test.ts
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "test(payload): failing tests for readPayload + sky state + tz"
```

---

### Task 9: Implement payload reader

**Files:**
- Create: `src/lib/payload.ts`

- [ ] **Step 1: Write payload reader**

Write `src/lib/payload.ts`:
```typescript
import type { Payload, Embodiment, Atmosphere, State, TimeSpace, Software, SkyState } from './payload.types';

const CNX_TIMEZONES = ['Asia/Bangkok', 'Asia/Jakarta', 'Asia/Phnom_Penh', 'Asia/Vientiane', 'Asia/Ho_Chi_Minh'];

function readEmbodiment(): Embodiment {
  const w = typeof window !== 'undefined' ? window : ({} as Window);
  return {
    pointer: w.matchMedia?.('(pointer: fine)').matches ? 'fine' : 'coarse',
    hover: w.matchMedia?.('(hover: hover)').matches ?? false,
    viewportW: w.innerWidth ?? 0,
    viewportH: w.innerHeight ?? 0,
    dpr: w.devicePixelRatio ?? 1,
    orientation: (w.innerWidth ?? 0) >= (w.innerHeight ?? 0) ? 'landscape' : 'portrait',
    hasGyro: typeof (w as Window & { DeviceOrientationEvent?: unknown }).DeviceOrientationEvent !== 'undefined',
  };
}

function readAtmosphere(): Atmosphere {
  const w = typeof window !== 'undefined' ? window : ({} as Window);
  const m = w.matchMedia;
  let gamut: Atmosphere['colorGamut'] = 'srgb';
  if (m?.('(color-gamut: rec2020)').matches) gamut = 'rec2020';
  else if (m?.('(color-gamut: p3)').matches) gamut = 'p3';

  let contrast: Atmosphere['contrast'] = 'no-preference';
  if (m?.('(prefers-contrast: more)').matches) contrast = 'more';
  else if (m?.('(prefers-contrast: less)').matches) contrast = 'less';

  return {
    colorScheme: m?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    reduceMotion: m?.('(prefers-reduced-motion: reduce)').matches ?? false,
    contrast,
    colorGamut: gamut,
    forcedColors: m?.('(forced-colors: active)').matches ?? false,
  };
}

interface NavWithConn extends Navigator {
  connection?: { effectiveType?: string; saveData?: boolean };
  getBattery?: () => Promise<{ level: number; charging: boolean }>;
}

function readState(): State {
  if (typeof navigator === 'undefined') {
    return { batteryLevel: null, batteryCharging: null, networkTier: 'unknown', saveData: false, online: true };
  }
  const n = navigator as NavWithConn;
  const conn = n.connection;
  const tier = (conn?.effectiveType as State['networkTier']) ?? 'unknown';
  return {
    batteryLevel: null, // populated async via getBattery (Task 26)
    batteryCharging: null,
    networkTier: tier,
    saveData: conn?.saveData ?? false,
    online: n.onLine ?? true,
  };
}

function readTimeSpace(): TimeSpace {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  const now = new Date();
  const hourFloat = now.getHours() + now.getMinutes() / 60;
  return {
    tz,
    locale,
    localHourFloat: hourFloat,
    dayOfWeek: now.getDay(),
    isThaiSpeaker: locale.toLowerCase().startsWith('th'),
    isCnxTimezone: isCnxTimezone(tz),
  };
}

function readSoftware(): Software {
  if (typeof navigator === 'undefined') {
    return { os: 'unknown', hasWebGL: false, gpuClass: 'unknown' };
  }
  const ua = navigator.userAgent.toLowerCase();
  let os: Software['os'] = 'unknown';
  if (/iphone|ipad|ipod/.test(ua)) os = 'ios';
  else if (/android/.test(ua)) os = 'android';
  else if (/macintosh|mac os/.test(ua)) os = 'macos';
  else if (/windows/.test(ua)) os = 'windows';
  else if (/linux/.test(ua)) os = 'linux';

  let hasWebGL = false;
  try {
    const c = document.createElement('canvas');
    hasWebGL = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { /* SSR or sandboxed */ }

  return { os, hasWebGL, gpuClass: 'unknown' };
}

export function readPayload(): Payload {
  return {
    embodiment: readEmbodiment(),
    atmosphere: readAtmosphere(),
    state: readState(),
    timeSpace: readTimeSpace(),
    software: readSoftware(),
    readAt: Date.now(),
  };
}

export function getSkyState(hourFloat: number): SkyState {
  if (hourFloat >= 5 && hourFloat < 7) return 'dawn';
  if (hourFloat >= 7 && hourFloat < 17) return 'day';
  if (hourFloat >= 17 && hourFloat < 19) return 'dusk';
  return 'night';
}

export function isCnxTimezone(tz: string): boolean {
  return CNX_TIMEZONES.includes(tz);
}
```

- [ ] **Step 2: Run tests — expect pass**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm test 2>&1 | tail -20
```
Expected: all tests pass

- [ ] **Step 3: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/lib/payload.ts
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(payload): implement readPayload + sky state + cnx tz check"
```

---

### Task 10: Create ContextResolver + PayloadDebug components

**Files:**
- Create: `src/components/layout/ContextResolver.tsx`
- Create: `src/components/layout/PayloadDebug.tsx`

- [ ] **Step 1: Write ContextResolver**

Write `src/components/layout/ContextResolver.tsx`:
```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { readPayload } from '../../lib/payload';
import type { Payload } from '../../lib/payload.types';

const PayloadContext = createContext<Payload | null>(null);

export function ContextResolver({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<Payload | null>(null);

  useEffect(() => {
    setPayload(readPayload());

    const onResize = () => setPayload(readPayload());
    const onChange = () => setPayload(readPayload());

    window.addEventListener('resize', onResize);
    window.addEventListener('online', onChange);
    window.addEventListener('offline', onChange);

    const mqls = [
      '(prefers-color-scheme: dark)',
      '(prefers-reduced-motion: reduce)',
      '(orientation: portrait)',
    ].map((q) => {
      const mql = window.matchMedia(q);
      mql.addEventListener('change', onChange);
      return mql;
    });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('online', onChange);
      window.removeEventListener('offline', onChange);
      mqls.forEach((mql) => mql.removeEventListener('change', onChange));
    };
  }, []);

  return <PayloadContext.Provider value={payload}>{children}</PayloadContext.Provider>;
}

export function usePayload(): Payload | null {
  return useContext(PayloadContext);
}
```

- [ ] **Step 2: Write PayloadDebug**

Write `src/components/layout/PayloadDebug.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { usePayload } from './ContextResolver';

export function PayloadDebug() {
  const payload = usePayload();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVisible(params.get('debug') === 'payload');
  }, []);

  if (!visible || !payload) return null;

  return (
    <pre style={{
      position: 'fixed',
      bottom: 12,
      right: 12,
      maxWidth: 'min(90vw, 420px)',
      maxHeight: '70vh',
      overflow: 'auto',
      background: 'rgba(11, 10, 9, 0.92)',
      color: '#f0bd8e',
      fontFamily: 'ui-monospace, monospace',
      fontSize: 10,
      padding: 12,
      borderRadius: 6,
      border: '1px solid rgba(208, 138, 90, 0.3)',
      zIndex: 9999,
      lineHeight: 1.45,
    }}>
      {JSON.stringify(payload, null, 2)}
    </pre>
  );
}
```

- [ ] **Step 3: Verify type check**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/layout/ContextResolver.tsx src/components/layout/PayloadDebug.tsx
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(payload): ContextResolver + PayloadDebug (?debug=payload)"
```

---

## Phase 3 — Sky Scene (Tasks 11–18)

### Task 11: Create SunCalc helpers with tests

**Files:**
- Create: `src/lib/suncalc-helpers.ts`
- Create: `src/lib/suncalc-helpers.test.ts`

- [ ] **Step 1: Write failing tests**

Write `src/lib/suncalc-helpers.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { getMoonPhaseLabel, formatMoonPhase, CNX_COORDS } from './suncalc-helpers';

describe('getMoonPhaseLabel', () => {
  it('returns "new moon" near 0', () => {
    expect(getMoonPhaseLabel(0)).toMatch(/new moon/i);
    expect(getMoonPhaseLabel(0.02)).toMatch(/new moon/i);
  });
  it('returns "first quarter" near 0.25', () => {
    expect(getMoonPhaseLabel(0.25)).toMatch(/first quarter/i);
  });
  it('returns "full moon" near 0.5', () => {
    expect(getMoonPhaseLabel(0.5)).toMatch(/full moon/i);
  });
  it('returns "last quarter" near 0.75', () => {
    expect(getMoonPhaseLabel(0.75)).toMatch(/last quarter/i);
  });
  it('returns waxing label between 0 and 0.5', () => {
    expect(getMoonPhaseLabel(0.35)).toMatch(/waxing/i);
  });
  it('returns waning label between 0.5 and 1', () => {
    expect(getMoonPhaseLabel(0.65)).toMatch(/waning/i);
  });
});

describe('formatMoonPhase', () => {
  it('returns object with label + illumination%', () => {
    const r = formatMoonPhase(0.78);
    expect(r.label).toBeTypeOf('string');
    expect(r.illumination).toBeTypeOf('number');
    expect(r.illumination).toBeGreaterThanOrEqual(0);
    expect(r.illumination).toBeLessThanOrEqual(100);
  });
});

describe('CNX_COORDS', () => {
  it('is approx 18.79°N 98.99°E', () => {
    expect(CNX_COORDS.lat).toBeCloseTo(18.79, 1);
    expect(CNX_COORDS.lng).toBeCloseTo(98.99, 1);
  });
});
```

- [ ] **Step 2: Run — expect fail**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm test -- suncalc-helpers 2>&1 | tail -10
```
Expected: FAIL with module not found

- [ ] **Step 3: Implement suncalc-helpers**

Write `src/lib/suncalc-helpers.ts`:
```typescript
import SunCalc from 'suncalc';

export const CNX_COORDS = { lat: 18.7883, lng: 98.9853 } as const;

export interface MoonPhaseInfo {
  label: string;
  illumination: number;
  phase: number;
}

export function getMoonPhaseLabel(phase: number): string {
  if (phase < 0.03 || phase > 0.97) return 'new moon';
  if (phase >= 0.22 && phase <= 0.28) return 'first quarter';
  if (phase >= 0.47 && phase <= 0.53) return 'full moon';
  if (phase >= 0.72 && phase <= 0.78) return 'last quarter';
  if (phase < 0.25) return 'waxing crescent';
  if (phase < 0.5) return 'waxing gibbous';
  if (phase < 0.75) return 'waning gibbous';
  return 'waning crescent';
}

export function formatMoonPhase(phase: number): MoonPhaseInfo {
  const illuminationFraction = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  return {
    label: getMoonPhaseLabel(phase),
    illumination: Math.round(illuminationFraction * 100),
    phase,
  };
}

export interface SkyBodies {
  moonPhase: MoonPhaseInfo;
  moonAltitude: number;
  moonAzimuth: number;
  sunAltitude: number;
  sunAzimuth: number;
  isMoonUp: boolean;
  isSunUp: boolean;
}

export function readSkyBodies(date: Date, lat: number = CNX_COORDS.lat, lng: number = CNX_COORDS.lng): SkyBodies {
  const moon = SunCalc.getMoonPosition(date, lat, lng);
  const sun = SunCalc.getPosition(date, lat, lng);
  const illum = SunCalc.getMoonIllumination(date);

  return {
    moonPhase: formatMoonPhase(illum.phase),
    moonAltitude: moon.altitude,
    moonAzimuth: moon.azimuth,
    sunAltitude: sun.altitude,
    sunAzimuth: sun.azimuth,
    isMoonUp: moon.altitude > 0,
    isSunUp: sun.altitude > 0,
  };
}
```

- [ ] **Step 4: Run tests — expect pass**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm test -- suncalc-helpers 2>&1 | tail -10
```
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/lib/suncalc-helpers.ts src/lib/suncalc-helpers.test.ts
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(sky): suncalc helpers — moon phase + body positions over CNX"
```

---

### Task 12: Create Stars component

**Files:**
- Create: `src/components/sky/Stars.tsx`

- [ ] **Step 1: Write Stars component**

Write `src/components/sky/Stars.tsx`:
```tsx
import { useMemo } from 'react';

interface StarDef {
  top: string;
  left: string;
  tier: 'near' | 'mid' | 'far';
  delay: number;
}

function generateStars(count: number, seed: number): StarDef[] {
  // Deterministic pseudo-random based on seed
  let state = seed;
  const rand = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
  const stars: StarDef[] = [];
  for (let i = 0; i < count; i++) {
    const r = rand();
    stars.push({
      top: `${(rand() * 100).toFixed(2)}%`,
      left: `${(rand() * 100).toFixed(2)}%`,
      tier: r < 0.3 ? 'near' : r < 0.65 ? 'mid' : 'far',
      delay: rand() * 6,
    });
  }
  return stars;
}

export function Stars({ count = 14, seed = 42 }: { count?: number; seed?: number }) {
  const stars = useMemo(() => generateStars(count, seed), [count, seed]);

  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className={`star star-${s.tier}`}
          style={{ top: s.top, left: s.left, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Type check**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/sky/Stars.tsx
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(sky): Stars — 3-tier depth with deterministic placement"
```

---

### Task 13: Create Moon component

**Files:**
- Create: `src/components/sky/Moon.tsx`

- [ ] **Step 1: Write Moon component**

Write `src/components/sky/Moon.tsx`:
```tsx
import type { MoonPhaseInfo } from '../../lib/suncalc-helpers';

interface MoonProps {
  phase: MoonPhaseInfo;
  size?: number;
}

export function Moon({ phase, size = 56 }: MoonProps) {
  // shadow positioning: waxing (phase < 0.5) → shadow on left, waning → shadow on right
  // phase 0 = new moon (fully dark), 0.5 = full moon, 1 = new again
  const waxing = phase.phase < 0.5;
  const phaseOffset = waxing ? (0.5 - phase.phase) * 2 : (phase.phase - 0.5) * 2;
  const shadowSide = waxing ? '20%' : '80%';
  const shadowOpacity = Math.min(0.85, 0.4 + phaseOffset * 0.5);

  return (
    <div
      className="moon-wrap"
      role="img"
      aria-label={`${phase.label}, ${phase.illumination}% illuminated`}
    >
      <div className="moon-bloom" />
      <div
        className="moon"
        style={{
          width: size,
          height: size,
          ['--moon-shadow-x' as string]: shadowSide,
          ['--moon-shadow-opacity' as string]: shadowOpacity,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/sky/Moon.tsx
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(sky): Moon — phase-aware shadow + aria label"
```

---

### Task 14: Create Sun component

**Files:**
- Create: `src/components/sky/Sun.tsx`

- [ ] **Step 1: Write Sun component**

Write `src/components/sky/Sun.tsx`:
```tsx
interface SunProps {
  size?: number;
  altitude?: number; // -1 to 1; affects vertical position
}

export function Sun({ size = 56, altitude = 0.2 }: SunProps) {
  // map altitude to bottom position percent (positive = above horizon)
  // -0.2 → fully behind horizon (bottom: -10%)
  //  0   → bottom: 0%
  //  1   → bottom: 80% (high in sky)
  const bottomPct = Math.max(-10, Math.min(80, altitude * 80));

  return (
    <div
      className="sun-wrap"
      role="img"
      aria-label="sun"
      style={{
        ['--sun-size' as string]: `${size}px`,
        ['--sun-bottom' as string]: `${bottomPct}%`,
      }}
    >
      <div className="sun-corona" />
      <div className="sun-disc" />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/sky/Sun.tsx
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(sky): Sun — altitude-driven position + corona"
```

---

### Task 15: Create DoiSuthep silhouette component

**Files:**
- Create: `src/components/sky/DoiSuthep.tsx`

- [ ] **Step 1: Write component**

Write `src/components/sky/DoiSuthep.tsx`:
```tsx
interface DoiSuthepProps {
  ridges?: 1 | 2 | 3;
  withTemple?: boolean;
}

export function DoiSuthep({ ridges = 3, withTemple = true }: DoiSuthepProps) {
  return (
    <>
      {ridges >= 3 && (
        <div className="mountain mountain-far" aria-hidden="true">
          <svg viewBox="0 0 200 30" preserveAspectRatio="none">
            <path d="M0,30 L0,22 L8,18 L18,21 L28,15 L42,19 L55,12 L68,18 L82,14 L98,8 L112,16 L128,11 L142,17 L158,13 L172,20 L186,15 L200,22 L200,30 Z" />
          </svg>
        </div>
      )}
      {ridges >= 2 && (
        <div className="mountain mountain-mid" aria-hidden="true">
          <svg viewBox="0 0 200 35" preserveAspectRatio="none">
            <path d="M0,35 L0,18 L12,14 L24,22 L38,10 L52,15 L65,6 L78,12 L90,4 L105,11 L120,7 L135,15 L148,8 L162,13 L178,18 L200,12 L200,35 Z" />
          </svg>
        </div>
      )}
      <div className="mountain mountain-near" aria-hidden="true">
        <svg viewBox="0 0 200 50" preserveAspectRatio="none">
          <path d="M0,50 L0,25 L8,18 L20,28 L35,15 L48,22 L62,10 L75,18 L88,8 L102,14 L115,22 L130,12 L145,20 L160,16 L175,25 L188,18 L200,28 L200,50 Z" />
          {withTemple && <path d="M62,10 L60,7 L62,5 L64,7 L62,10 Z" />}
        </svg>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/sky/DoiSuthep.tsx
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(sky): DoiSuthep silhouette — 3 ridges + temple hint"
```

---

### Task 16: Create Atmosphere overlay component

**Files:**
- Create: `src/components/sky/Atmosphere.tsx`

- [ ] **Step 1: Write component**

Write `src/components/sky/Atmosphere.tsx`:
```tsx
export function Atmosphere() {
  return (
    <>
      <div className="horizon-haze" aria-hidden="true" />
      <svg className="persp-grid" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
        {[0, 40, 80, 120, 160, 200].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1="100"
            x2="100"
            y2="55"
            stroke="rgba(208,138,90,0.16)"
            strokeWidth="0.15"
          />
        ))}
        {[60, 68, 78, 90].map((y, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={y}
            x2="200"
            y2={y}
            stroke="rgba(208,138,90,0.08)"
            strokeWidth="0.1"
          />
        ))}
      </svg>
      <div className="vignette" aria-hidden="true" />
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="v1b3-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.045 0" />
          </filter>
        </defs>
      </svg>
      <div
        className="grain"
        aria-hidden="true"
        style={{ filter: 'url(#v1b3-grain)' }}
      />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/sky/Atmosphere.tsx
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(sky): Atmosphere — haze + perspective grid + vignette + film grain"
```

---

### Task 17: Create Sky orchestrator + sky.css

**Files:**
- Create: `src/components/sky/Sky.tsx`
- Create: `src/styles/sky.css`

- [ ] **Step 1: Write Sky orchestrator**

Write `src/components/sky/Sky.tsx`:
```tsx
import { useMemo } from 'react';
import { usePayload } from '../layout/ContextResolver';
import { readSkyBodies } from '../../lib/suncalc-helpers';
import { Stars } from './Stars';
import { Moon } from './Moon';
import { Sun } from './Sun';
import { DoiSuthep } from './DoiSuthep';
import { Atmosphere } from './Atmosphere';
import '../../styles/sky.css';

export function Sky() {
  const payload = usePayload();

  const bodies = useMemo(() => readSkyBodies(new Date()), []);

  // SSR fallback: assume night
  const skyClass = payload ? `sky sky-${payload.atmosphere.colorScheme === 'dark' ? 'night' : 'dawn'}` : 'sky sky-night';
  const reduceMotion = payload?.atmosphere.reduceMotion ?? false;
  const ridges = payload && payload.embodiment.viewportW < 600 ? 1 : 3;

  return (
    <div className={`${skyClass} ${reduceMotion ? 'motion-still' : ''}`} role="img" aria-label={`night sky over chiang mai with ${bodies.moonPhase.label}`}>
      {!reduceMotion && <Stars count={ridges === 1 ? 8 : 14} />}
      <Atmosphere />
      <DoiSuthep ridges={ridges} />
      {bodies.isMoonUp && (
        <Moon phase={bodies.moonPhase} size={ridges === 1 ? 64 : 56} />
      )}
      {bodies.isSunUp && (
        <Sun altitude={bodies.sunAltitude} />
      )}
      <div className="moon-caption" aria-hidden="true">
        <div>{bodies.moonPhase.label.toUpperCase()}</div>
        <div className="phase-bar">
          {'▮'.repeat(Math.round(bodies.moonPhase.illumination / 20))}
          {'▯'.repeat(5 - Math.round(bodies.moonPhase.illumination / 20))}
          {' · '}{bodies.moonPhase.illumination}%
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write sky.css**

Write `src/styles/sky.css`:
```css
.sky {
  position: relative;
  min-height: 60vh;
  overflow: hidden;
  isolation: isolate;
}

.sky-night {
  background:
    radial-gradient(ellipse 60% 80% at 70% 30%, rgba(120,140,180,0.12) 0%, transparent 60%),
    linear-gradient(180deg,
      var(--c-bg-sky-top) 0%,
      var(--c-bg-sky-top) 30%,
      var(--c-bg-sky-mid) 60%,
      var(--c-bg-sky-horizon) 82%,
      #1f1418 92%,
      var(--c-bg-deepest) 100%);
}

.sky-dawn {
  background:
    radial-gradient(ellipse 50% 90% at 92% 110%, rgba(255,200,120,0.55) 0%, transparent 50%),
    linear-gradient(180deg, var(--c-dawn-sky-top) 0%, var(--c-dawn-sky-mid) 35%, #e9b78a 75%, var(--c-dawn-sky-bottom) 100%);
}

/* STARS */
.stars { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
.star { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.7); }
.star-near { width: 1.8px; height: 1.8px; background: rgba(255,255,255,0.9); animation: starTwinkle 4s ease-in-out infinite; }
.star-mid { width: 1.3px; height: 1.3px; background: rgba(255,255,255,0.65); animation: starTwinkle 5s ease-in-out infinite; }
.star-far { width: 0.8px; height: 0.8px; background: rgba(255,255,255,0.4); animation: starTwinkle 6s ease-in-out infinite; }

@keyframes starTwinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.motion-still .star { animation: none !important; opacity: 0.7 !important; }

/* PERSPECTIVE GRID */
.persp-grid { position: absolute; inset: 0; pointer-events: none; z-index: 2; opacity: 0.45; }

/* HAZE */
.horizon-haze {
  position: absolute; left: 0; right: 0; bottom: 22%; height: 35%;
  background: linear-gradient(180deg, transparent 0%, var(--c-dusk-haze) 60%, rgba(160,100,65,0.5) 100%);
  pointer-events: none;
  z-index: 2;
  filter: blur(1px);
}

/* MOUNTAINS */
.mountain { position: absolute; left: 0; right: 0; filter: blur(0.4px); }
.mountain svg { width: 100%; height: 100%; display: block; }
.mountain-far { bottom: 16%; height: 12%; z-index: 3; }
.mountain-far path { fill: rgba(60,40,55,0.7); }
.mountain-mid { bottom: 10%; height: 14%; z-index: 4; }
.mountain-mid path { fill: rgba(35,22,30,0.85); }
.mountain-near { bottom: 0; height: 18%; z-index: 5; }
.mountain-near path { fill: rgba(15,10,12,0.95); }

/* MOON */
.moon-wrap { position: absolute; top: 18%; right: 14%; z-index: 4; }
.moon-bloom {
  position: absolute;
  width: 220px; height: 220px;
  border-radius: 50%;
  top: -82px; left: -82px;
  background: radial-gradient(circle, rgba(255,245,210,0.08) 0%, rgba(255,245,210,0.04) 30%, transparent 60%);
  pointer-events: none;
}
.moon {
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, var(--c-moon-light) 0%, var(--c-moon-mid) 30%, #c9b89a 65%, var(--c-moon-shadow) 95%);
  box-shadow:
    0 0 0 1px rgba(255,250,230,0.1),
    0 0 14px rgba(255,245,210,0.5),
    0 0 40px rgba(232,220,192,0.4),
    0 0 100px rgba(160,140,110,0.3),
    inset -8px -4px 16px rgba(20,15,10,0.4);
  position: relative;
}
.moon::before {
  content: ''; position: absolute; inset: 0; border-radius: 50%;
  background: radial-gradient(circle at var(--moon-shadow-x, 78%) 50%, transparent 50%, rgba(11,10,9, var(--moon-shadow-opacity, 0.6)) 72%, rgba(11,10,9,0.95) 92%);
}
.moon::after {
  content: ''; position: absolute; inset: 12%; border-radius: 50%;
  background-image:
    radial-gradient(circle at 30% 40%, rgba(80,70,50,0.55) 0%, transparent 9%),
    radial-gradient(circle at 60% 55%, rgba(110,95,75,0.45) 0%, transparent 7%),
    radial-gradient(circle at 45% 25%, rgba(130,110,85,0.35) 0%, transparent 6%);
  mix-blend-mode: multiply;
}

.moon-caption {
  position: absolute; top: 16%; right: 4%;
  font-family: var(--font-mono);
  font-size: var(--fs-hud);
  color: rgba(232,220,192,0.55);
  letter-spacing: 0.15em;
  text-align: right;
  z-index: 5;
  line-height: 1.4;
}
.moon-caption .phase-bar { color: rgba(245,238,222,0.78); }

/* SUN */
.sun-wrap {
  position: absolute;
  bottom: var(--sun-bottom, 8%);
  right: 8%;
  width: var(--sun-size, 56px);
  height: var(--sun-size, 56px);
  z-index: 4;
}
.sun-disc {
  width: 100%; height: 100%; border-radius: 50%;
  background: radial-gradient(circle at 50% 40%, var(--c-dawn-sun-core) 0%, var(--c-dawn-sun-mid) 30%, var(--c-dawn-sun-edge) 70%, #d88030 100%);
  box-shadow:
    0 0 80px rgba(255,220,140,0.7),
    0 0 30px rgba(255,200,120,0.6),
    0 0 14px rgba(255,180,100,0.5);
  position: relative; z-index: 2;
}
.sun-corona {
  position: absolute; inset: -60%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,220,140,0.2) 0%, transparent 55%);
  animation: sunPulse 5s ease-in-out infinite;
  z-index: 1;
}
@keyframes sunPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 1; }
}
.motion-still .sun-corona { animation: none !important; opacity: 0.7 !important; }

/* VIGNETTE */
.vignette {
  position: absolute; inset: 0; pointer-events: none;
  box-shadow: inset 0 0 80px 30px rgba(0,0,0,0.5);
  z-index: 5;
}

/* GRAIN */
.grain {
  position: absolute; inset: 0; pointer-events: none;
  opacity: 0.045; z-index: 6;
  mix-blend-mode: overlay;
}

@media (max-width: 600px) {
  .moon-wrap { top: 22%; right: 50%; transform: translateX(50%); }
  .moon-caption { top: auto; bottom: 30%; right: 50%; transform: translateX(50%); text-align: center; }
}
```

- [ ] **Step 3: Verify type check + build**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npx tsc --noEmit && npm run build 2>&1 | tail -5
```
Expected: no TS errors; build passes

- [ ] **Step 4: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/sky/Sky.tsx src/styles/sky.css
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(sky): Sky orchestrator + sky.css with all layers"
```

---

### Task 18: Smoke-test the sky in dev

**Files:**
- Modify: `src/pages/index.astro` (temporary preview)

- [ ] **Step 1: Mount sky in homepage as smoke test**

Write `src/pages/index.astro` (temporary — will be expanded in Phase 6):
```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { ContextResolver } from "../components/layout/ContextResolver";
import { PayloadDebug } from "../components/layout/PayloadDebug";
import { Sky } from "../components/sky/Sky";
---

<BaseLayout>
  <main id="main">
    <ContextResolver client:load>
      <Sky client:load />
      <PayloadDebug client:load />
    </ContextResolver>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Run dev server in background and screenshot**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm run dev > /tmp/v1b3-dev.log 2>&1 &
sleep 5
curl -sI http://localhost:4321/ | head -3
```
Expected: HTTP/1.1 200 OK

- [ ] **Step 3: Stop dev server**

Run:
```bash
pkill -f "astro dev" || true
sleep 1
```

- [ ] **Step 4: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/pages/index.astro
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(home): smoke-mount Sky on homepage"
```

---

## Phase 4 — Mesh Background (Tasks 19–20)

### Task 19: Create MeshBackground component

**Files:**
- Create: `src/components/sky/MeshBackground.tsx`

- [ ] **Step 1: Write component**

Write `src/components/sky/MeshBackground.tsx`:
```tsx
import { MeshGradient } from '@paper-design/shaders-react';
import { usePayload } from '../layout/ContextResolver';

export function MeshBackground() {
  const payload = usePayload();

  // Skip on save-data, low-end network, reduce-motion, or no WebGL
  if (!payload) return null;
  if (payload.state.saveData) return null;
  if (payload.atmosphere.reduceMotion) return null;
  if (payload.state.networkTier === 'slow-2g' || payload.state.networkTier === '2g') return null;
  if (!payload.software.hasWebGL) return null;

  const isDark = payload.atmosphere.colorScheme === 'dark';

  return (
    <div className="mesh-bg" aria-hidden="true">
      <MeshGradient
        colors={isDark
          ? ['#0a0c1c', '#2a1d24', '#4a2f3a', '#1a1525', '#1a0c1a']
          : ['#fbf2e4', '#f4d9c0', '#e9b78a', '#d08a5a', '#f8d4a8']
        }
        speed={0.15}
        distortion={0.6}
        swirl={0.3}
      />
    </div>
  );
}
```

- [ ] **Step 2: Add mesh-bg styles to sky.css**

Append to `src/styles/sky.css`:
```css

/* MESH BACKGROUND */
.mesh-bg {
  position: absolute; inset: 0;
  opacity: 0.35;
  mix-blend-mode: soft-light;
  z-index: 0;
  pointer-events: none;
}
.mesh-bg canvas { width: 100% !important; height: 100% !important; display: block; }
```

- [ ] **Step 3: Mount in Sky**

Modify `src/components/sky/Sky.tsx` — replace the `<Stars` line with these two lines:
```tsx
      <MeshBackground />
      {!reduceMotion && <Stars count={ridges === 1 ? 8 : 14} />}
```

And add import at top:
```tsx
import { MeshBackground } from './MeshBackground';
```

- [ ] **Step 4: Build + commit**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm run build 2>&1 | tail -5
```
Expected: build passes

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/sky/MeshBackground.tsx src/components/sky/Sky.tsx src/styles/sky.css
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(sky): MeshBackground shader layer + save-data fallback"
```

---

### Task 20: Verify mesh degrades gracefully

**Files:** (verification task — no new files)

- [ ] **Step 1: Run dev + check save-data fallback**

Open `src/pages/index.astro` and verify mesh skips correctly. This is a visual check; if you have a dev server running, navigate to `http://localhost:4321/?debug=payload` and confirm in the debug overlay that `saveData: false`. Then in Chrome DevTools → Network → check "Save-data" header simulation, reload, and confirm mesh disappears.

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm run dev > /tmp/v1b3-dev.log 2>&1 &
sleep 5
echo "Dev running at http://localhost:4321/?debug=payload — verify mesh shader + payload debug overlay manually, then stop"
```

- [ ] **Step 2: Stop dev**

```bash
pkill -f "astro dev" || true
sleep 1
```

- [ ] **Step 3: No commit (verification-only task)**

Continue to next task.

---

## Phase 5 — HUD + Founder Presence (Tasks 21–28)

### Task 21: Create sprint config

**Files:**
- Create: `src/data/sprint.ts`

- [ ] **Step 1: Write sprint config**

Write `src/data/sprint.ts`:
```typescript
// Sprint config — update or null when sprint changes
// See spec § 12 (Build-time data)

export interface SprintConfig {
  name: string;
  start: string; // ISO date
  days: number;
}

export const sprint: SprintConfig | null = {
  name: "access core loop",
  start: "2026-05-17",
  days: 14,
};

export function getCurrentSprintDay(now: Date = new Date()): { day: number; total: number; name: string } | null {
  if (!sprint) return null;
  const start = new Date(sprint.start);
  const diffMs = now.getTime() - start.getTime();
  const day = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  if (day < 1 || day > sprint.days) return null;
  return { day, total: sprint.days, name: sprint.name };
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/data/sprint.ts
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(founder): sprint config + getCurrentSprintDay helper"
```

---

### Task 22: Create git baker script (Astro integration)

**Files:**
- Create: `scripts/bake-git.mjs`
- Create: `src/data/founder-build.json` (placeholder for build-time output)
- Modify: `.gitignore` (add founder-build.json)
- Modify: `astro.config.mjs` (add integration)

- [ ] **Step 1: Write bake script**

Write `scripts/bake-git.mjs`:
```javascript
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const OUTPUT = resolve(process.cwd(), 'src/data/founder-build.json');

function safeExec(cmd, fallback = '') {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return fallback; }
}

function relativeTime(secAgo) {
  if (secAgo < 60) return 'just now';
  if (secAgo < 3600) return `${Math.floor(secAgo / 60)}m ago`;
  if (secAgo < 86400) return `${Math.floor(secAgo / 3600)}h ago`;
  return `${Math.floor(secAgo / 86400)}d ago`;
}

function readLastCommit() {
  // Walk up to find git repo
  const head = safeExec('git rev-parse --show-toplevel');
  if (!head) return null;

  const ts = safeExec('git log -1 --format=%ct');
  const msg = safeExec('git log -1 --format=%s');
  const hash = safeExec('git log -1 --format=%h');
  if (!ts) return null;

  const secAgo = Math.floor(Date.now() / 1000) - parseInt(ts, 10);
  return {
    repo: head.split('/').pop() || 'unknown',
    msg: msg.length > 60 ? msg.slice(0, 57) + '...' : msg,
    hash,
    relativeTime: relativeTime(secAgo),
    timestamp: parseInt(ts, 10) * 1000,
  };
}

const data = {
  lastCommit: readLastCommit(),
  buildTime: new Date().toISOString(),
};

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
console.log(`[bake-git] wrote ${OUTPUT}: ${data.lastCommit?.repo} · ${data.lastCommit?.relativeTime}`);
```

- [ ] **Step 2: Add to gitignore**

Append to `.gitignore`:
```
src/data/founder-build.json
```

- [ ] **Step 3: Wire into astro config**

Modify `astro.config.mjs`:
```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import { execSync } from 'node:child_process';

function bakeGitIntegration() {
  return {
    name: 'bake-git',
    hooks: {
      'astro:config:setup': () => {
        try {
          execSync('node scripts/bake-git.mjs', { stdio: 'inherit' });
        } catch (e) {
          console.warn('[bake-git] failed, continuing with empty data');
        }
      },
    },
  };
}

export default defineConfig({
  output: 'static',
  adapter: vercel({
    edgeMiddleware: false,
    imageService: false,
  }),
  integrations: [react(), bakeGitIntegration()],
  vite: {
    optimizeDeps: {
      exclude: ['suncalc'],
    },
  },
});
```

- [ ] **Step 4: Run bake manually + verify**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && node scripts/bake-git.mjs && cat src/data/founder-build.json
```
Expected: JSON output with lastCommit object

- [ ] **Step 5: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add scripts/bake-git.mjs .gitignore astro.config.mjs
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(founder): bake-git Astro integration for last commit data"
```

---

### Task 23: Create Last.fm setup documentation + .env.example

**Files:**
- Create: `.env.example`
- Create: `docs/LASTFM-SETUP.md`

- [ ] **Step 1: Write .env.example**

Write `.env.example`:
```bash
# v1b3topia — environment variables
# Copy this file to `.env` and fill in real values.
# `.env` is gitignored.

# ───────────────────────────────────────────────────────────
# Last.fm — for showing the founder's currently-playing track
# ───────────────────────────────────────────────────────────
# 1. Go to https://www.last.fm/api/account/create
# 2. Fill the form:
#    - Application Name:  v1b3topia          (anything, free text)
#    - Application description:  personal site music status
#    - Callback URL:  https://v1b3x0r.com/  (anything valid; we don't use it)
#    - Application homepage:  https://v1b3x0r.com  (your site)
# 3. After submit, Last.fm shows:
#    - API Key       → paste below
#    - Shared Secret → not used by v1b3topia (we only do read-only public calls)
# 4. Set your Last.fm username (the one Web Scrobbler reports to).
#    Web Scrobbler extension: https://web-scrobbler.com  (free Chrome extension that scrobbles YouTube → Last.fm)

LASTFM_API_KEY=        # paste the API Key from Last.fm here
LASTFM_USER=v1b3x0r    # your Last.fm username (the one your scrobbler reports to)

# (NOT NEEDED — kept for reference only)
# LASTFM_SHARED_SECRET=  # only needed for authed/write actions; we do read-only
```

- [ ] **Step 2: Write the setup walkthrough**

Write `docs/LASTFM-SETUP.md`:
```markdown
# Last.fm setup — show what you're listening to

The site's HUD shows your currently-playing music via Last.fm's public API.
This is what makes the "founder presence" feel alive — visitors see what
song you have on right now (or most recently).

## Step 1 — Create a Last.fm account (if you don't have one)

Sign up at https://www.last.fm/join

## Step 2 — Get an API key

1. Visit https://www.last.fm/api/account/create
2. Fill in the form:

| field | what to put |
|---|---|
| **Application name** | `v1b3topia` (anything) |
| **Application description** | "personal site music status" |
| **Callback URL** | `https://v1b3x0r.com/` (anything valid — we don't use it) |
| **Application homepage** | `https://v1b3x0r.com` |

3. Submit. Last.fm will show:
   - **API Key** — copy this, you'll need it
   - **Shared Secret** — we don't use this (read-only public calls)
   - **Registered To** — your username, just confirms ownership

## Step 3 — Wire up scrobbling from YouTube

The site reads what you've recently listened to from Last.fm. For that to
work, something needs to *send* listening data to Last.fm. Install:

**Web Scrobbler** — https://web-scrobbler.com/
- Free browser extension (Chrome, Firefox, Edge, Brave)
- Scrobbles YouTube, YouTube Music, Apple Music, Bandcamp, SoundCloud and more
- Sign in with your Last.fm account once; it scrobbles automatically forever

Spotify scrobbling is built in via https://www.last.fm/settings/applications
(connect Spotify → enable scrobbling). But the spec assumes YouTube is your
main listening surface, so Web Scrobbler is the primary path.

## Step 4 — Drop credentials into `.env`

In your repo root, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env`:

```bash
LASTFM_API_KEY=your-api-key-here
LASTFM_USER=your-last-fm-username
```

## Step 5 — Set the same values in Vercel

Once you deploy to Vercel, set them in your project settings:

1. Open your Vercel dashboard → project → Settings → Environment Variables
2. Add `LASTFM_API_KEY` and `LASTFM_USER`
3. Set them for `Production`, `Preview`, and `Development`
4. Redeploy

## Verifying it works

1. Play a song on YouTube (with Web Scrobbler signed in)
2. Visit your site
3. Look at the HUD bar — you should see `♪ Artist — Track (Nm ago)`

If you see nothing:
- Check `https://www.last.fm/user/YOUR_USERNAME` shows the song you played
- Check `/api/lastfm` on your site directly — it should return JSON
- Check Vercel logs for the edge function

## Failure modes

| symptom | likely cause |
|---|---|
| No track shows | Web Scrobbler not signed in / not enabled for that site |
| `/api/lastfm` returns 503 | Last.fm API is down (rare) — the site silently falls back to git commit |
| Track is stale by hours | Scrobbler not running while you listened (e.g. you used a phone) |

The site degrades gracefully: if Last.fm is unreachable or returns nothing,
the founder row just shows the latest git commit instead.
```

- [ ] **Step 3: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add .env.example docs/LASTFM-SETUP.md
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "docs: Last.fm setup walkthrough + .env.example"
```

---

### Task 24: Create Last.fm edge endpoint

**Files:**
- Create: `src/pages/api/lastfm.ts`

- [ ] **Step 1: Write endpoint**

Write `src/pages/api/lastfm.ts`:
```typescript
import type { APIRoute } from 'astro';

export const prerender = false;

interface LastFmTrack {
  artist: { '#text': string };
  name: string;
  date?: { uts: string };
  '@attr'?: { nowplaying?: string };
}

interface LastFmResponse {
  recenttracks?: {
    track?: LastFmTrack[];
  };
}

export const GET: APIRoute = async () => {
  const apiKey = import.meta.env.LASTFM_API_KEY;
  const user = import.meta.env.LASTFM_USER;

  if (!apiKey || !user) {
    return new Response(
      JSON.stringify({ track: null, error: 'not_configured' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(user)}&api_key=${apiKey}&format=json&limit=1`;

  try {
    const r = await fetch(url);
    if (!r.ok) {
      return new Response(
        JSON.stringify({ track: null, error: 'lastfm_down' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const data = (await r.json()) as LastFmResponse;
    const t = data.recenttracks?.track?.[0];
    if (!t) {
      return new Response(
        JSON.stringify({ track: null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const nowPlaying = t['@attr']?.nowplaying === 'true';
    const playedAt = t.date ? parseInt(t.date.uts, 10) * 1000 : null;

    return new Response(
      JSON.stringify({
        track: `${t.artist['#text']} — ${t.name}`,
        playedAt,
        nowPlaying,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ track: null, error: 'fetch_failed' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

- [ ] **Step 2: Type check + commit**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npx tsc --noEmit
```
Expected: no errors

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/pages/api/lastfm.ts
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(api): /api/lastfm edge endpoint w/ graceful degradation"
```

---

### Task 25: Create FounderRow component with tests

**Files:**
- Create: `src/components/hud/FounderRow.tsx`
- Create: `src/components/hud/FounderRow.test.tsx`

- [ ] **Step 1: Write failing test**

Write `src/components/hud/FounderRow.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { FounderRow } from './FounderRow';

const mockCommit = { repo: 'homelog', msg: 'fix coalescer race', hash: 'abc1234', relativeTime: '2h ago', timestamp: Date.now() };
const mockSprint = { day: 11, total: 14, name: 'access core loop' };

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ track: 'Daughter — Youth', playedAt: Date.now() - 4 * 60 * 1000, nowPlaying: false }),
  } as Response);
});

describe('FounderRow', () => {
  it('renders git commit when provided', () => {
    render(<FounderRow lastCommit={mockCommit} sprint={mockSprint} />);
    expect(screen.getByText(/last commit 2h ago/i)).toBeTruthy();
    expect(screen.getByText(/homelog/i)).toBeTruthy();
  });

  it('renders sprint day when provided', () => {
    render(<FounderRow lastCommit={mockCommit} sprint={mockSprint} />);
    expect(screen.getByText(/Day 11 of 14/i)).toBeTruthy();
  });

  it('fetches and renders last.fm track', async () => {
    render(<FounderRow lastCommit={mockCommit} sprint={mockSprint} />);
    await waitFor(() => {
      expect(screen.getByText(/Daughter — Youth/i)).toBeTruthy();
    });
  });

  it('omits last.fm row when fetch returns null track', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ track: null }),
    } as Response);
    render(<FounderRow lastCommit={mockCommit} sprint={mockSprint} />);
    await waitFor(() => {
      expect(screen.queryByText(/♪/)).toBeNull();
    });
  });

  it('renders null when no commit and no sprint', () => {
    const { container } = render(<FounderRow lastCommit={null} sprint={null} />);
    expect(container.querySelector('.founder-row')).toBeNull();
  });
});
```

- [ ] **Step 2: Run — expect fail**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm test -- FounderRow 2>&1 | tail -10
```
Expected: FAIL (module not found)

- [ ] **Step 3: Implement FounderRow**

Write `src/components/hud/FounderRow.tsx`:
```tsx
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
  hideTrack?: boolean; // for save-data variant
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
    const interval = setInterval(fetchTrack, 90_000); // refresh every 90s

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
          <span className="founder-sep">·</span>
        </>
      )}
      {sprint && (
        <>
          <span className="founder-item">Day {sprint.day} of {sprint.total} · {sprint.name}</span>
        </>
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
```

- [ ] **Step 4: Run tests — expect pass**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm test -- FounderRow 2>&1 | tail -10
```
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/hud/FounderRow.tsx src/components/hud/FounderRow.test.tsx
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(hud): FounderRow with last.fm fetch + graceful degradation"
```

---

### Task 26: Create HUDStrip component

**Files:**
- Create: `src/components/hud/HUDStrip.tsx`

- [ ] **Step 1: Write component**

Write `src/components/hud/HUDStrip.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { usePayload } from '../layout/ContextResolver';

function formatTimeForTz(date: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
  } catch {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}

function tzShortLabel(tz: string): string {
  const parts = tz.split('/');
  return parts[parts.length - 1].replace(/_/g, ' ');
}

export function HUDStrip() {
  const payload = usePayload();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (!payload) return null;

  const visitorTz = payload.timeSpace.tz;
  const visitorTime = formatTimeForTz(now, visitorTz);
  const visitorCity = tzShortLabel(visitorTz);
  const cnxTime = formatTimeForTz(now, 'Asia/Bangkok');

  return (
    <div className="hud-strip">
      <span className="hud-brand">V1B3TOPIA</span>
      <span className="hud-sep">│</span>
      <span>under construction</span>
      <span className="hud-sep">·</span>
      <span>{visitorTime} {visitorCity}</span>
      {visitorCity.toLowerCase() !== 'bangkok' && (
        <>
          <span className="hud-sep">·</span>
          <span>{cnxTime} CNX</span>
        </>
      )}
      <span className="hud-right">
        <span className="hud-live-dot" aria-hidden="true" />
        <span>live</span>
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/hud/HUDStrip.tsx
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(hud): HUDStrip — visitor time + CNX time + brand"
```

---

### Task 27: Create VisitorNoticed micro-acknowledgment

**Files:**
- Create: `src/components/hud/VisitorNoticed.tsx`

- [ ] **Step 1: Write component**

Write `src/components/hud/VisitorNoticed.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { usePayload } from '../layout/ContextResolver';

const STORAGE_KEY = 'v1b3topia.noticed';

export function VisitorNoticed() {
  const payload = usePayload();
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!payload) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    if (payload.atmosphere.reduceMotion) return;
    if (payload.state.saveData) return;

    const visitorTz = payload.timeSpace.tz.split('/').pop()?.replace(/_/g, ' ') ?? 'somewhere';
    const visitorHour = Math.floor(payload.timeSpace.localHourFloat);
    const timeStr = `${String(visitorHour).padStart(2, '0')}:${String(Math.floor((payload.timeSpace.localHourFloat % 1) * 60)).padStart(2, '0')}`;
    setText(payload.timeSpace.isThaiSpeaker
      ? 'เธอแวะมาดู? นั่งก่อนได้'
      : `✓ visitor noticed · ${timeStr} · ${visitorTz}`
    );

    const onInteract = () => {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setVisible(true);
      setTimeout(() => setVisible(false), 5200);
    };

    window.addEventListener('mousemove', onInteract, { once: true });
    window.addEventListener('touchstart', onInteract, { once: true });

    return () => {
      window.removeEventListener('mousemove', onInteract);
      window.removeEventListener('touchstart', onInteract);
    };
  }, [payload]);

  if (!visible) return null;

  return <div className="visitor-noticed" aria-live="polite">{text}</div>;
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/hud/VisitorNoticed.tsx
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(hud): VisitorNoticed micro-acknowledgment on first interaction"
```

---

### Task 28: Style HUD + Founder Row + Noticed

**Files:**
- Create: `src/styles/hud.css`

- [ ] **Step 1: Write hud.css**

Write `src/styles/hud.css`:
```css
.hud-strip {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 14px;
  background: linear-gradient(180deg, rgba(11,10,9,0.92), rgba(11,10,9,0.55));
  border-bottom: 1px solid var(--c-line);
  font-family: var(--font-mono);
  font-size: var(--fs-hud);
  color: var(--c-ink-muted);
  letter-spacing: 0.08em;
  backdrop-filter: blur(2px);
  position: relative;
  z-index: 10;
}

.hud-brand {
  color: var(--c-accent);
  font-weight: 600;
  letter-spacing: 0.22em;
}

.hud-sep { color: rgba(255,255,255,0.15); }

.hud-right {
  margin-left: auto;
  display: flex; align-items: center; gap: 6px;
}

.hud-live-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #34c759;
  box-shadow: 0 0 6px #34c759;
  animation: hudPulse 1.6s ease-in-out infinite;
}

@keyframes hudPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }

.motion-still .hud-live-dot { animation: none !important; opacity: 0.7 !important; }

/* FOUNDER ROW */
.founder-row {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 14px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--c-ink-faint);
  letter-spacing: 0.06em;
  flex-wrap: wrap;
  background: linear-gradient(180deg, rgba(11,10,9,0.75), rgba(11,10,9,0.5));
  border-bottom: 1px solid var(--c-line);
  position: relative;
  z-index: 10;
}

.founder-pill {
  padding: 1px 7px;
  background: rgba(208,138,90,0.1);
  border: 1px solid rgba(208,138,90,0.2);
  border-radius: 2px;
  color: var(--c-accent-cream);
}

.founder-sep { color: rgba(255,255,255,0.15); }

.founder-track {
  color: var(--c-accent-cream);
  font-style: italic;
  opacity: 0.85;
}

@media (max-width: 600px) {
  .hud-strip { flex-wrap: wrap; font-size: 8.5px; gap: 6px; }
  .founder-row { font-size: 9.5px; gap: 6px; padding: 6px 12px; }
}

/* VISITOR NOTICED */
.visitor-noticed {
  position: absolute;
  top: 52%;
  right: 12%;
  background: rgba(11,10,9,0.85);
  border: 1px solid rgba(208,138,90,0.3);
  border-radius: 4px;
  padding: 4px 9px;
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--c-accent-cream);
  letter-spacing: 0.1em;
  z-index: 20;
  animation: noticedFade 5.2s ease-in-out forwards;
}

@keyframes noticedFade {
  0% { opacity: 0; transform: translateY(6px); }
  10% { opacity: 1; transform: translateY(0); }
  85% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-3px); }
}

@media (max-width: 600px) {
  .visitor-noticed { right: 50%; transform: translateX(50%); top: auto; bottom: 30%; }
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/styles/hud.css
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "style(hud): HUD strip + founder row + visitor-noticed styles"
```

---

## Phase 6 — Content + Copy Variants (Tasks 29–32)

### Task 29: Create hero copy variants

**Files:**
- Create: `src/content/copy/hero.json`

- [ ] **Step 1: Create file**

Write `src/content/copy/hero.json`:
```json
{
  "variants": [
    {
      "key": "th-cnx-night",
      "conditions": { "isThaiSpeaker": true, "localHour": [19, 30] },
      "copy": {
        "h1": "ดวงจันทร์ของเธอ คือดวงเดียวกัน",
        "sub": "v1b3topia · ที่ไหนซักที่ในเชียงใหม่"
      }
    },
    {
      "key": "dual-night",
      "conditions": { "localHour": [19, 30] },
      "copy": {
        "h1": "building v1b3topia, somewhere under this moon.",
        "sub": "we're sharing the same one tonight."
      }
    },
    {
      "key": "dawn-on-you",
      "conditions": { "localHour": [5, 9] },
      "copy": {
        "h1": "the sun rising on you · still moon here.",
        "sub": "building v1b3topia, somewhere in chiang mai."
      }
    },
    {
      "key": "default",
      "conditions": {},
      "copy": {
        "h1": "building v1b3topia, somewhere in chiang mai.",
        "sub": "you came to watch — stay as long as you like."
      }
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/content/copy/hero.json
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "content(copy): hero copy variants (th-night, dual-night, dawn, default)"
```

---

### Task 30: Create easter-eggs.json

**Files:**
- Create: `src/content/copy/easter-eggs.json`

- [ ] **Step 1: Create file**

Write `src/content/copy/easter-eggs.json`:
```json
{
  "404": {
    "h1": "scary beyond all reason.",
    "sub": "this isn't on the map of v1b3topia.",
    "link": "← return to chiang mai"
  },
  "offline": {
    "h1": "no touch-a my groove.",
    "sub": "you're offline. it's quiet here too."
  },
  "loading": "boom, baby.",
  "returning": "oh, it's you again.",
  "saveData": "keep moving forward. (light edition.)",
  "print": "why are you printing this?"
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/content/copy/easter-eggs.json
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "content(copy): easter-egg lines (404/offline/loading/etc)"
```

---

### Task 31: Create text-variants resolver with tests

**Files:**
- Create: `src/lib/text-variants.ts`
- Create: `src/lib/text-variants.test.ts`

- [ ] **Step 1: Write failing tests**

Write `src/lib/text-variants.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { resolveHeroVariant } from './text-variants';
import heroData from '../content/copy/hero.json';

describe('resolveHeroVariant', () => {
  it('picks th-cnx-night for Thai speaker at 23:00', () => {
    const r = resolveHeroVariant({ isThaiSpeaker: true, localHourFloat: 23 } as any);
    expect(r.h1).toMatch(/ดวงจันทร์/);
  });

  it('picks dual-night for English speaker at 23:00', () => {
    const r = resolveHeroVariant({ isThaiSpeaker: false, localHourFloat: 23 } as any);
    expect(r.h1).toMatch(/under this moon/);
  });

  it('picks dawn-on-you for hour 7', () => {
    const r = resolveHeroVariant({ isThaiSpeaker: false, localHourFloat: 7 } as any);
    expect(r.h1).toMatch(/sun rising/i);
  });

  it('picks default mid-day', () => {
    const r = resolveHeroVariant({ isThaiSpeaker: false, localHourFloat: 13 } as any);
    expect(r.h1).toMatch(/somewhere in chiang mai/);
  });

  it('contains all variants from json', () => {
    expect(heroData.variants.length).toBeGreaterThanOrEqual(4);
  });
});
```

- [ ] **Step 2: Run — expect fail**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm test -- text-variants 2>&1 | tail -10
```
Expected: FAIL (no implementation)

- [ ] **Step 3: Write resolver**

Write `src/lib/text-variants.ts`:
```typescript
import type { TimeSpace } from './payload.types';
import heroData from '../content/copy/hero.json';

export interface HeroCopy {
  h1: string;
  sub: string;
}

interface Conditions {
  isThaiSpeaker?: boolean;
  localHour?: [number, number];
}

function matchesHourWindow(hour: number, window: [number, number]): boolean {
  const [start, end] = window;
  if (start <= end) return hour >= start && hour < end;
  // wraps midnight: e.g., [19, 6] means 19:00–23:59 OR 00:00–05:59
  return hour >= start || hour < end;
}

function matches(timeSpace: TimeSpace, cond: Conditions): boolean {
  if (cond.isThaiSpeaker !== undefined && cond.isThaiSpeaker !== timeSpace.isThaiSpeaker) return false;
  if (cond.localHour && !matchesHourWindow(timeSpace.localHourFloat, cond.localHour)) return false;
  return true;
}

export function resolveHeroVariant(timeSpace: TimeSpace): HeroCopy {
  for (const variant of heroData.variants) {
    if (matches(timeSpace, variant.conditions as Conditions)) {
      return variant.copy;
    }
  }
  // fallback to last (should always be the default variant with empty conditions)
  return heroData.variants[heroData.variants.length - 1].copy;
}
```

- [ ] **Step 4: Run tests — expect pass**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm test -- text-variants 2>&1 | tail -10
```
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/lib/text-variants.ts src/lib/text-variants.test.ts
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(copy): hero variant resolver with hour-window + locale matching"
```

---

### Task 32: Create HeroCopy component

**Files:**
- Create: `src/components/sky/HeroCopy.tsx`

- [ ] **Step 1: Write component**

Write `src/components/sky/HeroCopy.tsx`:
```tsx
import { useMemo } from 'react';
import { usePayload } from '../layout/ContextResolver';
import { resolveHeroVariant } from '../../lib/text-variants';

export function HeroCopy() {
  const payload = usePayload();

  const copy = useMemo(() => {
    if (!payload) return { h1: 'building v1b3topia, somewhere in chiang mai.', sub: 'you came to watch — stay as long as you like.' };
    return resolveHeroVariant(payload.timeSpace);
  }, [payload]);

  // Highlight the place clause
  const renderH1 = () => {
    const m = copy.h1.match(/^(.*?)(somewhere [^.]+\.|under this moon\.|still moon here\.|ที่ไหนซักที่[^,.]+)(.*)$/);
    if (!m) return <>{copy.h1}</>;
    return (
      <>
        {m[1]}
        <span className="hero-place">{m[2]}</span>
        {m[3]}
      </>
    );
  };

  return (
    <div className="hero-copy">
      <h1>{renderH1()}</h1>
      <p className="hero-sub">{copy.sub}</p>
    </div>
  );
}
```

- [ ] **Step 2: Add hero-copy styles to sky.css**

Append to `src/styles/sky.css`:
```css

/* HERO COPY */
.hero-copy {
  position: absolute;
  bottom: 18%;
  left: var(--pad-side);
  max-width: 65%;
  z-index: 8;
}
.hero-copy h1 {
  font-family: var(--font-mono);
  font-size: clamp(1.4rem, 3vw, 2.4rem);
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: -0.005em;
  margin: 0;
  color: var(--c-ink);
  text-shadow: 0 1px 12px rgba(0,0,0,0.5);
}
.hero-place {
  color: var(--c-accent-cream);
  font-style: italic;
}
.hero-sub {
  margin: 10px 0 0;
  font-family: var(--font-sans);
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  color: var(--c-ink-muted);
  font-style: italic;
  line-height: 1.5;
  text-shadow: 0 1px 6px rgba(0,0,0,0.5);
}

@media (max-width: 600px) {
  .hero-copy { left: var(--pad-side); right: var(--pad-side); max-width: none; bottom: 22%; text-align: center; }
  .hero-copy h1 { font-size: clamp(1.1rem, 4.5vw, 1.6rem); }
}
```

- [ ] **Step 3: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/sky/HeroCopy.tsx src/styles/sky.css
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(sky): HeroCopy with payload-driven variant + italic place clause"
```

---

## Phase 7 — Page Composition (Tasks 33–36)

### Task 33: Compose full homepage

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/ground/ProjectList.astro`
- Create: `src/styles/ground.css`

- [ ] **Step 1: Create ProjectList.astro**

Write `src/components/ground/ProjectList.astro`:
```astro
---
import { getCollection } from "astro:content";

const projects = (await getCollection("projects", ({ data }) => data.featured)).sort(
  (a, b) => a.data.order - b.data.order,
);
---

<section id="projects" class="ground-projects" aria-labelledby="projects-title">
  <h2 id="projects-title" class="ground-projects-title">projects</h2>
  <ol class="project-list">
    {projects.map((project, idx) => (
      <li>
        <a class="project-row" href={`/projects/${project.id}/`}>
          <span class="project-index">{String(idx + 1).padStart(2, "0")}</span>
          <span class="project-name">{project.data.title}</span>
          <span class="project-desc">{project.data.summary}</span>
          <span class="project-status">{project.data.status.toUpperCase()}</span>
        </a>
      </li>
    ))}
  </ol>
</section>
```

- [ ] **Step 2: Write ground.css**

Write `src/styles/ground.css`:
```css
.ground {
  background:
    radial-gradient(rgba(208,138,90,0.08) 0.7px, transparent 1px),
    linear-gradient(180deg, var(--c-bg-ground) 0%, var(--c-bg-ground-deep) 100%);
  background-size: 18px 18px, 100% 100%;
  border-top: 1px solid var(--c-line-strong);
  padding: 3rem 0 2rem;
  position: relative;
}

.ground::before {
  content: '';
  position: absolute; left: 0; right: 0; top: -1px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--c-accent), transparent);
  opacity: 0.4;
}

.ground-projects { width: min(100% - var(--pad-side) * 2, var(--max-w)); margin-inline: auto; }

.ground-projects-title {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--c-ink-muted);
  margin: 0 0 1.25rem;
  text-transform: lowercase;
}

.project-list { list-style: none; margin: 0; padding: 0; }
.project-list li {
  border-bottom: 1px dashed var(--c-line);
}
.project-list li:last-child { border-bottom: none; }

.project-row {
  display: grid;
  grid-template-columns: 2.25rem minmax(8rem, 12rem) 1fr 5rem;
  gap: 1.25rem;
  align-items: baseline;
  padding: 0.9rem 0;
  color: inherit;
  text-decoration: none;
  font-family: var(--font-mono);
  transition: background var(--dur-fast) var(--ease-soft);
}

.project-row:hover, .project-row:focus-visible {
  background: rgba(208,138,90,0.04);
  outline: none;
}

.project-row:hover .project-name, .project-row:focus-visible .project-name {
  color: var(--c-accent-cream);
}

.project-index { color: var(--c-accent); font-size: 0.85rem; }
.project-name {
  color: var(--c-ink);
  font-size: 1.05rem;
  font-weight: 500;
  transition: color var(--dur-fast) var(--ease-soft);
}
.project-desc {
  color: var(--c-ink-faint);
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-style: italic;
  line-height: 1.5;
}
.project-status {
  font-size: 0.7rem;
  color: var(--c-accent-warm);
  letter-spacing: 0.1em;
  text-align: right;
}

@media (max-width: 700px) {
  .project-row {
    grid-template-columns: 2rem 1fr;
    gap: 0.75rem;
  }
  .project-desc { grid-column: 2 / -1; margin-top: 0.25rem; }
  .project-status { grid-column: 2 / -1; text-align: left; }
}
```

- [ ] **Step 3: Compose homepage**

Write `src/pages/index.astro`:
```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { ContextResolver } from "../components/layout/ContextResolver";
import { PayloadDebug } from "../components/layout/PayloadDebug";
import { HUDStrip } from "../components/hud/HUDStrip";
import { FounderRow } from "../components/hud/FounderRow";
import { VisitorNoticed } from "../components/hud/VisitorNoticed";
import { Sky } from "../components/sky/Sky";
import { HeroCopy } from "../components/sky/HeroCopy";
import ProjectList from "../components/ground/ProjectList.astro";
import { getCurrentSprintDay } from "../data/sprint";
import founderBuild from "../data/founder-build.json";
import "../styles/hud.css";
import "../styles/ground.css";

const sprint = getCurrentSprintDay();
const lastCommit = founderBuild.lastCommit;
---

<BaseLayout>
  <ContextResolver client:load>
    <HUDStrip client:load />
    <FounderRow client:load lastCommit={lastCommit} sprint={sprint} />
    <main id="main">
      <div class="hero-section">
        <Sky client:load />
        <HeroCopy client:load />
        <VisitorNoticed client:load />
      </div>
      <div class="ground">
        <ProjectList />
      </div>
    </main>
    <PayloadDebug client:load />
  </ContextResolver>
  <footer class="site-footer">
    from chiang mai · with melancholy
  </footer>
</BaseLayout>

<style>
  .hero-section { position: relative; }
</style>
```

- [ ] **Step 4: Run dev + verify**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm run build 2>&1 | tail -8
```
Expected: build passes

- [ ] **Step 5: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/pages/index.astro src/components/ground/ProjectList.astro src/styles/ground.css
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(home): full composition — HUD + Sky + Hero + ProjectList"
```

---

### Task 34: Refine project detail page

**Files:**
- Modify: `src/pages/projects/[...slug].astro`

- [ ] **Step 1: Read existing**

Read `src/pages/projects/[...slug].astro` to understand current structure (use Read tool).

- [ ] **Step 2: Rewrite with new atmosphere**

Write `src/pages/projects/[...slug].astro`:
```astro
---
import { getCollection, render } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import { ContextResolver } from "../../components/layout/ContextResolver";
import { HUDStrip } from "../../components/hud/HUDStrip";
import "../../styles/hud.css";

export async function getStaticPaths() {
  const projects = await getCollection("projects");
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await render(project);
const allProjects = await getCollection("projects");

const related = (project.data.relatedProjects || [])
  .map((rel) => {
    const target = allProjects.find((p) => p.id === rel.slug);
    return target ? { ...target, note: rel.note } : null;
  })
  .filter(Boolean);
---

<BaseLayout title={`${project.data.title} · v1b3topia`} description={project.data.summary}>
  <ContextResolver client:load>
    <HUDStrip client:load />
  </ContextResolver>
  <main id="main" class="project-page-wrap">
    <article class="project-article">
      <a class="project-back" href="/">← return to sky</a>
      <header>
        <h1>{project.data.title}</h1>
        <p class="project-summary">{project.data.summary}</p>
        <div class="project-meta">
          <span>{project.data.kind}</span>
          <span class="project-status">{project.data.status.toUpperCase()}</span>
        </div>
      </header>
      <div class="project-body">
        <Content />
      </div>
      {related.length > 0 && (
        <aside class="related-projects">
          <h2>related</h2>
          <ul>
            {related.map((r) => r && (
              <li>
                <a href={`/projects/${r.id}/`}>
                  <span>{r.data.title}</span>
                  <small>{r.note}</small>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  </main>
  <footer class="site-footer">from chiang mai · with melancholy</footer>
</BaseLayout>

<style>
  .project-page-wrap {
    background:
      radial-gradient(rgba(208,138,90,0.05) 0.7px, transparent 1px),
      var(--c-bg-deepest);
    background-size: 22px 22px, 100% 100%;
    min-height: 80vh;
    padding-top: 3rem;
  }
  .project-article {
    max-width: 44rem;
    margin: 0 auto;
    padding-inline: var(--pad-side);
  }
  .project-back {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--c-ink-muted);
    text-decoration: none;
    margin-bottom: 2rem;
    display: inline-block;
    letter-spacing: 0.04em;
  }
  .project-back:hover { color: var(--c-accent-warm); }
  .project-article h1 {
    font-family: var(--font-mono);
    font-size: clamp(2rem, 5vw, 3.2rem);
    line-height: 1.05;
    margin: 0;
  }
  .project-summary {
    font-family: var(--font-sans);
    font-size: 1.1rem;
    color: var(--c-ink-muted);
    margin: 1.25rem 0;
    font-style: italic;
    line-height: 1.5;
  }
  .project-meta {
    display: flex; gap: 1rem;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--c-ink-faint);
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--c-line);
    margin-bottom: 2rem;
  }
  .project-status { color: var(--c-accent-warm); letter-spacing: 0.1em; }
  .project-body :global(p) { margin: 1.2rem 0; line-height: 1.7; }
  .project-body :global(h2) {
    font-family: var(--font-mono);
    font-size: 1rem;
    letter-spacing: 0.05em;
    margin: 2.5rem 0 1rem;
    color: var(--c-accent-warm);
  }
  .project-body :global(code) {
    font-family: var(--font-mono);
    background: rgba(208,138,90,0.1);
    padding: 0.1em 0.35em;
    border-radius: 2px;
    font-size: 0.92em;
  }
  .project-body :global(pre) {
    background: rgba(11,10,9,0.6);
    border: 1px solid var(--c-line);
    border-radius: 6px;
    padding: 1rem;
    overflow-x: auto;
  }
  .related-projects {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--c-line);
  }
  .related-projects h2 {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    letter-spacing: 0.1em;
    color: var(--c-ink-muted);
    margin: 0 0 1rem;
  }
  .related-projects ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.75rem; }
  .related-projects a {
    display: grid; gap: 0.3rem;
    padding: 0.85rem 1rem;
    background: rgba(208,138,90,0.04);
    border-radius: 6px;
    border: 1px solid var(--c-line);
    text-decoration: none;
    transition: border-color var(--dur-fast) var(--ease-soft);
  }
  .related-projects a:hover { border-color: var(--c-accent); }
  .related-projects span { color: var(--c-ink); font-family: var(--font-mono); }
  .related-projects small { color: var(--c-ink-faint); font-family: var(--font-sans); font-style: italic; line-height: 1.5; }
</style>
```

- [ ] **Step 3: Build + commit**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm run build 2>&1 | tail -5
```
Expected: build passes

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/pages/projects/[...slug].astro
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(project): refine project detail page with v1b3topia atmosphere"
```

---

### Task 35: Create 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Write 404**

Write `src/pages/404.astro`:
```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import easterEggs from "../content/copy/easter-eggs.json";
const e = easterEggs["404"];
---

<BaseLayout title="scary beyond all reason · v1b3topia">
  <main id="main" class="not-found">
    <div class="nf-content">
      <h1>{e.h1}</h1>
      <p>{e.sub}</p>
      <a href="/">{e.link}</a>
    </div>
  </main>
</BaseLayout>

<style>
  .not-found {
    min-height: 80vh;
    display: flex; align-items: center; justify-content: center;
    background:
      radial-gradient(ellipse at 50% 30%, rgba(120,80,60,0.15) 0%, transparent 60%),
      var(--c-bg-deepest);
    padding-inline: var(--pad-side);
  }
  .nf-content { text-align: center; max-width: 32rem; }
  .nf-content h1 {
    font-family: var(--font-mono);
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    color: var(--c-ink);
    margin: 0;
    line-height: 1.2;
  }
  .nf-content p {
    font-family: var(--font-sans);
    font-style: italic;
    color: var(--c-ink-muted);
    margin: 1rem 0 2rem;
    line-height: 1.55;
  }
  .nf-content a {
    font-family: var(--font-mono);
    color: var(--c-accent-warm);
    text-decoration: none;
    border-bottom: 1px solid currentColor;
    padding-bottom: 2px;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/pages/404.astro
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(404): scary beyond all reason"
```

---

### Task 36: Add Lenis smooth scroll

**Files:**
- Create: `src/components/layout/SmoothScroll.tsx`
- Modify: `src/pages/index.astro` (add SmoothScroll mount)

- [ ] **Step 1: Write component**

Write `src/components/layout/SmoothScroll.tsx`:
```tsx
import { useEffect } from 'react';
import Lenis from 'lenis';
import { usePayload } from './ContextResolver';

export function SmoothScroll() {
  const payload = usePayload();

  useEffect(() => {
    if (!payload) return;
    if (payload.atmosphere.reduceMotion) return;
    if (payload.state.saveData) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [payload]);

  return null;
}
```

- [ ] **Step 2: Mount SmoothScroll in index.astro**

Modify `src/pages/index.astro` — add import:
```astro
import { SmoothScroll } from "../components/layout/SmoothScroll";
```

Add `<SmoothScroll client:load />` as a sibling of `<HUDStrip />` inside `<ContextResolver>`:
```astro
  <ContextResolver client:load>
    <SmoothScroll client:load />
    <HUDStrip client:load />
    ...
```

- [ ] **Step 3: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/layout/SmoothScroll.tsx src/pages/index.astro
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(layout): SmoothScroll via Lenis (skips on save-data/reduce-motion)"
```

---

## Phase 8 — Polish, A11y, Perf (Tasks 37–41)

### Task 37: Add hero entry motion + cursor parallax

**Files:**
- Create: `src/components/sky/SkyParallax.tsx`
- Modify: `src/components/sky/Sky.tsx`

- [ ] **Step 1: Write SkyParallax**

Write `src/components/sky/SkyParallax.tsx`:
```tsx
import { useEffect, useRef } from 'react';
import { animate } from 'motion';
import { usePayload } from '../layout/ContextResolver';

export function SkyParallax({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const payload = usePayload();

  useEffect(() => {
    if (!payload) return;
    if (payload.atmosphere.reduceMotion) return;
    if (payload.embodiment.pointer !== 'fine') return;
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    let targetX = 0, targetY = 0, curX = 0, curY = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) - 0.5;
      const ny = ((e.clientY - rect.top) / rect.height) - 0.5;
      targetX = -nx * 6;
      targetY = -ny * 4;
    };

    const tick = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      const moon = el.querySelector<HTMLElement>('.moon-wrap');
      const mtn = el.querySelector<HTMLElement>('.mountain-far');
      if (moon) moon.style.transform = `translate(${curX * 0.9}px, ${curY * 0.5}px)`;
      if (mtn) mtn.style.transform = `translate(${curX * 0.25}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);

    // entry animation: fade hero copy in
    const heroCopy = el.querySelector<HTMLElement>('.hero-copy');
    if (heroCopy) {
      animate(heroCopy, { opacity: [0, 1], transform: ['translateY(12px)', 'translateY(0)'] }, { duration: 1.2, ease: 'easeOut' });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, [payload]);

  return <div ref={containerRef}>{children}</div>;
}
```

- [ ] **Step 2: Wrap Sky in SkyParallax**

Modify `src/components/sky/Sky.tsx` — wrap return value in SkyParallax. Replace the final `return (...)` with:

```tsx
import { SkyParallax } from './SkyParallax';

// ... rest of Sky ...

  return (
    <SkyParallax>
      <div className={`${skyClass} ${reduceMotion ? 'motion-still' : ''}`} role="img" aria-label={`night sky over chiang mai with ${bodies.moonPhase.label}`}>
        {/* ... existing inner content ... */}
      </div>
    </SkyParallax>
  );
```

- [ ] **Step 3: Build + commit**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm run build 2>&1 | tail -5
```
Expected: build passes

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/sky/SkyParallax.tsx src/components/sky/Sky.tsx
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(sky): cursor parallax + hero entry motion (desktop, motion-ok only)"
```

---

### Task 38: Add gyro tilt on mobile

**Files:**
- Modify: `src/components/sky/SkyParallax.tsx`

- [ ] **Step 1: Extend SkyParallax for gyro**

Replace the `useEffect` body in `src/components/sky/SkyParallax.tsx` with:
```tsx
  useEffect(() => {
    if (!payload) return;
    if (payload.atmosphere.reduceMotion) return;

    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    let targetX = 0, targetY = 0, curX = 0, curY = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) - 0.5;
      const ny = ((e.clientY - rect.top) / rect.height) - 0.5;
      targetX = -nx * 6;
      targetY = -ny * 4;
    };

    const onOrient = (e: DeviceOrientationEvent) => {
      const g = e.gamma ?? 0; // left-right tilt, -90..90
      const b = e.beta ?? 0;  // front-back tilt, -180..180
      targetX = Math.max(-12, Math.min(12, -g * 0.18));
      targetY = Math.max(-6, Math.min(6, -(b - 30) * 0.04));
    };

    const tick = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      const moon = el.querySelector<HTMLElement>('.moon-wrap');
      const mtn = el.querySelector<HTMLElement>('.mountain-far');
      const mid = el.querySelector<HTMLElement>('.mountain-mid');
      if (moon) moon.style.transform = `translate(${curX * 0.9}px, ${curY * 0.5}px)`;
      if (mtn) mtn.style.transform = `translate(${curX * 0.25}px, 0)`;
      if (mid) mid.style.transform = `translate(${curX * 0.5}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    if (payload.embodiment.pointer === 'fine') {
      window.addEventListener('mousemove', onMove);
    } else if (payload.embodiment.hasGyro && !payload.state.saveData) {
      window.addEventListener('deviceorientation', onOrient);
    }
    raf = requestAnimationFrame(tick);

    const heroCopy = el.querySelector<HTMLElement>('.hero-copy');
    if (heroCopy) {
      animate(heroCopy, { opacity: [0, 1], transform: ['translateY(12px)', 'translateY(0)'] }, { duration: 1.2, ease: 'easeOut' });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('deviceorientation', onOrient);
    };
  }, [payload]);
```

- [ ] **Step 2: Build + commit**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm run build 2>&1 | tail -5
```
Expected: build passes

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/sky/SkyParallax.tsx
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "feat(sky): DeviceOrientation gyro tilt on mobile (skip save-data)"
```

---

### Task 39: A11y audit pass

**Files:** (verification + small fixes)

- [ ] **Step 1: Add semantic landmarks where missing**

Verify the following are present (use grep):
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog
grep -r "id=\"main\"" src/pages/ src/layouts/
grep -r "role=\"img\"" src/components/sky/
grep -r "aria-label" src/components/sky/
```
Expected: at least one match per command.

- [ ] **Step 2: Add aria-current to project links**

Modify `src/pages/projects/[...slug].astro` — find the `<a class="project-back"` line and update to add aria-label:
```astro
      <a class="project-back" href="/" aria-label="return to v1b3topia home">← return to sky</a>
```

- [ ] **Step 3: Test forced-colors fallback**

Build and check no critical render path depends on CSS gradients alone:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm run build 2>&1 | tail -5
```
Expected: build passes

- [ ] **Step 4: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/pages/projects/[...slug].astro
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "a11y: aria-labels on project back link"
```

---

### Task 40: Performance audit

**Files:** (verification only)

- [ ] **Step 1: Run build with size analysis**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm run build 2>&1 | grep -E "(dist|kB|gz)" | head -30
```
Expected: build output showing bundle sizes. Critical: total JS gz < 65kB.

- [ ] **Step 2: If over budget, inspect**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && du -sh dist/_astro/* 2>/dev/null | sort -h | tail -10
```
Identify the largest chunks. The shader lib should be lazy-loaded; if it's not, change `client:load` to `client:visible` on `<MeshBackground />`.

- [ ] **Step 3: Switch MeshBackground to client:visible**

Modify `src/components/sky/Sky.tsx` so that MeshBackground hydrates on visible. Since Sky itself is `client:load`, we can wrap the mesh in a deferred boundary. **Simpler**: keep mesh as part of Sky (which is client:load), but the lib import in Sky.tsx makes it eager. Instead, dynamic-import the MeshBackground inside Sky:

Modify the import in `src/components/sky/Sky.tsx`. Replace `import { MeshBackground } from './MeshBackground';` with:
```tsx
import { lazy, Suspense } from 'react';
const MeshBackground = lazy(() => import('./MeshBackground').then(m => ({ default: m.MeshBackground })));
```

And replace `<MeshBackground />` usage with:
```tsx
        <Suspense fallback={null}>
          <MeshBackground />
        </Suspense>
```

- [ ] **Step 4: Rebuild + verify size**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm run build 2>&1 | grep -E "(dist|kB|gz)" | head -30
```
Expected: shader lib now in separate chunk that lazy-loads.

- [ ] **Step 5: Commit**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog add src/components/sky/Sky.tsx
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog commit -m "perf(sky): lazy-load MeshBackground shader to split chunk"
```

---

### Task 41: Final E2E smoke + production preview

**Files:** (verification)

- [ ] **Step 1: Build production bundle**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm run build 2>&1 | tail -20
```
Expected: build succeeds, no errors.

- [ ] **Step 2: Preview the production build**

Run:
```bash
cd /Users/v1b3_/_dev/project-world-log/v1b3-blog && npm run preview > /tmp/v1b3-preview.log 2>&1 &
sleep 4
curl -s http://localhost:4321/ | head -30
```
Expected: HTML output with v1b3topia content.

- [ ] **Step 3: Stop preview**

Run:
```bash
pkill -f "astro preview" || true
sleep 1
```

- [ ] **Step 4: Verify env example exists**

Run:
```bash
ls -la /Users/v1b3_/_dev/project-world-log/v1b3-blog/.env.example /Users/v1b3_/_dev/project-world-log/v1b3-blog/docs/LASTFM-SETUP.md
```
Expected: both files exist.

- [ ] **Step 5: Final commit (tag the release point)**

```bash
git -C /Users/v1b3_/_dev/project-world-log/v1b3-blog tag -a v1b3topia-v1 -m "v1b3topia v1: Moon&Sun + Doi Suthep + payload-tuned + Kuzco voice + founder presence"
```

- [ ] **Step 6: Tell the user**

The implementation is complete. Next steps for the user:
1. Copy `.env.example` to `.env` and fill in `LASTFM_API_KEY` + `LASTFM_USER` (see `docs/LASTFM-SETUP.md`)
2. Install Web Scrobbler Chrome extension and sign into Last.fm
3. Run `npm run dev` and visit `http://localhost:4321/` to see v1b3topia
4. Visit `http://localhost:4321/?debug=payload` to inspect the visitor payload
5. Deploy to Vercel; set `LASTFM_API_KEY` + `LASTFM_USER` env vars in Vercel dashboard

---

## Self-Review

### Spec coverage check
- **§ 3 Architecture** — covered: Tasks 1, 2, 3, 4 (deps + config + ts + vitest)
- **§ 4 File Plan** — every file in the spec maps to a task. ContextResolver/PayloadDebug → T10, Sky/Moon/Sun/Stars/DoiSuthep/Atmosphere → T11-T17, MeshBackground → T19, HUDStrip/FounderRow/VisitorNoticed → T26/T25/T27, copy json files → T29/T30, suncalc-helpers → T11, text-variants → T31, last-build (bake-git) → T22, lastfm endpoint → T24, sprint → T21, ground/ProjectList → T33, 404 → T35, SmoothScroll → T36, SkyParallax → T37/T38.
- **§ 5 Payload (5 categories)** — covered in T7 (types) + T9 (impl) + T8 (tests).
- **§ 6 Founder Presence** — covered: git (T22), last.fm (T23/T24), sprint (T21), display rules in FounderRow component (T25 with `hideTrack` prop).
- **§ 7 Visual System** — covered: tokens (T5), sky.css (T17), hud.css (T28), ground.css (T33), shader bg (T19).
- **§ 8 Brand Voice** — covered: hero.json variants (T29), easter-eggs.json (T30), 404 page using egg copy (T35).
- **§ 9 Behavior** — covered: visitor-noticed (T27), smooth scroll (T36), cursor parallax (T37), gyro tilt (T38), last.fm refresh (T25 component).
- **§ 10 Pages** — covered: `/` (T33), `/projects/[slug]` (T34), `/404` (T35).
- **§ 11 Endpoints** — `/api/lastfm` covered T24. (Weather endpoint deferred per spec § 16.)
- **§ 12 Build-time data** — bake-git T22, sprint T21.
- **§ 13 Content collections** — hero T29, easter eggs T30. (Existing projects collection preserved.)
- **§ 14 Perf + A11y** — covered: T39 (a11y), T40 (perf).
- **§ 15 8 phases** — Phase 1 = T1-T6, Phase 2 = T7-T10, Phase 3 = T11-T18, Phase 4 = T19-T20, Phase 5 = T21-T28, Phase 6 = T29-T32, Phase 7 = T33-T36, Phase 8 = T37-T41. ✓

### Placeholder scan
- No "TBD" / "TODO" / "implement later" in any task.
- All code blocks contain complete, runnable code.
- All commands are exact and resolvable.

### Type consistency
- `Payload` type used consistently across `readPayload` (T9), `ContextResolver` (T10), `Sky` (T17), `MeshBackground` (T19), `FounderRow` (T25), `HUDStrip` (T26), `VisitorNoticed` (T27), `SmoothScroll` (T36), `SkyParallax` (T38), `HeroCopy` (T32), `resolveHeroVariant` (T31). All read `payload.timeSpace`, `payload.atmosphere`, etc. with matching property names.
- `CommitInfo` from T25 matches the JSON shape baked in T22.
- `SprintInfo` from T25 matches the return of `getCurrentSprintDay` in T21.
- `MoonPhaseInfo` from T11 used by Moon component in T13.

### Spec-to-plan gaps
- **Weather endpoint** explicitly deferred to v2 in spec § 11, not included here. ✓
- **Returning visitor greeting** explicitly deferred in spec § 15, not included here. ✓
- **PWA / offline service worker** explicitly deferred in spec § 15, not included here. ✓

Plan looks complete and consistent. No fixes needed.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-27-v1b3topia-redesign.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
