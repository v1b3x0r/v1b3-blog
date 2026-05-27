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
