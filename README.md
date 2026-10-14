# AFATAA Digital Ecosystem

Public portfolio for Ahmad Afataa Kusdianto, implemented from the complete PRD v2.0.0-PRODUCTION.

## Apps

- `apps/portfolio` — Next.js 15 static export with React Three Fiber crystal, OSN pedigree, screenshot-backed live project showcase, technical report drawer, real Dijkstra/A* workspace, token customizer, direct contact hub, and optional Cal.com embed.
- `apps/studio` — retained separate control-panel prototype; its production auth and data bridge are planned after the public site is locked.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm test
npm run test:browser
npm run build
```

The build emits the deployable static portfolio in `dist/`. All colors follow the Alpine Ivory / Snow Blue / Sky Blue / Champagne Gold system; application code contains no green, emerald, or teal colors.

## Contact state

GitHub, LinkedIn, Instagram, WhatsApp, and email are connected to the supplied values. Discord and Zoom remain visibly marked as unavailable until their real IDs/links are provided. Cal.com is deliberately not rendered as active because `afataa/discovery-call` is not active yet; the portfolio offers direct WhatsApp/email actions instead.
