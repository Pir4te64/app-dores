import { useState, useEffect, useCallback, useRef } from 'react';

import { useAddress } from './useAddress';

import { Commerce } from '~/domain/entities/commerceEntity';
import { CommerceService } from '~/domain/services/commerceService';

export const useCommerces = () => {
  const [commerces, setCommerces] = useState<Commerce[]>([]);
  const [loadingCommerces, setLoadingCommerces] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const isFetching = useRef(false);
  const { address } = useAddress();

  const commerceService = CommerceService.getInstance();

  // Cache de 10 minutos para comercios (cambian menos frecuentemente)
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

  const fetchCommerces = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();

      // Si no es un refresh forzado y los datos son recientes, no recargar
      if (!forceRefresh && now - lastFetchTime < CACHE_DURATION && commerces.length > 0) {
        console.log('📦 Usando datos en caché de comercios');
        return;
      }

      // Evitar múltiples llamadas simultáneas
      if (isFetching.current) {
        console.log('⏳ Ya hay una carga de comercios en progreso');
        return;
      }

      isFetching.current = true;
      setLoadingCommerces(true);
      setError(null);

      try {
        console.log('🔄 Cargando comercios...');
        const results = await commerceService.getAllCommerces();
        setCommerces(results);
        setLastFetchTime(now);
        console.log('✅ Comercios cargados exitosamente');
      } catch (err) {
        console.error('❌ Error fetching commerces:', err);
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
  }, []); // Removido address?.id para evitar recargas innecesarias

  return {
    commerces,
    loadingCommerces,
    error,
    refetchCommerces: () => fetchCommerces(true), // Siempre forzar refresh cuando se llama explícitamente
  };
};
