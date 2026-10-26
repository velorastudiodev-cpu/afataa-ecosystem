# AFATAA Digital Ecosystem

Public portfolio for Ahmad Afataa Kusdianto, implemented from the complete PRD v2.0.0-PRODUCTION.

## Apps

- `apps/portfolio` — Next.js 15 static export, "Midnight Glacier" design: a live Dijkstra graph hero (2D canvas, click to re-run), case-study showcase with desktop + mobile captures and preview/report dialogs, OSN pedigree, process timeline, a Dijkstra vs A* race lab on a paintable maze, and a contact brief builder (WhatsApp/email prefill, Cal.com date strip).
- `apps/studio` — retained separate control-panel prototype; its production auth and data bridge are planned after the public site is locked.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm test
npm run test:browser   # set CHROMIUM_PATH if Playwright's bundled browser is missing
npm run build
```

## Restoring the previous (Codex) version

The pre-redesign site is preserved as the git tag `codex-original` and the branch `backup/codex-original`:

```bash
git checkout main && git reset --hard codex-original   # or: git checkout backup/codex-original
```

The build emits the deployable static portfolio in `dist/`. All colors follow the Alpine Ivory / Snow Blue / Sky Blue / Champagne Gold system; application code contains no green, emerald, or teal colors.

## Contact state

All channels come from `apps/portfolio/src/lib/content.json`. The Cal.com date strip renders only while `profile.bookingVerified` is true.
