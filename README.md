# Fraction Lab · Математическата академия

Playable Stage A of the Bulgarian mathematics academy, built with React, TypeScript, Vite, Motion, SVG, and KaTeX. Student-facing copy is Bulgarian. Fonts and mathematical assets are bundled locally; no runtime accounts or external APIs are required.

## Run

Requires Node.js 22.12+ (Node 24 recommended).

```sh
npm ci
npm run dev
npm test
npm run build
npm run test:e2e
```

Browser tests use `/usr/bin/chromium` if available, otherwise Playwright's installed Chromium. Set `CHROMIUM_PATH` to override. Run `npx playwright install --with-deps chromium` when needed.

## Interactive demonstration

- Split a whole into 1–12 equal parts and toggle pieces. A synchronized fraction circle and stacked fraction show the selected amount.
- Subdivide two thirds using a live multiplier; the length stays constant while both fraction terms change.
- Drag a point along a number line, or use arrow keys, Home and End. Position snaps to eighths; checking uses exact rational equality.
- Experiment with common partitions for two thirds and one fourth. Live bars transform only when the denominator is valid. Distinguishes a common denominator from the least common denominator.
- All four labs are immediately available, with direct next-activity navigation. There is no repetitive introductory unlock gate.

The academy includes an original SVG illustration, seven-world curriculum map, skill view, parent summary, local discovery persistence, keyboard alternatives, and reduced-motion support. Discoveries award XP once; they do not claim long-term mastery. Worlds 4–7 are clearly marked as future stages, not playable placeholder questions.

## Structure

- `src/math-core`: immutable normalized BigInt rationals, exact operations/comparisons, common denominators, mixed-number conversion and answer parsing.
- `src/interactions`: the four interactive labs and deterministic hints.
- `src/components`: reusable fraction bars, fraction circles, mathematical notation and original academy illustration.
- `src/storage`: versioned local discovery storage with corrupt-data and unavailable-storage handling.
- `tests`: browser interaction, persistence, pointer dragging, responsive and reduced-motion checks.

Stage A uses localStorage for its small discovery record. IndexedDB, full multi-session mastery, the complete curriculum, challenge modes and offline PWA caching belong to subsequent stages.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` tests and builds on pushes to `main`, then deploys `dist` using GitHub Pages. Relative asset paths support the `/fraction-lab/` repository URL. In repository **Settings → Pages**, choose **GitHub Actions** as the build source if it is not already enabled. The workflow attempts to enable Pages automatically when repository permissions allow it.

Expected site address after successful deployment: https://linavarbanova.github.io/fraction-lab/
