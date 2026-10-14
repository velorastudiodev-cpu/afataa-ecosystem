# AFATAA Digital Ecosystem

Dual surface portfolio experience for Ahmad Afataa Kusdianto, built from the complete PRD v2.0.0-PRODUCTION.

- `apps/portfolio` — public portfolio, no visitor login.
- `apps/studio` — separate private content control panel.
- `packages/design-tokens` — shared Alpine Ivory / Snow Blue / Sky Blue / Champagne Gold tokens.
- `docs/requirements.md` — implementation coverage and production integration notes.

Run locally with Python's built-in static server:

```bash
npm run dev:portfolio
npm run dev:studio
```

No external dependency is required for the visual prototype. The production integrations specified in the PRD (Supabase Auth/DB/Storage, Drizzle, Next.js, Cal.com embed, and webhook revalidation) are isolated as the next wiring phase once credentials and deployment targets are available.
