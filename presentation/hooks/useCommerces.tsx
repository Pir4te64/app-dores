import { useState, useEffect, useCallback, useRef } from 'react';

import { Commerce } from '~/domain/entities/commerceEntity';
import { CommerceSupabaseService } from '~/domain/services/supabase/commerceService';
import { mapCommerce } from '~/domain/mappers/supabaseMappers';

export const useCommerces = () => {
  const [commerces, setCommerces] = useState<Commerce[]>([]);
  const [loadingCommerces, setLoadingCommerces] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const isFetching = useRef(false);

  const commerceService = CommerceSupabaseService.getInstance();

  const CACHE_DURATION = 10 * 60 * 1000;

  const fetchCommerces = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();

      if (!forceRefresh && now - lastFetchTime < CACHE_DURATION && commerces.length > 0) {
        return;
      }

      if (isFetching.current) return;

      isFetching.current = true;
      setLoadingCommerces(true);
      setError(null);

      try {
        const commerce = await commerceService.getActiveCommerce();
        if (commerce) {
          setCommerces([mapCommerce(commerce)]);
        } else {
          setCommerces([]);
        }
        setLastFetchTime(now);
      } catch (err) {
        console.error('Error fetching commerces:', err);
        setError('No se pudieron cargar los restaurantes');
      } finally {
        setLoadingCommerces(false);
        isFetching.current = false;
      }
    },
    [lastFetchTime, commerces.length, commerceService]
  );

  useEffect(() => {
    fetchCommerces();
  }, []);

  return {
    commerces,
    loadingCommerces,
    error,
    refetchCommerces: () => fetchCommerces(true),
  };
};
