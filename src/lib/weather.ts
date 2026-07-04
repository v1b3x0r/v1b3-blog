const FAHRENHEIT_RE = /([+-]?)(\d+(?:\.\d+)?)°F\b/;

export function normalizeWeather(value: string): string | null {
  const weather = value.trim();
  if (!weather || weather.length >= 40 || weather.includes('<')) return null;
  if (weather.includes('°C')) return weather;

  const match = weather.match(FAHRENHEIT_RE);
  if (!match) return null;

  const fahrenheit = Number(`${match[1]}${match[2]}`);
  const celsius = Math.round(((fahrenheit - 32) * 5) / 9);
  const sign = match[1] === '+' && celsius >= 0 ? '+' : '';

  return weather.replace(match[0], `${sign}${celsius}°C`);
}
