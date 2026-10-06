// ─────────────────────────────────────────────────────────────
// LOVE — Auth Configuration
// ─────────────────────────────────────────────────────────────
// Security-relevant auth settings in one reviewed place.
// Changes to this file require security review (see SECURITY.md).
// ─────────────────────────────────────────────────────────────

import type { UserRole } from '@love/shared';
import { getServerEnv, type ServerEnv } from './env';
import { getFeatureFlags } from './featureFlags';

export type AuthMethod = 'email-password' | 'magic-link' | 'oauth' | 'mfa-totp';
export type OAuthProviderName = 'google' | 'apple' | 'microsoft';

export interface SessionCookieConfig {
  name: string;
  httpOnly: true;
  secure: boolean;
  sameSite: 'lax' | 'strict';
  path: string;
}

export interface AuthConfig {
  /** Enabled sign-in methods (derived from feature flags). */
  methods: AuthMethod[];
  oauthProviders: OAuthProviderName[];
  session: {
    /** Sign out after this many seconds without activity. */
    idleTimeoutSeconds: number;
    /** Sign out after this many seconds regardless of activity. */
    absoluteTimeoutSeconds: number;
    cookie: SessionCookieConfig;
  };
  mfa: {
    enabled: boolean;
    /** Roles that MUST complete MFA before accessing protected resources. */
    requiredForRoles: UserRole[];
  };
  lockout: {
    maxFailedAttempts: number;
    lockoutSeconds: number;
  };
  /** Magic links / password reset tokens expire quickly and are single-use. */
  tokenTtlSeconds: {
    magicLink: number;
    passwordReset: number;
    emailVerification: number;
  };
}

export function getAuthConfig(env: ServerEnv = getServerEnv()): AuthConfig {
  const flags = getFeatureFlags(env);
  const isDeployed = env.APP_ENV === 'production' || env.APP_ENV === 'staging';

  const methods: AuthMethod[] = ['email-password'];
  if (flags.magicLink) methods.push('magic-link');
  if (flags.oauth) methods.push('oauth');
  if (flags.mfa) methods.push('mfa-totp');

  return {
    methods,
    oauthProviders: flags.oauth ? ['google', 'apple', 'microsoft'] : [],
    session: {
      // Older users may read slowly; 30 min idle balances security and usability.
      idleTimeoutSeconds: 30 * 60,
      absoluteTimeoutSeconds: 12 * 60 * 60,
      cookie: {
        // __Host- prefix forces Secure + Path=/ + no Domain (no subdomain leakage).
        name: isDeployed ? '__Host-love.session' : 'love.session',
        httpOnly: true,
        secure: isDeployed,
        sameSite: 'lax',
        path: '/',
      },
    },
    mfa: {
      enabled: flags.mfa,
      requiredForRoles: ['admin', 'superadmin'],
    },
    lockout: {
      maxFailedAttempts: 5,
      lockoutSeconds: 15 * 60,
    },
    tokenTtlSeconds: {
      magicLink: 15 * 60,
      passwordReset: 30 * 60,
      emailVerification: 24 * 60 * 60,
    },
  };
}
