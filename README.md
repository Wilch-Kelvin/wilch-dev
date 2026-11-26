# wilch-dev

Kelvin Wilch's portfolio, built for [wilch.dev](https://wilch.dev).
Next.js 15 (App Router, static export), React 19, TypeScript strict and
Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in out/
npm start            # serve out/ on http://127.0.0.1:4173
```

## Checks

```bash
npm run lint && npm run typecheck && npm test && npm run build
npm run test:e2e     # Playwright smoke test (needs `npx playwright install chromium` once)
npm run contrast     # WCAG AA contrast check of every colour token pair
```

## Where things live

- `src/content/`: every word and every data item on the site (edit copy here).
- `src/lib/`: pure logic with tests beside it.
- `src/components/`: drawing only.
- `docs/PLAN.md`: the build plan; `docs/COPY.md`: copy inventory.
- `design/claude-design/`: the original design (reference only).
