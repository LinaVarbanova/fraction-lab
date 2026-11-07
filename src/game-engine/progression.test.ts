import { describe, expect, it } from 'vitest';
import { badges, completeMission, emptyGame, recommendedMission, sanitizeGame, totalXP, unlockedWorld } from './progression';
import { missions } from '../content/missions';
import { initialDraft } from '../problem-engine/validate';
describe('world progression, rewards and persistence boundaries', () => {
  it('opens the next world after just one mission and recommends harder topics', () => {
    const state = completeMission(emptyGame(),'parts-bridge',false,1);
    expect(unlockedWorld(state)).toBe(2);
    expect(recommendedMission(state).id).toBe('mirror-transform');
    expect(state.results['beyond-whole']).toBeUndefined();
  });
  it('allows direct advanced entry without claiming earlier missions were completed', () => {
    const state = completeMission(emptyGame(),'balance-missing',false,2);
    expect(unlockedWorld(state)).toBe(6);
    expect(Object.keys(state.results)).toEqual(['balance-missing']);
    expect(badges(state).find(b => b.id === 'seven')?.earned).toBe(false);
  });
  it('distinguishes assisted rewards and prevents replay farming', () => {
    let state = completeMission(emptyGame(),'parts-bridge',true,3);
    expect(totalXP(state)).toBe(30);
    expect(completeMission(state,'parts-bridge',false,1)).toBe(state);
    state = completeMission(state,'mirror-transform',false,1);
    state.discoveries = ['split'];
    expect(totalXP(state)).toBe(105);
    expect(completeMission(state,'invalid-id',false,1)).toBe(state);
  });
  it('resumes an unfinished selected mission', () => {
    const state = { ...emptyGame(), currentMission: 'island-remainder' };
    expect(recommendedMission(state).id).toBe('island-remainder');
  });
  it('awards the seven-world badge only after actual completion in each world', () => {
    let state = emptyGame();
    for (const mission of missions.filter((_,i) => i%2 === 0)) state = completeMission(state,mission.id,false,1);
    expect(badges(state).every(b => b.earned)).toBe(true);
    expect(recommendedMission(state).id).toBe('beyond-whole');
  });
  it('roundtrips progress and strips invalid IDs and invalid result types', () => {
    const state = completeMission(emptyGame(),'arena-reverse',true,2);
    expect(sanitizeGame(JSON.parse(JSON.stringify(state)))).toEqual(state);
    expect(sanitizeGame({ ...state, results: { invalid: {}, 'parts-bridge': { assisted: 'yes', attempts: -1 } }, currentMission: 'invalid' }).results).toEqual({});
    expect(() => sanitizeGame({ version: 99 })).toThrow();
    expect(() => sanitizeGame(null)).toThrow();
    expect(() => sanitizeGame({ version: 2 })).toThrow();
  });
  it('sanitizes imported draft indexes and slider bounds before rendering', () => {
    const state = emptyGame();
    state.drafts['tower-order'] = { ...initialDraft(missions[5]), order: [9,9,9] };
    state.drafts['mirror-simplify'] = { ...initialDraft(missions[3]), value: 0 };
    state.drafts['island-remainder'] = { ...initialDraft(missions[10]), value: 23, secondary: 50 };
    const saved = sanitizeGame(state);
    expect(saved.drafts['tower-order'].order).toEqual([0,1,2]);
    expect(saved.drafts['mirror-simplify'].value).toBe(1);
    expect(saved.drafts['island-remainder'].secondary).toBe(1);
  });
});
