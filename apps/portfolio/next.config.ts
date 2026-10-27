import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'export', trailingSlash: true, images: { unoptimized: true },
  transpilePackages: ['@afataa/validators'],
  experimental: { cpus: 2, inlineCss: true },
  poweredByHeader: false,
};
export default config;
