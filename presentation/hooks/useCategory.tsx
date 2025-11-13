import { useState, useEffect, useCallback, useRef } from 'react';

import { Category } from '~/domain/entities/categoryEntity';
import { CategoryService } from '~/domain/services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const isFetching = useRef(false);

  const categoryService = CategoryService.getInstance();

  // Cache de 15 minutos para categorías (cambian muy poco)
  const CACHE_DURATION = 15 * 60 * 1000; // 15 minutos

  const fetchCategories = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();

      // Si no es un refresh forzado y los datos son recientes, no recargar
      if (!forceRefresh && now - lastFetchTime < CACHE_DURATION && categories.length > 0) {
        console.log('📦 Usando datos en caché de categorías');
        return;
      }

      // Evitar múltiples llamadas simultáneas
      if (isFetching.current) {
        console.log('⏳ Ya hay una carga de categorías en progreso');
        return;
      }

      isFetching.current = true;
      setLoadingCategories(true);
      setError(null);

      try {
        console.log('🔄 Cargando categorías...');
        const results = await categoryService.getCategories();
        setCategories(results);
        setLastFetchTime(now);
        console.log('✅ Categorías cargadas exitosamente');
      } catch (err) {
        console.error('❌ Error fetching categories:', err);
        setError('No se pudieron cargar las categorías');
      } finally {
        setLoadingCategories(false);
        isFetching.current = false;
      }
    },
    [lastFetchTime, categories.length, categoryService]
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loadingCategories,
    error,
    refetchCategories: () => fetchCategories(true), // Siempre forzar refresh cuando se llama explícitamente
  };
};
