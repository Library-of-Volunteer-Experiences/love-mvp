// ─────────────────────────────────────────────────────────────
// LOVE — Request proxy (Next.js 16+; formerly "middleware")
// ─────────────────────────────────────────────────────────────
// Applies a strict, per-request nonce-based Content Security
// Policy. Next.js reads the nonce from the request CSP header and
// attaches it to its own inline scripts automatically.
//
// Do not use this file for authorization decisions — check
// permissions in each route handler / server action with
// @love/auth (defense in depth; proxies can be bypassed by
// misconfigured matchers).
// ─────────────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from 'next/server';
import { buildContentSecurityPolicy, getPublicEnv, getServerEnv } from '@love/config';

export function proxy(request: NextRequest) {
  const env = getServerEnv();
  const { CONVEX_URL } = getPublicEnv();
  const nonce = btoa(crypto.randomUUID());
  const csp = buildContentSecurityPolicy({
    nonce,
    isDev: env.NODE_ENV === 'development',
    isDeployed: env.APP_ENV === 'staging' || env.APP_ENV === 'production',
    // Allow the live connection to our Convex backend (https + its websocket)
    connectSrc: [CONVEX_URL, CONVEX_URL.replace('https://', 'wss://')],
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: [
    // Skip static assets and image optimization; prefetches don't need a fresh nonce.
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
