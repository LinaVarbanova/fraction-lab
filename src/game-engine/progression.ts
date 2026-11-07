import { missions, missionById, type WorldId } from '../content/missions';
import { initialDraft, type Draft } from '../problem-engine/validate';
import { activityIds, type Activity } from '../storage/progress';
export type Completion = { assisted: boolean; attempts: number; completedAt: number };
export type GameState = { version: 2; discoveries: Activity[]; results: Record<string, Completion>; drafts: Record<string, Draft>; currentMission: string | null };
export const emptyGame = (): GameState => ({ version: 2, discoveries: [], results: {}, drafts: {}, currentMission: null });
export function unlockedWorld(state: GameState): WorldId {
  return Math.min(7, Math.max(0, ...Object.keys(state.results).map(id => missionById(id)?.world ?? 0)) + 1) as WorldId;
}
export function totalXP(state: GameState) {
  return state.discoveries.length * 25 + Object.values(state.results).reduce((total, result) => total + (result.assisted ? 30 : 50), 0);
}
export function recommendedMission(state: GameState) {
  if (state.currentMission && !state.results[state.currentMission]) return missionById(state.currentMission)!;
  const untouched = missions.find(mission => !missions.some(other => other.world === mission.world && state.results[other.id]));
  return untouched ?? missions.find(mission => !state.results[mission.id]) ?? missions[missions.length - 1];
}
export function completeMission(state: GameState, id: string, assisted: boolean, attempts: number): GameState {
  if (!missionById(id) || state.results[id]) return state;
  return { ...state, results: { ...state.results, [id]: { assisted, attempts: Math.max(1, attempts), completedAt: Date.now() } } };
}
export function badges(state: GameState) {
  const completed = missions.filter(m => state.results[m.id]);
  return [
    { id: 'first', name: 'Първи механизъм', description: 'Завърши първата си мисия', earned: completed.length > 0 },
    { id: 'independent', name: 'Самостоятелен откривател', description: 'Реши мисия без насока', earned: Object.values(state.results).some(r => !r.assisted) },
    { id: 'reasoning', name: 'По следите на логиката', description: 'Завърши мисия в света на логиката', earned: completed.some(m => m.world === 6) },
    { id: 'seven', name: 'Седем хоризонта', description: 'Завърши по една мисия във всеки свят', earned: new Set(completed.map(m => m.world)).size === 7 },
  ];
}
/** Validate persistence/import at the boundary. Unknown fields and unknown mission IDs are ignored. */
export function sanitizeGame(value: unknown): GameState {
  const game = emptyGame();
  if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 2) throw new Error('Неподдържан формат на записа.');
  const raw = value as Record<string, unknown>;
  const object = (input: unknown): input is Record<string, unknown> => !!input && typeof input === 'object' && !Array.isArray(input);
  if (!Array.isArray(raw.discoveries) || !object(raw.results) || !object(raw.drafts) || (raw.currentMission !== null && typeof raw.currentMission !== 'string')) throw new Error('Невалидно резервно копие.');
  if (Array.isArray(raw.discoveries)) game.discoveries = activityIds.filter(id => (raw.discoveries as unknown[]).includes(id));
  if (raw.currentMission && typeof raw.currentMission === 'string' && missionById(raw.currentMission)) game.currentMission = raw.currentMission;
  const safeCount = (input: unknown, maximum = 1000000): input is number => typeof input === 'number' && Number.isSafeInteger(input) && input >= 0 && input <= maximum;
  if (object(raw.results)) for (const [id,result] of Object.entries(raw.results)) {
    if (missionById(id) && object(result) && typeof result.assisted === 'boolean' && safeCount(result.attempts) && typeof result.completedAt === 'number' && Number.isFinite(result.completedAt) && result.completedAt >= 0) game.results[id] = { assisted: result.assisted, attempts: result.attempts, completedAt: result.completedAt };
  }
  if (object(raw.drafts)) for (const [id,draft] of Object.entries(raw.drafts)) {
    const mission = missionById(id);
    if (!mission || !object(draft) || !safeCount(draft.value, 240) || !safeCount(draft.secondary, 240) || typeof draft.hints !== 'boolean' || !safeCount(draft.attempts)) continue;
    const defaults = initialDraft(mission);
    const count = mission.kind === 'order' ? mission.fractions.length : 2;
    const validOrder = Array.isArray(draft.order) && draft.order.length === count && new Set(draft.order).size === count && draft.order.every(i => safeCount(i, count - 1));
    const maximum = mission.kind === 'pieces' ? mission.parts * mission.wholes : mission.kind === 'equivalent' ? 4 : mission.kind === 'simplify' ? 6 : mission.kind === 'denominator' ? 24 : mission.kind === 'balance' ? mission.maximum : mission.kind === 'remainder' ? mission.total : mission.kind === 'reverse' ? 60 : mission.kind === 'operation' ? mission.partitions === 1 ? 8 : mission.partitions : 240;
    const minimum = mission.kind === 'equivalent' || mission.kind === 'simplify' ? 1 : mission.kind === 'denominator' ? 4 : 0;
    const amount = Math.max(minimum, Math.min(maximum, draft.value));
    game.drafts[id] = { value: amount, secondary: mission.kind === 'remainder' ? Math.min(draft.secondary, mission.total-amount) : draft.secondary, order: validOrder ? draft.order as number[] : defaults.order, hints: draft.hints, attempts: draft.attempts };
  }
  return game;
}
