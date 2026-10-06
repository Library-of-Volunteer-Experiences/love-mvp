// ─────────────────────────────────────────────────────────────
// LOVE — Environment Configuration
// ─────────────────────────────────────────────────────────────
// Centralized, Zod-validated environment variable access.
//
// RULES (enforced by ESLint `no-restricted-properties`):
// - Application code NEVER reads process.env directly. It calls
//   getServerEnv() / getPublicEnv() from this package.
// - Secrets live only in server env. Anything prefixed NEXT_PUBLIC_
//   or EXPO_PUBLIC_ is shipped to browsers/devices — never put a
//   secret behind those prefixes.
// - Error messages list invalid variable NAMES only, never values.
// ─────────────────────────────────────────────────────────────

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Provider registries (single source of truth for valid names)
// ─────────────────────────────────────────────────────────────

export const BACKEND_PROVIDERS = ['convex', 'supabase', 'firebase'] as const;
export type BackendProviderName = (typeof BACKEND_PROVIDERS)[number];

export const EMAIL_PROVIDERS = ['none', 'console', 'smtp', 'sendgrid'] as const;
export type EmailProviderName = (typeof EMAIL_PROVIDERS)[number];

export const SMS_PROVIDERS = ['none', 'console', 'twilio'] as const;
export type SmsProviderName = (typeof SMS_PROVIDERS)[number];

export const PUSH_PROVIDERS = ['none', 'console', 'expo'] as const;
export type PushProviderName = (typeof PUSH_PROVIDERS)[number];

export const AI_PROVIDERS = ['none', 'openai', 'anthropic', 'azure-openai'] as const;
export type AiProviderName = (typeof AI_PROVIDERS)[number];

export const APP_ENVIRONMENTS = ['development', 'test', 'staging', 'production'] as const;
export type AppEnvironment = (typeof APP_ENVIRONMENTS)[number];

// ─────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────

const optionalString = z.string().trim().optional();
const booleanFlag = z
  .enum(['true', 'false'])
  .optional()
  .transform((v) => v === 'true');

/** Variables that are safe to expose to the browser / mobile bundle. */
const publicEnvSchema = z.object({
  APP_NAME: z.string().default('LOVE'),
  APP_URL: z.url().default('http://localhost:3000'),
});

const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    /** Deployment tier. Distinct from NODE_ENV, which Next sets to production for every build. */
    APP_ENV: z.enum(APP_ENVIRONMENTS).default('development'),

    // ── Backend selection: ONE value switches db + auth + storage ──
    BACKEND_PROVIDER: z.enum(BACKEND_PROVIDERS).default('convex'),
    /** Optional overrides when auth or storage must live elsewhere. */
    AUTH_PROVIDER: z.enum(BACKEND_PROVIDERS).optional(),
    STORAGE_PROVIDER: z.enum(BACKEND_PROVIDERS).optional(),

    // ── Auth ──
    /** Used to sign/encrypt session material. >= 32 chars in production. */
    AUTH_SECRET: optionalString,

    // ── Convex ──
    CONVEX_URL: optionalString,
    CONVEX_DEPLOY_KEY: optionalString,

    // ── Supabase ──
    SUPABASE_URL: optionalString,
    SUPABASE_ANON_KEY: optionalString,
    SUPABASE_SERVICE_ROLE_KEY: optionalString,

    // ── Firebase ──
    FIREBASE_PROJECT_ID: optionalString,
    FIREBASE_CLIENT_EMAIL: optionalString,
    FIREBASE_PRIVATE_KEY: optionalString,
    FIREBASE_STORAGE_BUCKET: optionalString,

    // ── Notifications (one provider per channel) ──
    NOTIFICATION_EMAIL_PROVIDER: z.enum(EMAIL_PROVIDERS).optional(),
    NOTIFICATION_SMS_PROVIDER: z.enum(SMS_PROVIDERS).optional(),
    NOTIFICATION_PUSH_PROVIDER: z.enum(PUSH_PROVIDERS).optional(),
    EMAIL_FROM: optionalString,
    SMTP_HOST: optionalString,
    SMTP_PORT: z.coerce.number().int().positive().default(587),
    SMTP_USER: optionalString,
    SMTP_PASS: optionalString,
    SENDGRID_API_KEY: optionalString,
    TWILIO_ACCOUNT_SID: optionalString,
    TWILIO_AUTH_TOKEN: optionalString,
    TWILIO_FROM_NUMBER: optionalString,
    EXPO_PUSH_ACCESS_TOKEN: optionalString,

    // ── AI matching (future) ──
    AI_PROVIDER: z.enum(AI_PROVIDERS).default('none'),
    AI_API_KEY: optionalString,
    AI_EXTRACTION_MODEL: optionalString,
    AI_EMBEDDING_MODEL: optionalString,

    // ── Feature flags ──
    FEATURE_AI_MATCHING: booleanFlag,
    FEATURE_SMS_NOTIFICATIONS: booleanFlag,
    FEATURE_PUSH_NOTIFICATIONS: booleanFlag,
    FEATURE_MAGIC_LINK: booleanFlag,
    FEATURE_OAUTH: booleanFlag,
    FEATURE_MFA: booleanFlag,
    FEATURE_MOBILE_API: booleanFlag,
  })
  .superRefine((env, ctx) => {
    // Deployed environments must be fully configured; local dev may run without credentials.
    if (env.APP_ENV !== 'production' && env.APP_ENV !== 'staging') return;

    const require = (key: keyof typeof env, reason: string) => {
      if (!env[key]) ctx.addIssue({ code: 'custom', path: [key], message: `required: ${reason}` });
    };

    if (!env.AUTH_SECRET || env.AUTH_SECRET.length < 32) {
      ctx.addIssue({ code: 'custom', path: ['AUTH_SECRET'], message: 'must be >= 32 characters' });
    }

    const usedBackends = new Set([
      env.BACKEND_PROVIDER,
      env.AUTH_PROVIDER ?? env.BACKEND_PROVIDER,
      env.STORAGE_PROVIDER ?? env.BACKEND_PROVIDER,
    ]);
    if (usedBackends.has('convex')) require('CONVEX_URL', 'convex provider');
    if (usedBackends.has('supabase')) {
      require('SUPABASE_URL', 'supabase provider');
      require('SUPABASE_SERVICE_ROLE_KEY', 'supabase provider');
    }
    if (usedBackends.has('firebase')) {
      require('FIREBASE_PROJECT_ID', 'firebase provider');
      require('FIREBASE_CLIENT_EMAIL', 'firebase provider');
      require('FIREBASE_PRIVATE_KEY', 'firebase provider');
    }

    for (const key of [
      'NOTIFICATION_EMAIL_PROVIDER',
      'NOTIFICATION_SMS_PROVIDER',
      'NOTIFICATION_PUSH_PROVIDER',
    ] as const) {
      if (env[key] === 'console') {
        ctx.addIssue({
          code: 'custom',
          path: [key],
          message: 'console provider is development-only',
        });
      }
    }
    if (env.AI_PROVIDER !== 'none') require('AI_API_KEY', 'AI provider is enabled');
  });

export type ServerEnv = z.output<typeof serverEnvSchema>;
export type PublicEnv = z.output<typeof publicEnvSchema>;

// ─────────────────────────────────────────────────────────────
// Accessors
// ─────────────────────────────────────────────────────────────

export class EnvValidationError extends Error {
  constructor(public readonly invalidKeys: string[]) {
    // Only variable names + rule messages — never values.
    super(`Invalid environment configuration: ${invalidKeys.join('; ')}`);
    this.name = 'EnvValidationError';
  }
}

/** `.env` files commonly contain `KEY=""`; treat blank values as unset so defaults apply. */
function dropBlankValues(source: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(source).filter(([, value]) => value !== undefined && value !== '')
  );
}

function parseOrThrow<S extends z.ZodType>(schema: S, source: Record<string, unknown>) {
  const result = schema.safeParse(dropBlankValues(source));
  if (!result.success) {
    throw new EnvValidationError(
      result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    );
  }
  return result.data as z.output<S>;
}

function readProcessEnv(): Record<string, string | undefined> {
  return typeof process !== 'undefined' && process.env ? process.env : {};
}

let cachedServerEnv: ServerEnv | undefined;

/**
 * Server-side environment (includes secrets). Validated once and cached.
 * Never call from client components or the mobile app.
 */
export function getServerEnv(): ServerEnv {
  cachedServerEnv ??= parseOrThrow(serverEnvSchema, readProcessEnv());
  return cachedServerEnv;
}

/**
 * Browser/device-safe environment. Contains NO secrets.
 *
 * Public variables are read with literal `process.env.NEXT_PUBLIC_*`
 * member access so that Next.js can inline them at build time.
 * The mobile app uses EXPO_PUBLIC_* equivalents.
 */
export function getPublicEnv(): PublicEnv {
  return parseOrThrow(publicEnvSchema, {
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? process.env.EXPO_PUBLIC_APP_NAME,
    APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? process.env.EXPO_PUBLIC_APP_URL,
  });
}

/** Test helper: validate an arbitrary env object without touching process.env. */
export function parseServerEnv(source: Record<string, unknown>): ServerEnv {
  return parseOrThrow(serverEnvSchema, source);
}

/** Test helper: clears the memoized server env. */
export function resetEnvCache(): void {
  cachedServerEnv = undefined;
}
