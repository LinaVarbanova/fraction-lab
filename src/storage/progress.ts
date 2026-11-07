export type Activity = 'split' | 'equivalence' | 'line' | 'common';
export const activityIds: Activity[] = ['split', 'equivalence', 'line', 'common'];
const key = 'fraction-lab-stage-a-v1';
export function readProgress(): Activity[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(value) ? activityIds.filter(id => value.includes(id)) : [];
  } catch { return []; }
}
export function saveProgress(value: Activity[]): boolean {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
