import { useState, useEffect, useCallback, useRef } from 'react';

import { Menu } from '~/domain/entities/menuEntity';
import { MenuService } from '~/domain/services/menuService';

export const useMenus = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const isFetching = useRef(false);

  const menuService = MenuService.getInstance();

  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchMenus = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();

      if (!forceRefresh && now - lastFetchTime < CACHE_DURATION && menus.length > 0) {
        return;
      }

      if (isFetching.current) return;

      isFetching.current = true;
      setLoadingMenus(true);
      setError(null);

      try {
        // Fetch products from Supabase (commerce ID resolved internally)
        const response = await menuService.getAllMenus({
          pageSize: 10,
          sortDirection: 'DESC',
        });

        const allMenus = response.content;

        const selected = allMenus;

        setMenus(selected);
        setLastFetchTime(now);
      } catch (err) {
        console.error('Error fetching menus:', err);
        setError('No se pudieron cargar los productos');
      } finally {
        setLoadingMenus(false);
        isFetching.current = false;
      }
    },
    [lastFetchTime, menus.length, menuService]
  );

  useEffect(() => {
    fetchMenus();
  }, []);

  return {
    menus,
    loadingMenus,
    error,
    refetchMenus: () => fetchMenus(true),
  };
};
