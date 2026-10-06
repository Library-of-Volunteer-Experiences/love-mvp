// ─────────────────────────────────────────────────────────────
// LOVE — Firebase provider (migration target; NOT YET IMPLEMENTED)
// ─────────────────────────────────────────────────────────────
// Only this folder may import `firebase` / `firebase-admin`
// (enforced by ESLint). See ../convex/README.md for the
// implementation checklist — the same steps apply here.
// ─────────────────────────────────────────────────────────────

import type { AuthProvider } from '../../interfaces/AuthProvider';
import type { DatabaseProvider } from '../../interfaces/DatabaseProvider';
import type { StorageProvider } from '../../interfaces/StorageProvider';
import { notImplemented } from '../shared/notImplemented';
import type { BackendProviderModule } from '../types';

export const firebaseProviders: BackendProviderModule<'firebase'> = {
  name: 'firebase',
  createAuthProvider: () => notImplemented<AuthProvider>('FirebaseAuthProvider'),
  createDatabaseProvider: () => notImplemented<DatabaseProvider>('FirebaseDatabaseProvider'),
  createStorageProvider: () => notImplemented<StorageProvider>('FirebaseStorageProvider'),
};
