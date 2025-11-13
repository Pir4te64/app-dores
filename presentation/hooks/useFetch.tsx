import { useState, useEffect, useCallback } from 'react';

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

/**
 * Generic data fetching hook with loading and error states
 */
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  initialLoad: boolean = true
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(initialLoad);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [fetchFn, ...dependencies]);

  useEffect(() => {
    if (initialLoad) {
      fetchData();
    }
  }, [fetchData, initialLoad]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

/**
 * Hook for fetching data with manual trigger
 */
export function useLazyFetch<T, P extends any[]>(
  fetchFn: (...args: P) => Promise<T>
): [(...args: P) => Promise<T | null>, { data: T | null; loading: boolean; error: Error | null }] {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn(...args);
        setData(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchFn]
  );

  return [execute, { data, loading, error }];
}
