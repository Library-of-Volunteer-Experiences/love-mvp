// ─────────────────────────────────────────────────────────────
// LOVE — Backend Package Entry Point & Provider Factory
// ─────────────────────────────────────────────────────────────
// This is the ONLY place where provider implementations are
// selected. The rest of the application calls getBackend() and
// interacts exclusively through the interfaces in ./interfaces.
//
// To switch providers, change configuration — not code:
//   BACKEND_PROVIDER=convex|supabase|firebase
//   NOTIFICATION_{EMAIL,SMS,PUSH}_PROVIDER=...
//
// SERVER-ONLY: never import this package from client components or
// the mobile app. Mobile talks to the web app's API using
// @love/api-contracts.
// ─────────────────────────────────────────────────────────────

import {
  getBackendConfig,
  getNotificationConfig,
  getServerEnv,
  type AppEnvironment,
  type BackendConfig,
  type BackendProviderName,
  type NotificationConfig,
  type ProviderConnection,
} from '@love/config';
import type { NotificationChannel } from '@love/shared';
import type { AuditLogProvider } from './interfaces/AuditLogProvider';
import type { AuthProvider } from './interfaces/AuthProvider';
import type { DatabaseProvider } from './interfaces/DatabaseProvider';
import type { NotificationProvider } from './interfaces/NotificationProvider';
import type { StorageProvider } from './interfaces/StorageProvider';
import { CompositeNotificationProvider } from './notifications/CompositeNotificationProvider';
import { ConsoleAuditLogProvider, ConsoleNotificationProvider } from './providers/console';
import { convexProviders } from './providers/convex';
import { firebaseProviders } from './providers/firebase';
import { notImplemented } from './providers/shared/notImplemented';
import { supabaseProviders } from './providers/supabase';
import type { BackendProviderModule } from './providers/types';

export type * from './interfaces';
export * from './errors';
export { CompositeNotificationProvider } from './notifications/CompositeNotificationProvider';

// ─────────────────────────────────────────────────────────────
// Provider registry
// ─────────────────────────────────────────────────────────────

const backendRegistry: { [N in BackendProviderName]: BackendProviderModule<N> } = {
  convex: convexProviders,
  supabase: supabaseProviders,
  firebase: firebaseProviders,
};

/**
 * Resolves the module for a connection. The cast is safe because the
 * registry is keyed by the same discriminant as the connection union.
 */
function moduleFor(connection: ProviderConnection) {
  return backendRegistry[connection.provider] as BackendProviderModule<BackendProviderName> & {
    createAuthProvider(c: ProviderConnection): AuthProvider;
    createDatabaseProvider(c: ProviderConnection): DatabaseProvider;
    createStorageProvider(c: ProviderConnection): StorageProvider;
  };
}

export function createAuthProvider(connection: ProviderConnection): AuthProvider {
  return moduleFor(connection).createAuthProvider(connection);
}

export function createDatabaseProvider(connection: ProviderConnection): DatabaseProvider {
  return moduleFor(connection).createDatabaseProvider(connection);
}

export function createStorageProvider(connection: ProviderConnection): StorageProvider {
  return moduleFor(connection).createStorageProvider(connection);
}

// ─────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────

export function createNotificationProvider(config: NotificationConfig): NotificationProvider {
  const consoleChannels = new Set<NotificationChannel>();
  const channels: Partial<Record<NotificationChannel, NotificationProvider>> = {};

  const assign = (channel: NotificationChannel, provider: string) => {
    if (provider === 'none') return;
    if (provider === 'console') {
      consoleChannels.add(channel);
      return;
    }
    channels[channel] = notImplemented<NotificationProvider>(`${provider}NotificationProvider`);
  };

  assign('email', config.email.provider);
  assign('sms', config.sms.provider);
  assign('push', config.push.provider);

  if (consoleChannels.size > 0) {
    const consoleProvider = new ConsoleNotificationProvider(consoleChannels);
    for (const channel of consoleChannels) channels[channel] = consoleProvider;
  }

  return new CompositeNotificationProvider(channels);
}

// ─────────────────────────────────────────────────────────────
// Audit logging
// ─────────────────────────────────────────────────────────────

export function createAuditLogProvider(appEnv: AppEnvironment): AuditLogProvider {
  if (appEnv === 'development' || appEnv === 'test') return new ConsoleAuditLogProvider();
  // Deployed environments need a durable, append-only sink.
  return notImplemented<AuditLogProvider>('DurableAuditLogProvider');
}

// ─────────────────────────────────────────────────────────────
// Composition root
// ─────────────────────────────────────────────────────────────

export interface BackendServices {
  auth: AuthProvider;
  db: DatabaseProvider;
  storage: StorageProvider;
  notifications: NotificationProvider;
  audit: AuditLogProvider;
}

export interface BackendServicesConfig {
  backend: BackendConfig;
  notifications: NotificationConfig;
  appEnv: AppEnvironment;
}

export function createBackendServices(config: BackendServicesConfig): BackendServices {
  return {
    auth: createAuthProvider(config.backend.auth),
    db: createDatabaseProvider(config.backend.database),
    storage: createStorageProvider(config.backend.storage),
    notifications: createNotificationProvider(config.notifications),
    audit: createAuditLogProvider(config.appEnv),
  };
}

let services: BackendServices | undefined;

/**
 * The application's single entry point to the backend. Built lazily
 * from validated configuration and reused for the process lifetime.
 */
export function getBackend(): BackendServices {
  if (!services) {
    const env = getServerEnv();
    services = createBackendServices({
      backend: getBackendConfig(env),
      notifications: getNotificationConfig(env),
      appEnv: env.APP_ENV,
    });
  }
  return services;
}

/** Test helper: inject fakes or reset the cached services. */
export function setBackendForTesting(override: BackendServices | undefined): void {
  services = override;
}
