// ─────────────────────────────────────────────────────────────
// LOVE — StorageProvider Interface
// ─────────────────────────────────────────────────────────────
// All file storage operations MUST go through this interface
// (nonprofit logos, profile photos, documents, ...).
//
// SECURITY:
// - Callers validate MIME type and size against
//   securityConfig.allowedUploadTypes / requestSizeLimits first.
// - Paths are generated server-side (never taken from user input) to
//   prevent path traversal and object overwrites.
// - Private files are only reachable via short-lived signed URLs.
// ─────────────────────────────────────────────────────────────

export type FileVisibility = 'public' | 'private';

export interface UploadOptions {
  /** Server-generated storage key, e.g. `nonprofits/<id>/logo.png`. */
  path: string;
  /** File content. Uint8Array also covers Node's Buffer. */
  data: Blob | ArrayBuffer | Uint8Array;
  contentType: string;
  visibility: FileVisibility;
  metadata?: Record<string, string>;
}

export interface StorageFile {
  path: string;
  /** Present only for public files. */
  publicUrl?: string;
  size: number;
  contentType: string;
  visibility: FileVisibility;
  /** ISO 8601 */
  createdAt: string;
}

export interface StorageProvider {
  upload(options: UploadOptions): Promise<StorageFile>;

  /** Public URL for a public file. Throws for private files. */
  getPublicUrl(path: string): Promise<string>;

  /** Time-limited URL. Keep `expiresInSeconds` short (<= 3600). */
  getSignedUrl(path: string, expiresInSeconds: number): Promise<string>;

  delete(path: string): Promise<void>;

  list(prefix: string): Promise<StorageFile[]>;
}
