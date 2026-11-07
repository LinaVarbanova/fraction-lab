import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { loadGame, persistGame } from './game';
import { completeMission, emptyGame } from '../game-engine/progression';
beforeEach(() => {
  const values = new Map<string,string>();
  vi.stubGlobal('indexedDB', new IDBFactory());
  vi.stubGlobal('localStorage', { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string,value: string) => values.set(key,value), removeItem: (key: string) => values.delete(key) });
});
afterEach(() => vi.unstubAllGlobals());
describe('saved academy state', () => {
  it('migrates old discoveries without resetting XP', async () => {
    localStorage.setItem('fraction-lab-stage-a-v1', JSON.stringify(['split','equivalence','split','invalid']));
    expect((await loadGame()).discoveries).toEqual(['split','equivalence']);
  });
  it('persists results and an unfinished draft in IndexedDB', async () => {
    const game = completeMission(emptyGame(),'machine-add',false,2);
    game.currentMission = 'balance-missing';
    game.drafts['balance-missing'] = { value: 12, secondary: 0, order: [1,0], hints: true, attempts: 1 };
    expect(await persistGame(game)).toBe(true);
    localStorage.removeItem('fraction-lab-game-v2');
    expect(await loadGame()).toEqual(game);
  });
  it('serializes writes and uses the newest snapshot', async () => {
    const first = completeMission(emptyGame(),'parts-bridge',false,1);
    const second = completeMission(first,'mirror-transform',false,1);
    await Promise.all([persistGame(first),persistGame(second)]);
    localStorage.removeItem('fraction-lab-game-v2');
    expect(await loadGame()).toEqual(second);
  });
  it('recovers a corrupt backup from IndexedDB', async () => {
    const state = completeMission(emptyGame(),'tower-sync',true,2);
    await persistGame(state);
    localStorage.setItem('fraction-lab-game-v2','{broken');
    expect(await loadGame()).toEqual(state);
  });
  it('falls back to backup when IndexedDB is unavailable', async () => {
    vi.stubGlobal('indexedDB', { open: () => { throw new Error('disabled'); } });
    const state = completeMission(emptyGame(),'parts-bridge',false,1);
    expect(await persistGame(state)).toBe(true);
    expect(await loadGame()).toEqual(state);
  });
  it('reports complete storage failure and still permits an in-memory game', async () => {
    vi.stubGlobal('indexedDB', { open: () => { throw new Error('disabled'); } });
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('disabled'); }, setItem: () => { throw new Error('disabled'); } });
    expect(await persistGame(emptyGame())).toBe(false);
    expect(await loadGame()).toEqual(emptyGame());
  });
});
