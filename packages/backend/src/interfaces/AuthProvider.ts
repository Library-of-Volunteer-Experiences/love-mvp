// ─────────────────────────────────────────────────────────────
// LOVE — AuthProvider Interface
// ─────────────────────────────────────────────────────────────
// All authentication logic in the application MUST go through
// this interface. No application code may reference
// provider-specific authentication APIs directly.
//
// Design notes:
// - Stateless: every call that acts on a session receives the opaque
//   session token explicitly. Cookie handling (HttpOnly, Secure,
//   SameSite) is done by the app layer using @love/config auth settings,
//   so providers never touch HTTP primitives.
// - Authorization (who may do what) is NOT the provider's job — see
//   @love/auth. Providers only answer "who is this?".
// - Methods that return a session may instead require an MFA step.
//
// To add a provider: see docs/architecture/provider-replacement.md
// ─────────────────────────────────────────────────────────────

import type { UserRole, UserSession } from '@love/shared';

export type OAuthProviderId = 'google' | 'apple' | 'microsoft';

export interface SessionTokens {
  /** Opaque token stored in an HttpOnly cookie (web) or secure storage (mobile). */
  sessionToken: string;
  /** ISO 8601 */
  expiresAt: string;
}

export interface AuthenticatedResult {
  status: 'authenticated';
  session: UserSession;
  tokens: SessionTokens;
}

export interface MfaRequiredResult {
  status: 'mfa_required';
  /** Short-lived identifier for the pending MFA challenge. */
  challengeId: string;
}

export type SignInResult = AuthenticatedResult | MfaRequiredResult;

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  /** Only 'volunteer' | 'nonprofit' may be self-assigned; enforced by validation. */
  role: Extract<UserRole, 'volunteer' | 'nonprofit'>;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface OAuthStartParams {
  provider: OAuthProviderId;
  redirectUrl: string;
  /** CSRF protection: random value the app stores and later compares. */
  state: string;
  /** PKCE code verifier (the provider derives the challenge). */
  codeVerifier: string;
}

export interface OAuthCallbackParams {
  provider: OAuthProviderId;
  code: string;
  state: string;
  codeVerifier: string;
}

export interface TotpEnrollment {
  /** otpauth:// URI for QR rendering. Never log this. */
  otpauthUrl: string;
  /** Base32 secret for manual entry. Never log this. */
  secret: string;
}

export interface AuthProvider {
  // ── Email / password ──
  signUp(params: SignUpParams): Promise<SignInResult>;
  signIn(params: SignInParams): Promise<SignInResult>;

  // ── Magic links (passwordless) ──
  sendMagicLink(email: string, redirectUrl: string): Promise<void>;
  verifyMagicLink(token: string): Promise<SignInResult>;

  // ── OAuth (authorization code + PKCE) ──
  getOAuthAuthorizationUrl(params: OAuthStartParams): Promise<{ url: string }>;
  handleOAuthCallback(params: OAuthCallbackParams): Promise<SignInResult>;

  // ── MFA (TOTP) ──
  startTotpEnrollment(sessionToken: string): Promise<TotpEnrollment>;
  /** Returns one-time recovery codes; show once, never store in plaintext. */
  confirmTotpEnrollment(sessionToken: string, code: string): Promise<{ recoveryCodes: string[] }>;
  verifyMfaChallenge(challengeId: string, code: string): Promise<AuthenticatedResult>;
  disableTotp(sessionToken: string, code: string): Promise<void>;

  // ── Sessions ──
  /** Returns null for missing, expired, or revoked sessions. Never throws for bad tokens. */
  verifySession(sessionToken: string): Promise<UserSession | null>;
  refreshSession(sessionToken: string): Promise<AuthenticatedResult>;
  signOut(sessionToken: string): Promise<void>;
  revokeAllSessions(userId: string): Promise<void>;

  // ── Password management ──
  /** Must not reveal whether the email exists (prevents account enumeration). */
  requestPasswordReset(email: string): Promise<void>;
  completePasswordReset(token: string, newPassword: string): Promise<void>;
  changePassword(sessionToken: string, currentPassword: string, newPassword: string): Promise<void>;

  // ── Administration (callers MUST authorize via @love/auth first) ──
  setUserRole(userId: string, role: UserRole): Promise<void>;
}
