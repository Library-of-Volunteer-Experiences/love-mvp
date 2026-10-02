// ─────────────────────────────────────────────────────────────
// LOVE — Convex Auth Provider (Stub)
// ─────────────────────────────────────────────────────────────

import type {
  AuthProvider,
  SignUpParams,
  SignInParams,
  OAuthParams,
} from '../../interfaces/AuthProvider';
import type { UserSession } from '@love/shared';

const NOT_IMPLEMENTED = 'ConvexAuthProvider: Not yet implemented. Configure Convex and implement this provider.';

export class ConvexAuthProvider implements AuthProvider {
  async signUp(_params: SignUpParams): Promise<UserSession> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async signIn(_params: SignInParams): Promise<UserSession> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async sendMagicLink(_email: string): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async verifyMagicLink(_token: string): Promise<UserSession> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async signInWithOAuth(_params: OAuthParams): Promise<{ redirectUrl: string }> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async handleOAuthCallback(_code: string, _state: string): Promise<UserSession> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async signOut(): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async getSession(): Promise<UserSession | null> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async refreshSession(): Promise<UserSession> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async resetPassword(_email: string): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async updatePassword(_newPassword: string): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async enableMFA(): Promise<{ secret: string; qrCodeUrl: string }> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async verifyMFA(_code: string): Promise<boolean> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async disableMFA(): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }
}
