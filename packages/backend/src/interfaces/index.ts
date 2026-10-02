// ─────────────────────────────────────────────────────────────
// LOVE — Provider Interfaces Barrel Export
// ─────────────────────────────────────────────────────────────

export type { AuthProvider, SignUpParams, SignInParams, OAuthParams } from './AuthProvider';
export type {
  DatabaseProvider,
  CollectionMap,
  CollectionName,
  QueryFilter,
  QueryOptions,
  PaginatedResult,
} from './DatabaseProvider';
export type {
  StorageProvider,
  UploadOptions,
  StorageFile,
} from './StorageProvider';
export type {
  NotificationProvider,
  NotificationPayload,
  NotificationResult,
  EmailNotification,
  PushNotification,
  SmsNotification,
} from './NotificationProvider';
