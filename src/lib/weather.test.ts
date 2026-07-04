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
