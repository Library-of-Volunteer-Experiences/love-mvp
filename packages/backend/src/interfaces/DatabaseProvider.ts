// ─────────────────────────────────────────────────────────────
// LOVE — DatabaseProvider Interface
// ─────────────────────────────────────────────────────────────
// All database operations MUST go through this interface.
// Application code should never import provider-specific
// database clients or ORMs directly.
//
// The interface uses generic CRUD operations with typed
// collection names to maintain type safety while remaining
// provider-agnostic.
// ─────────────────────────────────────────────────────────────

import type { Volunteer, Nonprofit, Event, OpportunityMatch } from '@love/shared';

/**
 * Map of collection names to their document types.
 * Extend this as new models are added.
 */
export interface CollectionMap {
  volunteers: Volunteer;
  nonprofits: Nonprofit;
  events: Event;
  matches: OpportunityMatch;
}

export type CollectionName = keyof CollectionMap;

export interface QueryFilter {
  field: string;
  operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'contains';
  value: unknown;
}

export interface QueryOptions {
  filters?: QueryFilter[];
  orderBy?: { field: string; direction: 'asc' | 'desc' };
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
  cursor?: string;
}

export interface DatabaseProvider {
  /** Get a single document by ID */
  getById<K extends CollectionName>(
    collection: K,
    id: string
  ): Promise<CollectionMap[K] | null>;

  /** Get multiple documents by IDs */
  getByIds<K extends CollectionName>(
    collection: K,
    ids: string[]
  ): Promise<CollectionMap[K][]>;

  /** Query documents with filters and pagination */
  query<K extends CollectionName>(
    collection: K,
    options?: QueryOptions
  ): Promise<PaginatedResult<CollectionMap[K]>>;

  /** Create a new document */
  create<K extends CollectionName>(
    collection: K,
    data: Omit<CollectionMap[K], 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CollectionMap[K]>;

  /** Update an existing document (partial update) */
  update<K extends CollectionName>(
    collection: K,
    id: string,
    data: Partial<Omit<CollectionMap[K], 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<CollectionMap[K]>;

  /** Delete a document by ID */
  delete(collection: CollectionName, id: string): Promise<void>;

  /** Count documents matching a query */
  count(collection: CollectionName, options?: QueryOptions): Promise<number>;

  /** Subscribe to real-time changes (returns unsubscribe function) */
  subscribe<K extends CollectionName>(
    collection: K,
    options: QueryOptions,
    callback: (data: CollectionMap[K][]) => void
  ): () => void;
}
