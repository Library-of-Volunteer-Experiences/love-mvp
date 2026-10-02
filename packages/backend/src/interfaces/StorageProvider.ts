// ─────────────────────────────────────────────────────────────
// LOVE — StorageProvider Interface
// ─────────────────────────────────────────────────────────────
// All file storage operations MUST go through this interface.
// Supports uploading, downloading, and managing files
// (logos, profile photos, documents, etc.)
// ─────────────────────────────────────────────────────────────

export interface UploadOptions {
  /** Target path/key in storage */
  path: string;
  /** File content */
  data: Blob | Buffer | ArrayBuffer;
  /** MIME type */
  contentType: string;
  /** Optional metadata */
  metadata?: Record<string, string>;
}

export interface StorageFile {
  /** Storage path/key */
  path: string;
  /** Public URL */
  url: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  contentType: string;
  /** Upload timestamp */
  createdAt: string;
}

export interface StorageProvider {
  /** Upload a file */
  upload(options: UploadOptions): Promise<StorageFile>;

  /** Get a public URL for a file */
  getUrl(path: string): Promise<string>;

  /** Get a signed/temporary URL for a file */
  getSignedUrl(path: string, expiresInSeconds: number): Promise<string>;

  /** Delete a file */
  delete(path: string): Promise<void>;

  /** List files in a directory/prefix */
  list(prefix: string): Promise<StorageFile[]>;
}
