import { useState, useEffect } from 'react';

import { useAddress } from './useAddress';

import { Commerce } from '~/domain/entities/commerceEntity';
import { Menu } from '~/domain/entities/menuEntity';
import { CommerceService } from '~/domain/services/commerceService';
import { MenuService } from '~/domain/services/menuService';

export const useCommerceDetail = (commerceId: number) => {
  const [commerce, setCommerce] = useState<Commerce | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { address } = useAddress();
  const commerceService = CommerceService.getInstance();
  const menuService = MenuService.getInstance();

  const loadCommerce = async () => {
    if (!commerceId) return null;

    try {
      if (!address) {
        const data = await commerceService.getCommerceById(commerceId, undefined);
        return data;
      }

      const data = await commerceService.getCommerceById(commerceId, address?.id);
      if (!data) throw Error('No se encontro el comercio');
      return data;
    } catch (e) {
      await commerceService.getCommerceById(commerceId);
      throw e;
    }
  };

  const loadMenus = async (pageNumber: number) => {
    if (!commerceId) return null;

    try {
      const response = await menuService.getAllMenus({
        commerceId,
        pageNumber,
        pageSize: 10,
      });

      const menuItems = response.content.map((item) => new Menu(item));

      if (pageNumber === 0) {
        setMenus(menuItems);
      } else {
        setMenus((prev) => [...prev, ...menuItems]);
      }

      setHasMore(response.number < response.totalPages - 1);
      return response;
    } catch (e) {
      throw e;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [commerceData] = await Promise.all([loadCommerce(), loadMenus(0)]);

        if (commerceData) {
          setCommerce(commerceData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [commerceId, address?.id]);

  const handleLoadMore = async () => {
    if (!loading && hasMore) {
      setLoading(true);
      const nextPage = page + 1;
      setPage(nextPage);

      try {
        await loadMenus(nextPage);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    commerce,
    menus,
    loading,
    hasMore,
    handleLoadMore,
  };
};
