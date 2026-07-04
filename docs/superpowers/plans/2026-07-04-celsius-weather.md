# Celsius Weather Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the founder HUD display Chiang Mai weather in Celsius for every visitor without dropping valid Fahrenheit responses.

**Architecture:** Keep `/api/weather` as the weather SSOT. Request metric output from `wttr.in`, then normalize the short upstream string at the API boundary so `FounderRow` only receives Celsius text.

**Tech Stack:** Astro 6 API routes, TypeScript, Vitest

---

### Task 1: Test weather-unit normalization

**Files:**
- Create: `src/lib/weather.ts`
- Create: `src/lib/weather.test.ts`
- Modify: `src/pages/api/weather.ts`

- [x] **Step 1: Write the failing normalization tests**

```ts
import { describe, expect, it } from 'vitest';
import { normalizeWeather } from './weather';

describe('normalizeWeather', () => {
  it('keeps Celsius weather unchanged', () => {
    expect(normalizeWeather('🌤️  +31°C')).toBe('🌤️  +31°C');
  });

  it('converts Fahrenheit weather to rounded Celsius', () => {
    expect(normalizeWeather('🌤️  +88°F')).toBe('🌤️  +31°C');
    expect(normalizeWeather('❄️  -4°F')).toBe('❄️  -20°C');
  });

  it('rejects unsupported or unsafe upstream text', () => {
    expect(normalizeWeather('weather unavailable')).toBeNull();
    expect(normalizeWeather('<html>upstream error</html>')).toBeNull();
  });
});
```

- [x] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- src/lib/weather.test.ts`

Expected: FAIL because `normalizeWeather` is not exported.

- [x] **Step 3: Add metric request and API-boundary normalization**

In `src/lib/weather.ts`, export:

```ts
const FAHRENHEIT_RE = /([+-]?)(\d+(?:\.\d+)?)°F\b/;

export function normalizeWeather(value: string): string | null {
  const weather = value.trim();
  if (!weather || weather.length >= 40 || weather.includes('<')) return null;
  if (weather.includes('°C')) return weather;

  const match = weather.match(FAHRENHEIT_RE);
  if (!match) return null;

  const fahrenheit = Number(`${match[1]}${match[2]}`);
  const celsius = Math.round((fahrenheit - 32) * 5 / 9);
  const sign = match[1] === '+' && celsius >= 0 ? '+' : '';

  return weather.replace(match[0], `${sign}${celsius}°C`);
}
```

In `src/pages/api/weather.ts`, request metric output, import the normalizer, and
replace the current inline response validation:

```ts
import { normalizeWeather } from '../../lib/weather';

const WTTR_URL = 'https://wttr.in/Chiang+Mai?format=%c+%t&m';
const weather = r.ok ? normalizeWeather(text) : null;
```

- [x] **Step 4: Run the focused test**

Run: `npm test -- src/lib/weather.test.ts`

Expected: 3 tests pass.

### Task 2: Integrate and verify

**Files:**
- Modify: `NEXT-SESSION.md`

- [x] **Step 1: Record the completed Celsius behavior**

Add under `## Done this session`:

```md
- Forced Chiang Mai HUD weather to Celsius at the API boundary, including a
  Fahrenheit-to-Celsius fallback for locale/cache drift.
```

- [x] **Step 2: Run the full project checks**

Run:

```bash
npm test
npx astro check
npm run build
```

Expected: all tests pass, Astro reports no errors, and the production build completes.

- [x] **Step 3: Inspect the final diff**

Run:

```bash
git diff --check
git status --short
git diff -- src/pages/api/weather.ts src/lib/weather.ts src/lib/weather.test.ts NEXT-SESSION.md
```

Expected: only the planned weather implementation, test, task-log update, and plan document are present.

- [x] **Step 4: Commit the implementation**

```bash
git add src/pages/api/weather.ts src/lib/weather.ts src/lib/weather.test.ts NEXT-SESSION.md docs/superpowers/plans/2026-07-04-celsius-weather.md
git commit -m "fix: normalize HUD weather to Celsius"
```
