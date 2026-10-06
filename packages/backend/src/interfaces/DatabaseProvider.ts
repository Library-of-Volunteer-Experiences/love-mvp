// ─────────────────────────────────────────────────────────────
// LOVE — DatabaseProvider Interface
// ─────────────────────────────────────────────────────────────
// All database operations MUST go through this interface.
// Application code never imports provider-specific database
// clients, ORMs, or query builders.
//
// SECURITY:
// - Queries are expressed as structured, typed filters — never as
//   strings. Implementations MUST translate them to parameterized
//   queries / SDK calls. String concatenation into queries is forbidden.
// - `field` is constrained to real model keys at compile time;
//   implementations must still reject unknown fields at runtime.
// - The provider does not authorize. Callers check permissions with
//   @love/auth BEFORE calling these methods.
// ─────────────────────────────────────────────────────────────

import type {
  Event,
  Nonprofit,
  OpportunityMatch,
  OrganizationMembership,
  Volunteer,
  VolunteerSkillProfile,
} from '@love/shared';

/**
 * Map of collection names to their document types.
 * Extend this as new models are added.
 */
export interface CollectionMap {
  volunteers: Volunteer;
  nonprofits: Nonprofit;
  memberships: OrganizationMembership;
  events: Event;
  matches: OpportunityMatch;
  /** AI-derived data; see docs/architecture/ai-matching.md */
  skillProfiles: VolunteerSkillProfile & { id: string };
}

export type CollectionName = keyof CollectionMap;

/** Fields managed by the provider, never supplied by callers. */
export type SystemFields = 'id' | 'createdAt' | 'updatedAt';

export type CreateData<K extends CollectionName> = Omit<CollectionMap[K], SystemFields>;
export type UpdateData<K extends CollectionName> = Partial<CreateData<K>>;

export type FilterOperator = '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in';

export interface QueryFilter<T> {
  field: Extract<keyof T, string>;
  operator: FilterOperator;
  value: unknown;
}

export interface QueryOptions<T> {
  filters?: QueryFilter<T>[];
  orderBy?: { field: Extract<keyof T, string>; direction: 'asc' | 'desc' };
  /** Max 100; implementations must clamp. */
  limit?: number;
  /** Opaque cursor from a previous page. */
  cursor?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  /** Pass to the next query to fetch the following page. */
  nextCursor?: string;
}

export interface DatabaseProvider {
  getById<K extends CollectionName>(collection: K, id: string): Promise<CollectionMap[K] | null>;

  getByIds<K extends CollectionName>(collection: K, ids: string[]): Promise<CollectionMap[K][]>;

  query<K extends CollectionName>(
    collection: K,
    options?: QueryOptions<CollectionMap[K]>
  ): Promise<PaginatedResult<CollectionMap[K]>>;

  create<K extends CollectionName>(collection: K, data: CreateData<K>): Promise<CollectionMap[K]>;

  update<K extends CollectionName>(
    collection: K,
    id: string,
    data: UpdateData<K>
  ): Promise<CollectionMap[K]>;

  delete(collection: CollectionName, id: string): Promise<void>;

  count<K extends CollectionName>(
    collection: K,
    options?: Pick<QueryOptions<CollectionMap[K]>, 'filters'>
  ): Promise<number>;

  /**
   * Run several operations atomically. Providers without native
   * transactions must emulate or throw ProviderCapabilityError.
   */
  transaction<T>(
    work: (tx: Omit<DatabaseProvider, 'transaction' | 'subscribe'>) => Promise<T>
  ): Promise<T>;

  /** Subscribe to real-time changes. Returns an unsubscribe function. */
  subscribe<K extends CollectionName>(
    collection: K,
    options: QueryOptions<CollectionMap[K]>,
    callback: (data: CollectionMap[K][]) => void
  ): () => void;
}
