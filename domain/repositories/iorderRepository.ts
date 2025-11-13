import { Order, OrderEntity } from '~/domain/entities/orderEntity';

export interface OrderFilters {
  pageNumber?: number;
  pageSize?: number;
  sortDirection?: 'ASC' | 'DESC';
  latitude?: string;
  longitude?: string;
  productId?: string;
  commerceId?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  productName?: string;
  search?: string;
}

export interface CreateOrderBody {
  latitude?: string;
  longitude?: string;
  floor?: string;
  reference?: string;
  titleAddress?: string;
  idCommerce: number;
  addProduct: boolean;
  usePositiveBalance: boolean;
  idOrder?: number;
  idDeliveryAddress?: number;
  delivery: boolean;
  orderRequests: MenuItem[];
}

export interface OpenOrderParams {
  orderId: number;
  paymentType: 'ORDER_OPEN_CASH';
}

export interface CreateCommerceOrderParams {
  addMenu: boolean;
  paymentType: 'CASH';
}

export interface OrderPaymentFilters {
  pageNumber?: number;
  pageSize?: number;
  sortDirection?: 'ASC' | 'DESC';
}

export interface MenuItem {
  quantity: number;
  idMenu: number;
  observaciones: string[];
  id?: number;
}

export interface PaymentOrder {
  id: number;
  details: string;
  idCommerce: number;
  idUser: number;
  paymentLink: string;
  paymentLinkSandbox: string;
  paymentStatus: string;
  priceDelivery: number;
  priceFee: number;
  priceMenu: number;
  priceTotal: number;
}

export interface IOrderRepository {
  getAllCommerces(filters: OrderFilters, token?: string): Promise<any>;
  getAllMenus(filters: OrderFilters, token?: string): Promise<any>;
  addMenusToOrder(body: CreateOrderBody): Promise<Order>;
  createOrderWithMenus(body: CreateOrderBody): Promise<Order>;
  getAllOrders(
    filters?: OrderPaymentFilters
  ): Promise<{ content: OrderEntity[]; totalPages: number; totalElements: number }>;
  getOrderById(orderId: number): Promise<{ content: OrderEntity[] }>;
  createOrderPayment(orderId: number, cashPayment: boolean): Promise<PaymentOrder>;
  cancelOrder(orderId: number): Promise<{ description: string }>;
}
