import { Order, OrderEntity } from '~/domain/entities/orderEntity';
import {
  CreateOrderBody,
  IOrderRepository,
  OrderFilters,
  OrderPaymentFilters,
  PaymentOrder,
} from '~/domain/repositories/iorderRepository';
import { ApiClient } from '~/domain/sources/remote/apiClient';

export class OrderRepository implements IOrderRepository {
  private apiClient: ApiClient;
  private static instance: OrderRepository;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  static getInstance(): OrderRepository {
    if (!OrderRepository.instance) {
      OrderRepository.instance = new OrderRepository();
    }
    return OrderRepository.instance;
  }

  async getAllCommerces(filters: OrderFilters, token?: string): Promise<any> {
    const queryParams = new URLSearchParams({
      'product-id': filters.productId ?? '',
      'commerce-id': filters.commerceId ?? '',
      'category-id': filters.categoryId ?? '',
      latitude: filters.latitude ?? '',
      longitude: filters.longitude ?? '',
      'min-price': filters.minPrice ?? '',
      'max-price': filters.maxPrice ?? '',
      'product-name': filters.productName ?? '',
      'page-size': filters.pageSize?.toString() ?? '10',
      'page-number': filters.pageNumber?.toString() ?? '0',
      'sort-direction': filters.sortDirection ?? 'ASC',
      search: filters.search ?? '',
    });

    return await this.apiClient.get(
      `/pedidos/user/v1/get-all-commerce?${queryParams.toString()}`,
      token
    );
  }

  async getAllMenus(filters: OrderFilters, token?: string): Promise<any> {
    const queryParams = new URLSearchParams({
      'page-number': filters.pageNumber?.toString() ?? '0',
      'page-size': filters.pageSize?.toString() ?? '10',
      'sort-direction': filters.sortDirection ?? 'DESC',
      'name-characteristics': filters.search ?? '',
    });

    return await this.apiClient.get(
      `/menus/user/v1/get-all-menus?${queryParams.toString()}`,
      token
    );
  }

  async getAllOrders(filters?: OrderPaymentFilters): Promise<any> {
    const queryParams = new URLSearchParams({
      'page-number': filters?.pageNumber?.toString() ?? '0',
      'page-size': filters?.pageSize?.toString() ?? '10',
      'sort-direction': filters?.sortDirection ?? 'DESC',
    });

    return await this.apiClient.getWithAuth(
      `/pedidos/user/v1/get-all-purchase-orders?${queryParams.toString()}`
    );
  }
  async getOrderById(orderId: number): Promise<{ content: OrderEntity[] }> {
    return await this.apiClient.getWithAuth<{ content: OrderEntity[] }>(
      `/pedidos/user/v1/get-all-purchase-orders?page-number=0&page-size=100&sort-direction=DESC&id=${orderId}`
    );
  }
  async addMenusToOrder(body: CreateOrderBody): Promise<Order> {
    const response = await this.apiClient.postWithAuth<Order>(
      '/pedidos/user/v1/create-order-add-menus',
      body
    );
    return new OrderEntity(response);
  }

  async createOrderWithMenus(body: CreateOrderBody): Promise<Order> {
    try {
      const response = await this.apiClient.postWithAuth<Order>(
        '/pedidos/user/v1/create-order-add-menus',
        body
      );
      return new OrderEntity(response);
    } catch (error) {
      throw error;
    }
  }

  async createOrderPayment(orderId: number, cashPayment: boolean): Promise<PaymentOrder> {
    try {
      const response = await this.apiClient.postWithAuth<PaymentOrder>(
        `/pagos/user/v1/order-payment?id-order=${orderId}&cash-payment=${cashPayment}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  async cancelOrder(orderId: number): Promise<{ description: string }> {
    try {
      return await this.apiClient.deleteWithAuth<{ description: string }>(
        `/pedidos/user/v1/delete-order?id-order=${orderId}`
      );
    } catch (error) {
      throw error;
    }
  }
}
