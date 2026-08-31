import type { TimeSpace } from './payload.types';
import heroData from '../content/copy/hero.json';

export interface HeroCopy {
  h1: string;
  sub: string;
}

interface Conditions {
  localHour?: [number, number];
}

function matchesHourWindow(hour: number, window: [number, number]): boolean {
  const [start, end] = window;
  if (start <= end) return hour >= start && hour < end;
  // wraps midnight: e.g., [19, 6] means 19:00–23:59 OR 00:00–05:59
  return hour >= start || hour < end;
}

function matches(timeSpace: TimeSpace, cond: Conditions): boolean {
  if (cond.localHour && !matchesHourWindow(timeSpace.localHourFloat, cond.localHour)) return false;
  return true;
}

export function resolveHeroVariant(timeSpace: TimeSpace): HeroCopy {
  for (const variant of heroData.variants) {
    if (matches(timeSpace, variant.conditions as Conditions)) {
      return variant.copy;
    }
  }
  return heroData.variants[heroData.variants.length - 1].copy;
}

/**
 * The line under the hero says who is here and offers a way to reach them. It
 * deliberately counts nothing: a tally of what is running would need a
 * published definition of "running" to mean anything, and would be one more
 * hand-kept number to go stale. The ledger below already carries a status per
 * row — a reader can weigh those better than a total can.
 */
export const heroIdentity = heroData.identity;
