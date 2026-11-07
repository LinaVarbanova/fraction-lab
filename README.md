# Fraction Lab · Математическата академия

Stages A–B of a Bulgarian mathematics adventure, built with React, TypeScript, Vite, Motion, SVG and KaTeX. Student-facing content is Bulgarian. Fonts and math assets are bundled locally; no accounts or runtime APIs are required.

## Run and verify

Use Node.js 22.12+ (Node 24 recommended).

```sh
npm ci
npm run dev
npm test
npm run build
npm run test:e2e
```

Browser tests use `/usr/bin/chromium` when available, otherwise Playwright's installed Chromium. Set `CHROMIUM_PATH` to override. Install with `npx playwright install --with-deps chromium` when needed.

## Stage B: Playable Academy

All seven worlds now contain two original interactive missions, 14 in total:

| World | Interactive missions |
| --- | --- |
| Залата на частите | Build a fraction bridge; assemble an improper fraction and see its mixed number |
| Огледалният лабиринт | Transform equivalent fractions; group pieces to simplify |
| Кулата на знаменателите | Synchronize partitions; reorder fraction steps |
| Машината на операциите | Build an addition-machine output; measure division as portions |
| Лабораторията на неизвестното | Balance an equation; solve an equation with two operations |
| Островът на логиката | Model fractions of remainders in two scenarios |
| Арената на математиците | Build reverse-operation paths and recover original quantities |

One completed mission opens the next world. The second mission remains optional. A student can attempt an entrance mission in any later world immediately, so familiar basic fractions never become a long gate. Unlocking earlier worlds does not mark their missions as solved.

Every mission uses a manipulable model or ordered reasoning path; numerical answers alone cannot complete the remainder and reverse-reasoning missions. The four Stage A exploratory labs remain available, including pointer-driven and keyboard-operated number-line positioning.

Completed missions earn 50 XP independently, or 30 XP with a hint. Exploratory discoveries earn 25 XP each. Rewards are issued only once; replaying or revealing a hint after completion does not alter the original completion record or farm XP. Achievements are derived from actual completed missions. Parent and skill views show real completion data, with no claim of long-term mastery.

## Task-focused play design

Play opens on a dedicated screen with a high-contrast Bulgarian instruction, a large mathematical target and a tactile interactive model. The split lab explicitly advances from dividing into four parts to coloring three. Mission instructions lead the visual hierarchy, while compact navigation and a persistent check action keep attention on the current task. The academy uses warm paper tones, stronger world colors and locally bundled Cyrillic typography.

## Saved progress

IndexedDB stores results, drafts, hint usage, attempt counts and the current mission. A synchronous localStorage backup protects the latest snapshot during navigation/reloads and provides a fallback when IndexedDB is unavailable. Writes are serialized, and old Stage A discoveries migrate automatically. Current completion records describe the first successful solve; full attempt history and mastery across sessions are later work.

Parent view supports validated JSON export/import for moving progress between devices. Import replaces the current save; invalid files leave it intact. Invalid mission IDs, indices, counts and slider bounds are sanitized. No data leaves the device.

## Structure

- `src/math-core`: immutable BigInt rationals and exact arithmetic.
- `src/content`: typed, original mission definitions and Bulgarian explanations.
- `src/problem-engine`: exact model checking, including intermediate reasoning requirements.
- `src/game-engine`: unlocks, recommendations, one-time rewards, achievements and save validation.
- `src/interactions`: exploration labs and mission mechanisms.
- `src/components`: mathematical renderers, bars/circles, SVG academy and backup tools.
- `src/storage`: IndexedDB, backup, migration and failure handling.
- `tests`: complete seven-world journey, all optional missions, touch/keyboard interaction, migration, resume, backups and responsive layouts.

This is the playable academy foundation, not the full Stage C curriculum. The 150–200-problem bank, validated generators, full topic coverage, multi-session mastery, five game modes, advanced solution engine and offline PWA caching remain for subsequent stages. Arena tasks are original advanced-reasoning exercises, not official competition questions.

## GitHub Pages

`.github/workflows/deploy.yml` tests and builds pushes to `main`, then deploys `dist`. Relative assets support `/fraction-lab/` hosting. Repository **Settings → Pages → Source** must be **GitHub Actions**. If automatic enablement is rejected with `Resource not accessible by integration`, a repository administrator must enable Pages once, then rerun the workflow.

Expected site after successful deployment: https://linavarbanova.github.io/fraction-lab/
