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
