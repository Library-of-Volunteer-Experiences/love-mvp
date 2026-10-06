// ─────────────────────────────────────────────────────────────
// LOVE — Backend error types
// ─────────────────────────────────────────────────────────────
// Provider implementations translate vendor-specific errors into
// these types so application code never inspects vendor errors.
// Messages must be safe to log (no secrets, tokens, or PII).
// ─────────────────────────────────────────────────────────────

export class BackendError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = new.target.name;
  }
}

/** A provider (or one of its methods) has not been implemented yet. */
export class ProviderNotImplementedError extends BackendError {
  constructor(provider: string, method: string) {
    super(`${provider}.${method} is not implemented yet`, 'PROVIDER_NOT_IMPLEMENTED');
  }
}

/** The configured provider cannot support the requested capability. */
export class ProviderCapabilityError extends BackendError {
  constructor(provider: string, capability: string) {
    super(`${provider} does not support ${capability}`, 'PROVIDER_CAPABILITY');
  }
}

export class NotFoundError extends BackendError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND');
  }
}

export class ConflictError extends BackendError {
  constructor(message: string) {
    super(message, 'CONFLICT');
  }
}
