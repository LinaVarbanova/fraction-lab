import { describe, expect, it } from 'vitest';
import { missions, worldMissions } from '../content/missions';
import { initialDraft, solution, validateMission, type Draft } from './validate';
import { fraction } from '../math-core/fraction';
const answers: Record<string, Partial<Draft>> = {
  'parts-bridge': { value: 5 }, 'beyond-whole': { value: 7 },
  'mirror-transform': { value: 3 }, 'mirror-simplify': { value: 3 },
  'tower-sync': { value: 12 }, 'tower-order': { order: [1,2,0] },
  'machine-add': { value: 5 }, 'machine-divide': { value: 6 },
  'balance-missing': { value: 18 }, 'balance-offset': { value: 16 },
  'island-remainder': { value: 8, secondary: 4 }, 'island-route': { value: 6, secondary: 12 },
  'arena-reverse': { value: 24, order: [0,1] }, 'arena-second-code': { value: 40, order: [0,1] },
};
describe('mission content and exact answer checks', () => {
  it('covers each world with two distinct original missions', () => {
    expect(new Set(missions.map(m => m.id)).size).toBe(14);
    for (const world of [1,2,3,4,5,6,7] as const) expect(worldMissions(world)).toHaveLength(2);
  });
  for (const mission of missions) it(`validates ${mission.id} independently`, () => {
    expect(validateMission(mission, initialDraft(mission))).toBe(false);
    expect(validateMission(mission, { ...initialDraft(mission), ...answers[mission.id] })).toBe(true);
  });
  it('requires the least denominator and an irreducible fraction', () => {
    expect(validateMission(missions[4], { ...initialDraft(missions[4]), value: 24 })).toBe(false);
    expect(validateMission(missions[3], { ...initialDraft(missions[3]), value: 1 })).toBe(false);
  });
  it('requires both reasoning steps, not just a coincidentally correct remainder', () => {
    expect(validateMission(missions[10], { ...initialDraft(missions[10]), value: 6, secondary: 6 })).toBe(false);
    expect(validateMission(missions[12], { ...initialDraft(missions[12]), value: 24, order: [1,0] })).toBe(false);
  });
  it('rejects malformed orders and noninteger models', () => {
    for (const order of [[1,1,0], [1,2], [9,2,0], [0,1,2]]) expect(validateMission(missions[5], { ...initialDraft(missions[5]), order })).toBe(false);
    expect(validateMission(missions[0], { ...initialDraft(missions[0]), value: NaN })).toBe(false);
    expect(validateMission(missions[0], { ...initialDraft(missions[0]), value: 5.5 })).toBe(false);
  });
  it('computes the original quantities exactly', () => {
    expect(solution(missions[8])).toEqual(fraction(18));
    expect(solution(missions[9])).toEqual(fraction(16));
    expect(solution(missions[10])).toEqual(fraction(12));
    expect(solution(missions[12])).toEqual(fraction(24));
    expect(solution(missions[13])).toEqual(fraction(40));
  });
});
