# Implemented requirements

The complete PDF PRD v2.0.0-PRODUCTION was read from the attached file and implemented as a static-first monorepo foundation.

- `apps/portfolio`: public, no-login portfolio with floating navigation, hero, 3D-inspired glacial polyhedron, OSN pedigree bento, masterpiece showcase, preview toggle, pathfinding sandbox, token customizer, booking CTA, and social channel grid.
- `apps/studio`: separate private control-panel surface with identity editor, achievement manager, masterpiece table, social/booking link controller, and publish status interaction.
- Shared design tokens use Alpine Ivory, Crisp White, Snow Blue, Sky Blue, and Champagne Gold. No green, emerald, teal, or green utility classes are present in the application CSS.
- Original project URLs from the PDF are included exactly:
  - https://ikbar-barbershop.vercel.app
  - https://ikbar-barbershop-5rx3.vercel.app/dashboard
  - https://dzikri-mount-guide.vercel.app
- Original identity and OSN claims from the PDF are represented without adding new achievements.
- The Cal.com slug from the PDF is used for the booking CTA: `afataa/discovery-call`.
- The supplied GitHub, LinkedIn, Instagram, WhatsApp, and email values are connected. Discord and Zoom remain unlinked because no real identifiers were provided. Cal.com is not activated because the owner confirmed the slug is not active yet.

## Implementation notes

The portfolio is now a Next.js 15 / React 19 static export. The public project screenshots were captured from the three real URLs in the PRD; Dzikri blocks iframe embedding and Ikbar CMS is sign-in protected, so the UI explains those states and provides direct links. The crystal uses React Three Fiber with a CSS/SVG fallback.

## Runtime

The current implementation is dependency-free static HTML/CSS/JS so it runs immediately in the workspace and can later be moved into the requested Next.js/Turborepo/Supabase deployment without blocking visual review:

```bash
npm run dev:portfolio  # http://localhost:4173
npm run dev:studio     # http://localhost:4174
```

The publish interaction is a local UI flow. Production Supabase Auth, Drizzle migrations, Storage, webhook revalidation, Cal.com embed, and deployment credentials still need to be connected before production release.
