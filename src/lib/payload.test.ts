import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readPayload, getSkyState, isCnxTimezone } from './payload';

describe('readPayload', () => {
  beforeEach(() => {
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
