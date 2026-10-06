// ─────────────────────────────────────────────────────────────
// LOVE — Supabase provider (migration target; NOT YET IMPLEMENTED)
// ─────────────────────────────────────────────────────────────
// Only this folder may import `@supabase/*` (enforced by ESLint).
// See ../convex/README.md for the implementation checklist — the same
// steps apply here.
// ─────────────────────────────────────────────────────────────

import type { AuthProvider } from '../../interfaces/AuthProvider';
import type { DatabaseProvider } from '../../interfaces/DatabaseProvider';
import type { StorageProvider } from '../../interfaces/StorageProvider';
import { notImplemented } from '../shared/notImplemented';
import type { BackendProviderModule } from '../types';

export const supabaseProviders: BackendProviderModule<'supabase'> = {
  name: 'supabase',
  createAuthProvider: () => notImplemented<AuthProvider>('SupabaseAuthProvider'),
  createDatabaseProvider: () => notImplemented<DatabaseProvider>('SupabaseDatabaseProvider'),
  createStorageProvider: () => notImplemented<StorageProvider>('SupabaseStorageProvider'),
};
