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
}

function readState(): State {
  if (typeof navigator === 'undefined') {
    return { batteryLevel: null, batteryCharging: null, networkTier: 'unknown', saveData: false, online: true };
  }
  const n = navigator as NavWithConn;
  const conn = n.connection;
  const tier = (conn?.effectiveType as State['networkTier']) ?? 'unknown';
  return {
    batteryLevel: null,
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
