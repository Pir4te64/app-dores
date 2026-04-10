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

  const CACHE_DURATION = 15 * 60 * 1000;

  const fetchCategories = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();

      if (!forceRefresh && now - lastFetchTime < CACHE_DURATION && categories.length > 0) {
        return;
      }

      if (isFetching.current) return;

      isFetching.current = true;
      setLoadingCategories(true);
      setError(null);

      try {
        const results = await categoryService.getCategories();
        setCategories(results);
        setLastFetchTime(now);
      } catch (err) {
        console.error('Error fetching categories:', err);
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
    refetchCategories: () => fetchCategories(true),
  };
};
