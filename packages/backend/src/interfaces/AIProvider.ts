// ─────────────────────────────────────────────────────────────
// LOVE — AI Provider Interfaces (FUTURE — not implemented)
// ─────────────────────────────────────────────────────────────
// Contracts for the AI-assisted skill matching pipeline:
//
//   Volunteer.skillDescription ("I teach kids math.")
//        │
//        ▼  SkillExtractionProvider.extractSkills
//   ExtractedSkill[]  (category: "tutoring", "mathematics", "youth")
//        │
//        ▼  EmbeddingProvider.embed
//   number[][]  ──► VectorIndexProvider.upsert
//        │
//        ▼  MatchingEngine.findMatchesForVolunteer
//   OpportunityMatch[]  (matchScore + human-readable matchReason)
//
// Implementations will live in packages/backend/src/providers/<vendor>/
// and be selected by AI_PROVIDER in @love/config. Nothing in this
// file depends on a specific AI vendor.
//
// See docs/architecture/ai-matching.md for the full design.
// ─────────────────────────────────────────────────────────────

import type { Event, ExtractedSkill, MatchingConfig, OpportunityMatch } from '@love/shared';

/** Turns free-text skill descriptions into structured skills. */
export interface SkillExtractionProvider {
  /** Version tag stored with results so they can be regenerated later. */
  readonly version: string;
  extractSkills(text: string): Promise<ExtractedSkill[]>;
}

/** Converts text into dense vectors for semantic similarity. */
export interface EmbeddingProvider {
  readonly model: string;
  readonly dimensions: number;
  embed(texts: string[]): Promise<number[][]>;
}

export interface VectorRecord {
  id: string;
  vector: number[];
  /** Filterable, non-sensitive attributes (e.g. zipCode, eventId). */
  metadata: Record<string, string | number>;
}

/** Stores and searches embeddings (Convex vector index, pgvector, etc.). */
export interface VectorIndexProvider {
  upsert(
    namespace: 'volunteer-skills' | 'event-requirements',
    records: VectorRecord[]
  ): Promise<void>;
  query(
    namespace: 'volunteer-skills' | 'event-requirements',
    vector: number[],
    topK: number,
    filter?: Record<string, string | number>
  ): Promise<{ id: string; score: number }[]>;
  delete(namespace: 'volunteer-skills' | 'event-requirements', ids: string[]): Promise<void>;
}

/**
 * Domain service that combines skill similarity, distance, and
 * availability into ranked matches. Pure business logic — it consumes
 * the providers above and the DatabaseProvider, so it is vendor-neutral.
 */
export interface MatchingEngine {
  findMatchesForVolunteer(
    volunteerId: string,
    config?: Partial<MatchingConfig>
  ): Promise<Omit<OpportunityMatch, 'id' | 'createdAt' | 'updatedAt'>[]>;

  findVolunteersForEvent(
    event: Pick<Event, 'id'>,
    config?: Partial<MatchingConfig>
  ): Promise<Omit<OpportunityMatch, 'id' | 'createdAt' | 'updatedAt'>[]>;
}
