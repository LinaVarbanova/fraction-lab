import { emptyGame, sanitizeGame, type GameState } from '../game-engine/progression';
import { readProgress } from './progress';
const databaseName = 'fraction-lab';
const backupKey = 'fraction-lab-game-v2';
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve,reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('progress');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Базата с напредъка е блокирана.'));
  });
}
async function readDatabase(): Promise<unknown> {
  const db = await openDatabase();
  try { return await new Promise((resolve,reject) => {
    const transaction = db.transaction('progress', 'readonly');
    const request = transaction.objectStore('progress').get('game');
    transaction.oncomplete = () => resolve(request.result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  }); } finally { db.close(); }
}
async function writeDatabase(game: GameState): Promise<void> {
  const db = await openDatabase();
  try { await new Promise<void>((resolve,reject) => {
    const transaction = db.transaction('progress', 'readwrite');
    transaction.objectStore('progress').put(game, 'game');
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  }); } finally { db.close(); }
}
export async function loadGame(): Promise<GameState> {
  // Synchronous backup is also the freshest snapshot if the page closed during an IDB transaction.
  try { const backup = localStorage.getItem(backupKey); if (backup) return sanitizeGame(JSON.parse(backup)); } catch { /* Try IndexedDB. */ }
  try { const saved = await readDatabase(); if (saved) return sanitizeGame(saved); } catch { /* Migrate or start in memory. */ }
  return { ...emptyGame(), discoveries: readProgress() };
}
let saveQueue: Promise<unknown> = Promise.resolve();
export function persistGame(game: GameState): Promise<boolean> {
  let backupSaved = false;
  try { localStorage.setItem(backupKey, JSON.stringify(game)); backupSaved = true; } catch { /* IndexedDB may remain available. */ }
  // Serialize writes so slower older snapshots cannot replace newer ones.
  const save = saveQueue.then(async () => { try { await writeDatabase(game); return true; } catch { return backupSaved; } });
  saveQueue = save.catch(() => undefined);
  return save;
}
