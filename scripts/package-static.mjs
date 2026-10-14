import { cp, rm, access } from 'node:fs/promises';
await access('apps/portfolio/out/index.html');
await rm('dist', { recursive: true, force: true });
await cp('apps/portfolio/out', 'dist', { recursive: true });
console.log('Verified Next.js static export copied to dist. Studio excluded.');
