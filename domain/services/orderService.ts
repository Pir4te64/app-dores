import { OrderEntity } from '~/domain/entities/orderEntity';
import { supabase } from '~/infrastructure/supabase/client';
import { mapOrder } from '~/domain/mappers/supabaseMappers';
import { CommerceSupabaseService } from '~/domain/services/supabase/commerceService';

interface OrderPaymentFilters {
  pageNumber?: number;
  pageSize?: number;
  sortDirection?: string;
}

interface CreateOrderData {
  commerceId: string;
  orderType: 'DELIVERY' | 'IN_STORE';
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  total: number;
  costDelivery: number;
  paymentMethod: string;
  paymentReference?: string;
  deliveryZoneId?: string;
  deliveryAddress?: string;
  deliveryLatitude?: string;
  deliveryLongitude?: string;
  exchangeRate?: number;
  totalBs?: number;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    observations?: string[];
    drinkAddonId?: string;
    drinkAddonPrice?: number;
  }[];
}

export class OrderService {
  private static instance: OrderService;

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async getAllOrders(
    params?: OrderPaymentFilters
  ): Promise<{ content: OrderEntity[]; totalPages: number; totalElements: number }> {
    const commerceService = CommerceSupabaseService.getInstance();
    const commerceId = await commerceService.getCommerceId();

    const pageSize = params?.pageSize || 10;
    const pageNumber = params?.pageNumber || 0;
    const from = pageNumber * pageSize;
    const to = from + pageSize - 1;

    // Get the current user's phone or email to filter their orders
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { content: [], totalPages: 0, totalElements: 0 };
    }

    const { data, error, count } = await supabase
      .from('orders')
      .select(
        '*, items:order_items(*, product:products(*, images:product_images(*)), drink_addon:drink_addons(*)), delivery_zone:delivery_zones(*)',
        { count: 'exact' }
      )
      .eq('commerce_id', commerceId)
      .order('created_at', { ascending: params?.sortDirection === 'ASC' })
      .range(from, to);

    if (error) {
      console.error('Error fetching orders:', error);
      throw new Error(error.message);
    }

    const orders = (data || []).map(mapOrder);
    const totalElements = count || 0;
    const totalPages = Math.ceil(totalElements / pageSize);

    return { content: orders, totalPages, totalElements };
  }

  async getOrderById(orderId: string): Promise<{ content: OrderEntity[] }> {
    const { data, error } = await supabase
      .from('orders')
      .select(
        '*, items:order_items(*, product:products(*, images:product_images(*)), drink_addon:drink_addons(*)), delivery_zone:delivery_zones(*)'
      )
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      throw new Error(error.message);
    }

    return { content: data ? [mapOrder(data)] : [] };
  }

  async createOrder(orderData: CreateOrderData): Promise<OrderEntity> {
    // 1. Insert the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        commerce_id: orderData.commerceId,
        order_type: orderData.orderType,
        customer_first_name: orderData.customerFirstName,
        customer_last_name: orderData.customerLastName,
        customer_phone: orderData.customerPhone,
        total: orderData.total,
        cost_delivery: orderData.costDelivery,
        cost_fee: 0,
        payment_method: orderData.paymentMethod,
        payment_reference: orderData.paymentReference || null,
        payment_status: 'PENDING_VERIFICATION',
        order_status: 'PEDIDO_EN_PROCESO',
        delivery_zone_id: orderData.deliveryZoneId || null,
        delivery_address: orderData.deliveryAddress || null,
        delivery_latitude: orderData.deliveryLatitude || null,
        delivery_longitude: orderData.deliveryLongitude || null,
        exchange_rate: orderData.exchangeRate || null,
        total_bs: orderData.totalBs || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      throw new Error(orderError?.message || 'Error al crear el pedido');
    }

    // 2. Insert order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.subtotal,
      observations: item.observations || null,
      drink_addon_id: item.drinkAddonId || null,
      drink_addon_price: item.drinkAddonPrice || null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
    }

    // 3. Create notification for the dashboard
    await supabase.from('notifications').insert({
      commerce_id: orderData.commerceId,
      title: 'Nuevo Pedido',
      message: `${orderData.customerFirstName} ${orderData.customerLastName} ha realizado un pedido`,
      type: 'NEW_ORDER',
      details: order.id,
    });

    return mapOrder(order);
  }

  async cancelOrder(orderId: string): Promise<{ description: string }> {
    const { error } = await supabase
      .from('orders')
      .update({ order_status: 'CANCELED' })
      .eq('id', orderId);

    if (error) {
      throw new Error(error.message);
    }

    return { description: `Order with ID ${orderId} deleted successfully` };
  }
}
