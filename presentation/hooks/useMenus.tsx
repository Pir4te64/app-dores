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

  // Cache de 5 minutos para evitar recargas innecesarias
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  const fetchMenus = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();

      // Si no es un refresh forzado y los datos son recientes, no recargar
      if (!forceRefresh && now - lastFetchTime < CACHE_DURATION && menus.length > 0) {
        console.log('📦 Usando datos en caché de menús');
        return;
      }

      // Evitar múltiples llamadas simultáneas
      if (isFetching.current) {
        console.log('⏳ Ya hay una carga de menús en progreso');
        return;
      }

      isFetching.current = true;
      setLoadingMenus(true);
      setError(null);

      try {
        console.log('🔄 Cargando menús del comercio ID 4 y asegurando al menos 2...');

        // Acumular productos hasta tener al menos 2
        const pageSize = 10;
        let pageNumber = 0;
        let totalPages = 1;
        const aggregated: Menu[] = [];

        do {
          const response = await menuService.getAllMenus({
            commerceId: 4,
            pageNumber,
            pageSize,
            sortDirection: 'DESC',
          });
          totalPages = response.totalPages ?? 1;
          const items = response.content.map((item) => new Menu(item));
          aggregated.push(...items);
          pageNumber += 1;
        } while (aggregated.length < 2 && pageNumber < totalPages);

        // Seleccionar 2 productos aleatorios (o menos si no hay suficiente)
        const selected = aggregated.length >= 2
          ? [...aggregated].sort(() => Math.random() - 0.5).slice(0, 2)
          : aggregated;

        setMenus(selected);
        setLastFetchTime(now);
        console.log(`✅ Menús seleccionados: ${selected.length} del comercio 4`);
      } catch (err) {
        console.error('❌ Error fetching menus:', err);
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
    refetchMenus: () => fetchMenus(true), // Siempre forzar refresh cuando se llama explícitamente
  };
};
