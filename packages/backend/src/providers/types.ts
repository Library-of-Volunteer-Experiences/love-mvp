import type { BackendProviderName, ProviderConnection } from '@love/config';
import type { AuthProvider } from '../interfaces/AuthProvider';
import type { DatabaseProvider } from '../interfaces/DatabaseProvider';
import type { StorageProvider } from '../interfaces/StorageProvider';

export type ConnectionFor<N extends BackendProviderName> = Extract<
  ProviderConnection,
  { provider: N }
>;

/**
 * Contract every backend vendor folder (providers/<name>/index.ts)
 * exports. Registering a new vendor = implementing this + adding it to
 * the registry in ../index.ts + adding its name to BACKEND_PROVIDERS.
 */
export interface BackendProviderModule<N extends BackendProviderName> {
  readonly name: N;
  createAuthProvider(connection: ConnectionFor<N>): AuthProvider;
  createDatabaseProvider(connection: ConnectionFor<N>): DatabaseProvider;
  createStorageProvider(connection: ConnectionFor<N>): StorageProvider;
}
