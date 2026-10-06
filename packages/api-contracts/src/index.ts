// ─────────────────────────────────────────────────────────────
// LOVE — API Contracts
// ─────────────────────────────────────────────────────────────
// The wire format between clients (web browser, mobile app) and
// the web app's server (route handlers / server actions).
//
// - Request types are inferred from @love/validation schemas, so the
//   type a client sends and the schema the server validates with can
//   never drift apart.
// - Response types are built from @love/shared models.
// - Nothing here depends on a backend provider: swapping Convex for
//   Supabase does not change the API the mobile app talks to.
// ─────────────────────────────────────────────────────────────

import type {
  Event,
  Nonprofit,
  OpportunityMatch,
  UserRole,
  UserSession,
  Volunteer,
} from '@love/shared';
import type {
  CreateEventInput,
  CreateNonprofitInput,
  CreateVolunteerInput,
  MagicLinkRequestInput,
  MfaCodeInput,
  PaginationInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
  UpdateEventInput,
  UpdateNonprofitInput,
  UpdateVolunteerInput,
} from '@love/validation';

/** Bump on breaking changes; mobile clients send it as `X-API-Version`. */
export const API_VERSION = '1' as const;

// ─────────────────────────────────────────────────────────────
// Envelope
// ─────────────────────────────────────────────────────────────

export type ApiErrorCode =
  | 'VALIDATION_FAILED'
  | 'UNAUTHENTICATED'
  | 'MFA_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'PAYLOAD_TOO_LARGE'
  | 'INTERNAL_ERROR';

export interface ApiError {
  code: ApiErrorCode;
  /** Human-readable, safe to display. Never contains stack traces or internals. */
  message: string;
  /** Field-level validation messages, keyed by field path. */
  fieldErrors?: Record<string, string[]>;
  /** Correlation ID to quote when contacting support. */
  requestId?: string;
}

export type ApiResponse<T> = { success: true; data: T } | { success: false; error: ApiError };

export interface Paginated<T> {
  items: T[];
  hasMore: boolean;
  nextCursor?: string;
}

export type PaginatedResponse<T> = ApiResponse<Paginated<T>>;

export type PaginationQuery = PaginationInput & { cursor?: string };

// ─────────────────────────────────────────────────────────────
// Public session shape (never includes tokens — those live in
// HttpOnly cookies on web or SecureStore on mobile)
// ─────────────────────────────────────────────────────────────

export type PublicSession = Pick<UserSession, 'userId' | 'role' | 'memberships' | 'expiresAt'> & {
  roleLabel: string;
};

// ─────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────

export type SignUpRequest = SignUpInput;
export type SignInRequest = SignInInput;
export type MagicLinkRequest = MagicLinkRequestInput;
export type ResetPasswordRequest = ResetPasswordInput;
export type MfaVerifyRequest = MfaCodeInput & { challengeId: string };

export type SignInResponse = ApiResponse<
  | { status: 'authenticated'; session: PublicSession }
  | { status: 'mfa_required'; challengeId: string }
>;
export type SessionResponse = ApiResponse<PublicSession | null>;

// ─────────────────────────────────────────────────────────────
// Volunteers
// ─────────────────────────────────────────────────────────────

export type CreateVolunteerRequest = CreateVolunteerInput;
export type UpdateVolunteerRequest = UpdateVolunteerInput;
export type VolunteerResponse = ApiResponse<Volunteer>;
export type ListVolunteersResponse = PaginatedResponse<Volunteer>;

// ─────────────────────────────────────────────────────────────
// Nonprofits
// ─────────────────────────────────────────────────────────────

export type CreateNonprofitRequest = CreateNonprofitInput;
export type UpdateNonprofitRequest = UpdateNonprofitInput;
export type NonprofitResponse = ApiResponse<Nonprofit>;
export type ListNonprofitsResponse = PaginatedResponse<Nonprofit>;

// ─────────────────────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────────────────────

export type CreateEventRequest = CreateEventInput;
export type UpdateEventRequest = UpdateEventInput;
export type EventResponse = ApiResponse<Event>;
export type ListEventsResponse = PaginatedResponse<Event>;

// ─────────────────────────────────────────────────────────────
// Matches
// ─────────────────────────────────────────────────────────────

export type MatchResponse = ApiResponse<OpportunityMatch>;
export type ListMatchesResponse = PaginatedResponse<OpportunityMatch>;
export type RespondToMatchRequest = { decision: 'accepted' | 'declined' };

// ─────────────────────────────────────────────────────────────
// Health (no internals exposed)
// ─────────────────────────────────────────────────────────────

export interface HealthCheckResponse {
  status: 'ok' | 'degraded';
  version: string;
  timestamp: string;
}

export type { UserRole };
