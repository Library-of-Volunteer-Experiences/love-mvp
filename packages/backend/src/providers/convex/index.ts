// ─────────────────────────────────────────────────────────────
// LOVE — Convex provider (initial target; NOT YET IMPLEMENTED)
// ─────────────────────────────────────────────────────────────
// This folder is the ONLY place in the repo allowed to import the
// `convex` SDK (enforced by ESLint). See ./README.md for the
// implementation checklist.
// ─────────────────────────────────────────────────────────────

import type { AuthProvider } from '../../interfaces/AuthProvider';
import type { DatabaseProvider } from '../../interfaces/DatabaseProvider';
import type { StorageProvider } from '../../interfaces/StorageProvider';
import { notImplemented } from '../shared/notImplemented';
import type { BackendProviderModule } from '../types';

export const convexProviders: BackendProviderModule<'convex'> = {
  name: 'convex',
  createAuthProvider: () => notImplemented<AuthProvider>('ConvexAuthProvider'),
  createDatabaseProvider: () => notImplemented<DatabaseProvider>('ConvexDatabaseProvider'),
  createStorageProvider: () => notImplemented<StorageProvider>('ConvexStorageProvider'),
};
