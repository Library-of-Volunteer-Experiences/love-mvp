// ─────────────────────────────────────────────────────────────
// LOVE — Backend Package Entry Point & Provider Factory
// ─────────────────────────────────────────────────────────────
// This is the ONLY place where provider-specific code is
// selected. The rest of the application imports from this
// module and interacts exclusively through interfaces.
//
// To switch providers, change environment variables:
//   BACKEND_PROVIDER=convex|supabase|firebase
//   AUTH_PROVIDER=convex|supabase|firebase
//   NOTIFICATION_PROVIDER=console|smtp|sendgrid|twilio
// ─────────────────────────────────────────────────────────────

import type { BackendProvider, NotificationProvider as NotifProviderType } from '@love/config';
import type { AuthProvider } from './interfaces/AuthProvider';
import type { DatabaseProvider } from './interfaces/DatabaseProvider';
import type { StorageProvider } from './interfaces/StorageProvider';
import type { NotificationProvider } from './interfaces/NotificationProvider';

// Re-export all interfaces for consumers
export * from './interfaces';

// ─────────────────────────────────────────────────────────────
// Provider Factories
// ─────────────────────────────────────────────────────────────

/**
 * Create an AuthProvider instance based on the configured provider.
 */
export function createAuthProvider(provider: BackendProvider): AuthProvider {
  switch (provider) {
    case 'convex': {
      const { ConvexAuthProvider } = require('./providers/convex');
      return new ConvexAuthProvider();
    }
    case 'supabase':
      throw new Error('Supabase auth provider not yet implemented');
    case 'firebase':
      throw new Error('Firebase auth provider not yet implemented');
    default: {
      const _exhaustive: never = provider;
      throw new Error(`Unknown auth provider: ${_exhaustive}`);
    }
  }
}

/**
 * Create a DatabaseProvider instance based on the configured provider.
 */
export function createDatabaseProvider(provider: BackendProvider): DatabaseProvider {
  switch (provider) {
    case 'convex': {
      const { ConvexDatabaseProvider } = require('./providers/convex');
      return new ConvexDatabaseProvider();
    }
    case 'supabase':
      throw new Error('Supabase database provider not yet implemented');
    case 'firebase':
      throw new Error('Firebase database provider not yet implemented');
    default: {
      const _exhaustive: never = provider;
      throw new Error(`Unknown database provider: ${_exhaustive}`);
    }
  }
}

/**
 * Create a StorageProvider instance based on the configured provider.
 */
export function createStorageProvider(provider: BackendProvider): StorageProvider {
  switch (provider) {
    case 'convex': {
      const { ConvexStorageProvider } = require('./providers/convex');
      return new ConvexStorageProvider();
    }
    case 'supabase':
      throw new Error('Supabase storage provider not yet implemented');
    case 'firebase':
      throw new Error('Firebase storage provider not yet implemented');
    default: {
      const _exhaustive: never = provider;
      throw new Error(`Unknown storage provider: ${_exhaustive}`);
    }
  }
}

/**
 * Create a NotificationProvider instance based on the configured provider.
 */
export function createNotificationProvider(
  provider: NotifProviderType
): NotificationProvider {
  switch (provider) {
    case 'console': {
      const { ConsoleNotificationProvider } = require('./providers/console');
      return new ConsoleNotificationProvider();
    }
    case 'smtp':
      throw new Error('SMTP notification provider not yet implemented');
    case 'sendgrid':
      throw new Error('SendGrid notification provider not yet implemented');
    case 'twilio':
      throw new Error('Twilio notification provider not yet implemented');
    default: {
      const _exhaustive: never = provider;
      throw new Error(`Unknown notification provider: ${_exhaustive}`);
    }
  }
}

// ─────────────────────────────────────────────────────────────
// Convenience: Create all providers at once
// ─────────────────────────────────────────────────────────────

export interface BackendServices {
  auth: AuthProvider;
  db: DatabaseProvider;
  storage: StorageProvider;
  notifications: NotificationProvider;
}

export function createBackendServices(config: {
  backendProvider: BackendProvider;
  notificationProvider: NotifProviderType;
}): BackendServices {
  return {
    auth: createAuthProvider(config.backendProvider),
    db: createDatabaseProvider(config.backendProvider),
    storage: createStorageProvider(config.backendProvider),
    notifications: createNotificationProvider(config.notificationProvider),
  };
}
