// ─────────────────────────────────────────────────────────────
// LOVE — AuthProvider Interface
// ─────────────────────────────────────────────────────────────
// All authentication logic in the application MUST go through
// this interface. No application code should ever reference
// provider-specific authentication APIs directly.
//
// To add a new auth provider:
// 1. Create a new file in providers/<name>/AuthProvider.ts
// 2. Implement the AuthProvider interface
// 3. Register it in the provider factory (../index.ts)
// 4. Set AUTH_PROVIDER=<name> in your environment
// ─────────────────────────────────────────────────────────────

import type { UserRole, UserSession } from '@love/shared';

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface OAuthParams {
  provider: 'google' | 'github' | 'apple';
  redirectUrl: string;
}

export interface AuthProvider {
  /** Sign up a new user with email/password */
  signUp(params: SignUpParams): Promise<UserSession>;

  /** Sign in with email/password */
  signIn(params: SignInParams): Promise<UserSession>;

  /** Sign in with a magic link (passwordless) */
  sendMagicLink(email: string): Promise<void>;

  /** Verify a magic link token */
  verifyMagicLink(token: string): Promise<UserSession>;

  /** Initiate OAuth flow */
  signInWithOAuth(params: OAuthParams): Promise<{ redirectUrl: string }>;

  /** Handle OAuth callback */
  handleOAuthCallback(code: string, state: string): Promise<UserSession>;

  /** Sign out the current user */
  signOut(): Promise<void>;

  /** Get the current session (returns null if not authenticated) */
  getSession(): Promise<UserSession | null>;

  /** Refresh the current session */
  refreshSession(): Promise<UserSession>;

  /** Reset password via email */
  resetPassword(email: string): Promise<void>;

  /** Update password */
  updatePassword(newPassword: string): Promise<void>;

  /** Enable MFA for the current user */
  enableMFA(): Promise<{ secret: string; qrCodeUrl: string }>;

  /** Verify MFA code */
  verifyMFA(code: string): Promise<boolean>;

  /** Disable MFA */
  disableMFA(): Promise<void>;
}
