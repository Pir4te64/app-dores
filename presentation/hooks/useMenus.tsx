import { useState, useEffect, useCallback, useRef } from 'react';

import { Menu } from '~/domain/entities/menuEntity';
import { CommerceService } from '~/domain/services/commerceService';
import { MenuService } from '~/domain/services/menuService';

export const useMenus = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const isFetching = useRef(false);

  const menuService = MenuService.getInstance();
  const commerceService = CommerceService.getInstance();

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
        console.log('🔄 Cargando menús...');

        // Primero obtener todos los comercios
        const commerces = await commerceService.getAllCommerces();

        // Obtener menús de los primeros 3 comercios para la vista principal
        const limitedCommerces = commerces.slice(0, 3);
        const allMenus: Menu[] = [];

        for (const commerce of limitedCommerces) {
          try {
            const response = await menuService.getAllMenus({
              pageNumber: 0,
              pageSize: 6, // 6 productos por comercio
              commerceId: commerce.id,
              sortDirection: 'DESC',
            });

            const menuItems = response.content.map((item) => new Menu(item));
            allMenus.push(...menuItems);
          } catch (err) {
            console.warn(`Error loading menus for commerce ${commerce.id}:`, err);
          }
        }

        // Eliminar duplicados basándose en el ID del menú y commerceId
        const uniqueMenus = allMenus.filter(
          (menu, index, self) =>
            index === self.findIndex((m) => m.id === menu.id && m.commerceId === menu.commerceId)
        );

        console.log('📊 Total menus before deduplication:', allMenus.length);
        console.log('📊 Unique menus after deduplication:', uniqueMenus.length);

        // Limitar a 20 productos totales
        setMenus(uniqueMenus.slice(0, 20));
        setLastFetchTime(now);
        console.log('✅ Menús cargados exitosamente');
      } catch (err) {
        console.error('❌ Error fetching menus:', err);
        setError('No se pudieron cargar los productos');
      } finally {
        setLoadingMenus(false);
        isFetching.current = false;
      }
    },
    [lastFetchTime, menus.length, menuService, commerceService]
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
