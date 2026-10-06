import { ProviderNotImplementedError } from '../../errors';

/**
 * Returns an object satisfying interface `T` whose every method throws
 * ProviderNotImplementedError. Lets a provider be selectable in config
 * (and type-checked) before its implementation exists, and fails loudly
 * the moment application code actually depends on it.
 */
export function notImplemented<T extends object>(providerName: string): T {
  return new Proxy({} as T, {
    get(_target, property) {
      // Prevent the proxy from being mistaken for a Promise/thenable.
      if (property === 'then' || typeof property === 'symbol') return undefined;
      return () => {
        throw new ProviderNotImplementedError(providerName, property);
      };
    },
  });
}
