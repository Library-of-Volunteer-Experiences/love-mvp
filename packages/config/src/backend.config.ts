// ─────────────────────────────────────────────────────────────
// LOVE — Backend Configuration
// ─────────────────────────────────────────────────────────────
// Switching backend providers requires changing ONE value:
//
//   BACKEND_PROVIDER=convex | supabase | firebase
//
// AUTH_PROVIDER / STORAGE_PROVIDER are optional overrides for the
// rare case where one concern must live on a different provider
// (e.g. during a phased migration).
// ─────────────────────────────────────────────────────────────

import { getServerEnv, type BackendProviderName, type ServerEnv } from './env';

export interface ConvexConnection {
  provider: 'convex';
  url: string;
  deployKey?: string;
}

export interface SupabaseConnection {
  provider: 'supabase';
  url: string;
  anonKey?: string;
  serviceRoleKey?: string;
}

export interface FirebaseConnection {
  provider: 'firebase';
  projectId: string;
  clientEmail?: string;
  privateKey?: string;
  storageBucket?: string;
}

export type ProviderConnection = ConvexConnection | SupabaseConnection | FirebaseConnection;

export interface BackendConfig {
  /** Provider for database operations. */
  database: ProviderConnection;
  /** Provider for authentication. */
  auth: ProviderConnection;
  /** Provider for file storage. */
  storage: ProviderConnection;
}

export function getProviderConnection(
  provider: BackendProviderName,
  env: ServerEnv
): ProviderConnection {
  switch (provider) {
    case 'convex':
      return { provider, url: env.CONVEX_URL ?? '', deployKey: env.CONVEX_DEPLOY_KEY };
    case 'supabase':
      return {
        provider,
        url: env.SUPABASE_URL ?? '',
        anonKey: env.SUPABASE_ANON_KEY,
        serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
      };
    case 'firebase':
      return {
        provider,
        projectId: env.FIREBASE_PROJECT_ID ?? '',
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        // Private keys in env vars typically have escaped newlines.
        privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        storageBucket: env.FIREBASE_STORAGE_BUCKET,
      };
    default: {
      const exhaustive: never = provider;
      throw new Error(`Unknown backend provider: ${String(exhaustive)}`);
    }
  }
}

export function getBackendConfig(env: ServerEnv = getServerEnv()): BackendConfig {
  return {
    database: getProviderConnection(env.BACKEND_PROVIDER, env),
    auth: getProviderConnection(env.AUTH_PROVIDER ?? env.BACKEND_PROVIDER, env),
    storage: getProviderConnection(env.STORAGE_PROVIDER ?? env.BACKEND_PROVIDER, env),
  };
}
