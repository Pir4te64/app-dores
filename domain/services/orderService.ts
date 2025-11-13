import { OrderRepository } from '~/data/repository/orderRepository';
import { OrderEntity } from '~/domain/entities/orderEntity';
import {
  CreateOrderBody,
  IOrderRepository,
  OrderFilters,
  OrderPaymentFilters,
  PaymentOrder,
} from '~/domain/repositories/iorderRepository';
import { AsyncStorageService } from '~/infrastructure/storage/asyncStorageService';

export class OrderService {
  private orderRepository: IOrderRepository;
  private static instance: OrderService;

  constructor() {
    this.orderRepository = OrderRepository.getInstance();
  }

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async getAllCommerces(filters: OrderFilters) {
    const token = await AsyncStorageService.getItem('accessToken');
    return await this.orderRepository.getAllCommerces(filters, token ?? undefined);
  }

  async getAllMenus(filters: OrderFilters) {
    const token = await AsyncStorageService.getItem('accessToken');
    return await this.orderRepository.getAllMenus(filters, token ?? undefined);
  }

  async getAllOrders(
    params?: OrderPaymentFilters
  ): Promise<{ content: OrderEntity[]; totalPages: number; totalElements: number }> {
    const data = await this.orderRepository.getAllOrders(params);
    const filteredOrders = data.content.filter((o) => o.orderPayment != null);
    const pageSize = data.content.length / data.totalPages;
    return {
      content: filteredOrders,
      totalPages: Math.ceil(filteredOrders.length / pageSize),
      totalElements: filteredOrders.length,
    };
  }
  async getOrderById(orderId: number): Promise<{ content: OrderEntity[] }> {
    return await this.orderRepository.getOrderById(orderId);
  }
  async createOrder(body: CreateOrderBody): Promise<OrderEntity> {
    try {
      const order = await this.orderRepository.createOrderWithMenus(body);

      return new OrderEntity(order);
    } catch (error) {
      throw error;
    }
  }

  async updateOrder(body: CreateOrderBody): Promise<OrderEntity> {
    try {
      if (!body.idDeliveryAddress) {
        throw new Error('Delivery address is required for updating an order');
      }

      const order = await this.orderRepository.addMenusToOrder(body);
      return new OrderEntity(order);
    } catch (error) {
      throw error;
    }
  }

  async createOrderPayment(
    orderId: number,
    cashPayment: boolean
  ): Promise<{ cashOrder?: PaymentOrder; checkoutOrder?: PaymentOrder }> {
    try {
      const response = await this.orderRepository.createOrderPayment(orderId, cashPayment);
      return response.paymentLink === null ? { cashOrder: response } : { checkoutOrder: response };
    } catch (error) {
      throw error;
    }
  }

  async cancelOrder(orderId: number): Promise<{ description: string }> {
    return await this.orderRepository.cancelOrder(orderId);
  }
}
