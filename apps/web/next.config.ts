import path from 'node:path';
import type { NextConfig } from 'next';
import { securityConfig, securityHeaders } from '@love/config';

const nextConfig: NextConfig = {
  // Workspace packages ship TypeScript source; Next compiles them.
  transpilePackages: [
    '@love/api-contracts',
    '@love/auth',
    '@love/backend',
    '@love/config',
    '@love/shared',
    '@love/ui',
    '@love/validation',
  ],
  turbopack: {
    root: path.join(__dirname, '..', '..'),
  },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: securityConfig.requestSizeLimits.serverActionBytes,
    },
  },
  async headers() {
    // The Content-Security-Policy header is set per-request (with a nonce) in src/proxy.ts.
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
