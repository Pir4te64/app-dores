import { useState, useCallback } from 'react';

/**
 * Hook for managing loading state and error handling
 */
export const useLoading = <T extends (...args: any[]) => Promise<any>>(
  asyncFunction: T,
  onError?: (error: Error) => void
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFunction(...args);
        return result as ReturnType<T>;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        if (onError) {
          onError(error);
        }
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction, onError]
  );

  return { loading, error, execute };
};
