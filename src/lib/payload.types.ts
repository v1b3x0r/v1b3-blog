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
