// ─────────────────────────────────────────────────────────────
// LOVE — Environment Configuration
// ─────────────────────────────────────────────────────────────
// Centralized environment variable access with type safety.
// All environment variables should be accessed through this
// module — never read process.env directly in application code.
// ─────────────────────────────────────────────────────────────

export type BackendProvider = 'convex' | 'supabase' | 'firebase';
export type AuthProvider = 'convex' | 'supabase' | 'firebase';
export type NotificationProvider = 'console' | 'smtp' | 'sendgrid' | 'twilio';

export interface EnvConfig {
  // Application
  appName: string;
  appUrl: string;
  nodeEnv: 'development' | 'production' | 'test';

  // Backend
  backendProvider: BackendProvider;

  // Auth
  authProvider: AuthProvider;
  authSecret: string;

  // Convex
  convexDeployment: string;
  convexUrl: string;

  // Supabase
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;

  // Firebase
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;

  // Notifications
  notificationProvider: NotificationProvider;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;

  // AI (future)
  aiProvider: string;
  openaiApiKey: string;
}

/**
 * Safely read an environment variable with a default fallback.
 * Works in both Node.js and client environments.
 */
function getEnv(key: string, defaultValue = ''): string {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] ?? defaultValue;
  }
  return defaultValue;
}

/**
 * Get the full environment configuration.
 * Call this once at application startup and pass the result
 * through your application's dependency injection.
 */
export function getEnvConfig(): EnvConfig {
  return {
    appName: getEnv('NEXT_PUBLIC_APP_NAME', 'LOVE'),
    appUrl: getEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    nodeEnv: getEnv('NODE_ENV', 'development') as EnvConfig['nodeEnv'],

    backendProvider: getEnv('BACKEND_PROVIDER', 'convex') as BackendProvider,

    authProvider: getEnv('AUTH_PROVIDER', 'convex') as AuthProvider,
    authSecret: getEnv('AUTH_SECRET'),

    convexDeployment: getEnv('CONVEX_DEPLOYMENT'),
    convexUrl: getEnv('NEXT_PUBLIC_CONVEX_URL'),

    supabaseUrl: getEnv('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    supabaseServiceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY'),

    firebaseApiKey: getEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
    firebaseAuthDomain: getEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    firebaseProjectId: getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    firebaseStorageBucket: getEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),

    notificationProvider: getEnv('NOTIFICATION_PROVIDER', 'console') as NotificationProvider,
    smtpHost: getEnv('SMTP_HOST'),
    smtpPort: getEnv('SMTP_PORT'),
    smtpUser: getEnv('SMTP_USER'),
    smtpPass: getEnv('SMTP_PASS'),

    aiProvider: getEnv('AI_PROVIDER'),
    openaiApiKey: getEnv('OPENAI_API_KEY'),
  };
}
