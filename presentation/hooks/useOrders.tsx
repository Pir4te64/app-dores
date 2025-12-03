import { useEffect, useState } from 'react';
import { useOrderEvents } from '~/presentation/context/orderContext';

import { OrderEntity } from '~/domain/entities/orderEntity';
import { OrderService } from '~/domain/services/orderService';

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

  // Escucha eventos de creación/actualización y refresca la página 0
  useEffect(() => {
    setRefreshing(true);
    setCurrentPage(0);
    fetchOrders(0);
  }, [ordersRevision]);

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
