// ─────────────────────────────────────────────────────────────
// LOVE — Security Configuration
// ─────────────────────────────────────────────────────────────
// Request limits, rate limits, and Content Security Policy.
// Changes to this file require security review (see SECURITY.md).
// ─────────────────────────────────────────────────────────────

export interface RateLimitRule {
  /** Max requests allowed within the window. */
  limit: number;
  windowSeconds: number;
}

export const securityConfig = {
  /** Maximum accepted request body sizes. */
  requestSizeLimits: {
    jsonBytes: 100 * 1024,
    serverActionBytes: 1024 * 1024,
    uploadBytes: 5 * 1024 * 1024,
  },
  /** Per-IP (anonymous) or per-user (authenticated) rate limits. */
  rateLimits: {
    default: { limit: 120, windowSeconds: 60 },
    auth: { limit: 10, windowSeconds: 60 },
    passwordReset: { limit: 3, windowSeconds: 15 * 60 },
    write: { limit: 30, windowSeconds: 60 },
  } satisfies Record<string, RateLimitRule>,
  /** Allowed MIME types for uploads (logos, profile photos). */
  allowedUploadTypes: ['image/png', 'image/jpeg', 'image/webp'] as const,
} as const;

/**
 * Builds a strict, nonce-based Content Security Policy.
 * No 'unsafe-inline' for scripts in production; 'unsafe-eval' only in
 * development (required by React Fast Refresh).
 */
export function buildContentSecurityPolicy(options: {
  nonce: string;
  /** NODE_ENV === 'development' (Fast Refresh needs eval + websockets). */
  isDev: boolean;
  /** Deployed over HTTPS (staging/production). Off for `next start` on http://localhost. */
  isDeployed: boolean;
  /** Extra origins the browser may connect to (e.g. the backend provider URL). */
  connectSrc?: string[];
}): string {
  const { nonce, isDev, isDeployed, connectSrc = [] } = options;
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
    // Tailwind emits a stylesheet; inline styles are only needed by some
    // Radix primitives for positioning.
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'blob:', 'data:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'", ...connectSrc, ...(isDev ? ['ws:'] : [])],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    ...(isDeployed ? { 'upgrade-insecure-requests': [] } : {}),
  };

  return Object.entries(directives)
    .map(([directive, values]) => [directive, ...values].join(' '))
    .join('; ');
}

/** Static security headers applied to every response. */
export const securityHeaders: { key: string; value: string }[] = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), payment=(), usb=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];
