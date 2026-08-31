import { describe, it, expect } from 'vitest';
import { resolveHeroVariant } from './text-variants';
import heroData from '../content/copy/hero.json';
import type { TimeSpace } from './payload.types';

function ts(overrides: Partial<TimeSpace> = {}): TimeSpace {
  return {
    tz: 'Asia/Bangkok',
    locale: 'en-US',
    localHourFloat: 13,
    dayOfWeek: 3,
    isThaiSpeaker: false,
    isCnxTimezone: true,
    ...overrides,
  };
}

describe('resolveHeroVariant', () => {
  it('picks dual-night at 23:00', () => {
    const r = resolveHeroVariant(ts({ localHourFloat: 23 }));
    expect(r.h1).toMatch(/under this moon/);
  });

  it('picks dawn-on-you for hour 7', () => {
    const r = resolveHeroVariant(ts({ localHourFloat: 7 }));
    expect(r.h1).toMatch(/sun rising/i);
  });

  it('picks default mid-day', () => {
    const r = resolveHeroVariant(ts({ localHourFloat: 13 }));
    expect(r.h1).toMatch(/somewhere in chiang mai/);
  });

  it('contains all variants from json', () => {
    expect(heroData.variants.length).toBeGreaterThanOrEqual(3);
  });
});
