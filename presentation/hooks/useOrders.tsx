import { useEffect, useState } from 'react';
import { useOrderEvents } from '~/presentation/context/orderContext';

import { OrderEntity } from '~/domain/entities/orderEntity';
import { OrderService } from '~/domain/services/orderService';
import { supabase } from '~/infrastructure/supabase/client';
import { CommerceSupabaseService } from '~/domain/services/supabase/commerceService';
import { mapOrder } from '~/domain/mappers/supabaseMappers';

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const orderService = OrderService.getInstance();
  const { ordersRevision } = useOrderEvents();

  const fetchOrders = async (page: number) => {
    try {
      const response = await orderService.getAllOrders({
        pageNumber: page,
        pageSize: 5,
        sortDirection: 'DESC',
      });
      setOrders(response.content);
      setTotalPages(response.totalPages);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  // Listen for order creation/update events and refresh
  useEffect(() => {
    setRefreshing(true);
    setCurrentPage(0);
    fetchOrders(0);
  }, [ordersRevision]);

  // Realtime subscription for order updates
  useEffect(() => {
    let channel: any;

    const setupRealtime = async () => {
      try {
        const commerceService = CommerceSupabaseService.getInstance();
        const commerceId = await commerceService.getCommerceId();

        channel = supabase
          .channel('orders-realtime')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'orders',
              filter: `commerce_id=eq.${commerceId}`,
            },
            () => {
              // Refresh orders when any order changes
              fetchOrders(currentPage);
            }
          )
          .subscribe();
      } catch {
        // Commerce not loaded yet, skip realtime
      }
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [currentPage]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders(currentPage);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    orders,
    error,
    loading,
    refreshing,
    currentPage,
    totalPages,
    handleRefresh,
    handleNextPage,
    handlePreviousPage,
  };
};
