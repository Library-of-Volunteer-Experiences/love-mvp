// ─────────────────────────────────────────────────────────────
// LOVE — CSRF defenses
// ─────────────────────────────────────────────────────────────
// Layered with SameSite cookies:
// 1. Server Actions: Next.js already compares Origin and Host.
// 2. Route handlers that mutate state MUST call isTrustedOrigin().
// 3. OAuth flows use a random `state` value (generateCsrfToken) that
//    is compared with timingSafeEqual().
// ─────────────────────────────────────────────────────────────

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function isSafeMethod(method: string): boolean {
  return SAFE_METHODS.has(method.toUpperCase());
}

/**
 * Returns true if the request's Origin (or Referer, as a fallback)
 * matches one of the allowed origins. Missing headers fail closed.
 */
export function isTrustedOrigin(
  headers: { get(name: string): string | null },
  allowedOrigins: readonly string[]
): boolean {
  const source = headers.get('origin') ?? headers.get('referer');
  if (!source) return false;
  try {
    const origin = new URL(source).origin;
    return allowedOrigins.some((allowed) => new URL(allowed).origin === origin);
  } catch {
    return false;
  }
}

/** Cryptographically random URL-safe token (Web Crypto: works in Node, Edge, and browsers). */
export function generateCsrfToken(byteLength = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Constant-time string comparison to avoid timing side channels. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
