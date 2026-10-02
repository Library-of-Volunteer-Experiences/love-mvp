// ─────────────────────────────────────────────────────────────
// LOVE — Convex Database Provider (Stub)
// ─────────────────────────────────────────────────────────────

import type {
  DatabaseProvider,
  CollectionMap,
  CollectionName,
  QueryOptions,
  PaginatedResult,
} from '../../interfaces/DatabaseProvider';

const NOT_IMPLEMENTED = 'ConvexDatabaseProvider: Not yet implemented. Configure Convex and implement this provider.';

export class ConvexDatabaseProvider implements DatabaseProvider {
  async getById<K extends CollectionName>(
    _collection: K,
    _id: string
  ): Promise<CollectionMap[K] | null> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async getByIds<K extends CollectionName>(
    _collection: K,
    _ids: string[]
  ): Promise<CollectionMap[K][]> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async query<K extends CollectionName>(
    _collection: K,
    _options?: QueryOptions
  ): Promise<PaginatedResult<CollectionMap[K]>> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async create<K extends CollectionName>(
    _collection: K,
    _data: Omit<CollectionMap[K], 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CollectionMap[K]> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async update<K extends CollectionName>(
    _collection: K,
    _id: string,
    _data: Partial<Omit<CollectionMap[K], 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<CollectionMap[K]> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async delete(_collection: CollectionName, _id: string): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async count(_collection: CollectionName, _options?: QueryOptions): Promise<number> {
    throw new Error(NOT_IMPLEMENTED);
  }

  subscribe<K extends CollectionName>(
    _collection: K,
    _options: QueryOptions,
    _callback: (data: CollectionMap[K][]) => void
  ): () => void {
    throw new Error(NOT_IMPLEMENTED);
  }
}
