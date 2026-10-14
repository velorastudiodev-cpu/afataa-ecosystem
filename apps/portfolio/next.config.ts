import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'export', trailingSlash: true, images: { unoptimized: true },
  transpilePackages: ['@afataa/validators', '@afataa/ui'],
  experimental: { cpus: 2 },
  poweredByHeader: false,
};
export default config;
