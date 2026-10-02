// ─────────────────────────────────────────────────────────────
// LOVE — Backend Configuration
// ─────────────────────────────────────────────────────────────
// Switching backend providers should only require changing
// the BACKEND_PROVIDER environment variable.
// ─────────────────────────────────────────────────────────────

import type { BackendProvider } from './env';

export interface BackendConfig {
  provider: BackendProvider;
  /** Provider-specific connection options */
  options: Record<string, unknown>;
}

export function createBackendConfig(provider: BackendProvider): BackendConfig {
  switch (provider) {
    case 'convex':
      return {
        provider: 'convex',
        options: {
          deploymentUrl: process.env['NEXT_PUBLIC_CONVEX_URL'] ?? '',
        },
      };
    case 'supabase':
      return {
        provider: 'supabase',
        options: {
          url: process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? '',
          anonKey: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ?? '',
        },
      };
    case 'firebase':
      return {
        provider: 'firebase',
        options: {
          apiKey: process.env['NEXT_PUBLIC_FIREBASE_API_KEY'] ?? '',
          authDomain: process.env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'] ?? '',
          projectId: process.env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'] ?? '',
        },
      };
    default: {
      const _exhaustive: never = provider;
      throw new Error(`Unknown backend provider: ${_exhaustive}`);
    }
  }
}
