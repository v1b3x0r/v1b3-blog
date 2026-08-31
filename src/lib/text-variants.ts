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
 * Labels and destinations for the two doors under the hero. There is no
 * sentence here any more: the homepage tried one ("one person in chiang mai,
 * each of these belongs to a different world") and it led nowhere a reader
 * could follow — the same idea does its job on /whoami, where there is a page
 * around it. An earlier draft counted what was running, which was rejected for
 * a different reason: a total needs a published definition of "running" to mean
 * anything, and the ledger below already carries a status per row.
 */
export const heroIdentity = heroData.identity;
