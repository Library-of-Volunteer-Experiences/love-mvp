// ─────────────────────────────────────────────────────────────
// LOVE — API Contracts
// ─────────────────────────────────────────────────────────────
// Shared API request/response type definitions.
// Both the web and mobile apps import from this package
// to ensure type-safe API communication.
//
// When the mobile app is developed, it will use these same
// contracts to communicate with the backend, ensuring
// consistency across platforms.
// ─────────────────────────────────────────────────────────────

import type {
  Volunteer,
  Nonprofit,
  Event,
  OpportunityMatch,
  UserSession,
} from '@love/shared';

// ─────────────────────────────────────────────────────────────
// Generic API Response Wrapper
// ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

// ─────────────────────────────────────────────────────────────
// Auth API Contracts
// ─────────────────────────────────────────────────────────────

export type SignUpResponse = ApiResponse<UserSession>;
export type SignInResponse = ApiResponse<UserSession>;
export type SessionResponse = ApiResponse<UserSession | null>;

// ─────────────────────────────────────────────────────────────
// Volunteer API Contracts
// ─────────────────────────────────────────────────────────────

export type GetVolunteerResponse = ApiResponse<Volunteer>;
export type ListVolunteersResponse = PaginatedResponse<Volunteer>;
export type CreateVolunteerResponse = ApiResponse<Volunteer>;
export type UpdateVolunteerResponse = ApiResponse<Volunteer>;

// ─────────────────────────────────────────────────────────────
// Nonprofit API Contracts
// ─────────────────────────────────────────────────────────────

export type GetNonprofitResponse = ApiResponse<Nonprofit>;
export type ListNonprofitsResponse = PaginatedResponse<Nonprofit>;
export type CreateNonprofitResponse = ApiResponse<Nonprofit>;
export type UpdateNonprofitResponse = ApiResponse<Nonprofit>;

// ─────────────────────────────────────────────────────────────
// Event API Contracts
// ─────────────────────────────────────────────────────────────

export type GetEventResponse = ApiResponse<Event>;
export type ListEventsResponse = PaginatedResponse<Event>;
export type CreateEventResponse = ApiResponse<Event>;
export type UpdateEventResponse = ApiResponse<Event>;

// ─────────────────────────────────────────────────────────────
// Match API Contracts
// ─────────────────────────────────────────────────────────────

export type GetMatchResponse = ApiResponse<OpportunityMatch>;
export type ListMatchesResponse = PaginatedResponse<OpportunityMatch>;

// ─────────────────────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────────────────────

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  version: string;
  timestamp: string;
  services: {
    database: 'connected' | 'disconnected';
    auth: 'connected' | 'disconnected';
    storage: 'connected' | 'disconnected';
    notifications: 'connected' | 'disconnected';
  };
}
