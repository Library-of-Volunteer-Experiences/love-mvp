// ─────────────────────────────────────────────────────────────
// LOVE — Convex Storage Provider (Stub)
// ─────────────────────────────────────────────────────────────

import type {
  StorageProvider,
  UploadOptions,
  StorageFile,
} from '../../interfaces/StorageProvider';

const NOT_IMPLEMENTED = 'ConvexStorageProvider: Not yet implemented. Configure Convex and implement this provider.';

export class ConvexStorageProvider implements StorageProvider {
  async upload(_options: UploadOptions): Promise<StorageFile> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async getUrl(_path: string): Promise<string> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async getSignedUrl(_path: string, _expiresInSeconds: number): Promise<string> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async delete(_path: string): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async list(_prefix: string): Promise<StorageFile[]> {
    throw new Error(NOT_IMPLEMENTED);
  }
}
