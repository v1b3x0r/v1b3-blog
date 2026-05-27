// Sprint config — update or null when sprint changes
// See spec § 12 (Build-time data)

export interface SprintConfig {
  name: string;
  start: string; // ISO date
  days: number;
}

export const sprint: SprintConfig | null = {
  name: "access core loop",
  start: "2026-05-17",
  days: 14,
};

export function getCurrentSprintDay(now: Date = new Date()): { day: number; total: number; name: string } | null {
  if (!sprint) return null;
  const start = new Date(sprint.start);
  const diffMs = now.getTime() - start.getTime();
  const day = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  if (day < 1 || day > sprint.days) return null;
  return { day, total: sprint.days, name: sprint.name };
}
