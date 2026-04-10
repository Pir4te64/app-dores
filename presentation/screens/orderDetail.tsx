import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  Package,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle,
  Truck,
  ChefHat,
  ShoppingBag,
} from 'lucide-react-native';

import { OrderEntity } from '~/domain/entities/orderEntity';
import { OrderService } from '~/domain/services/orderService';
import { GlobalText } from '~/presentation/components/GlobalText';

const PRIMARY_RED = '#DA2919';

export const OrderDetail = ({ route }: { route: RouteProp<{ params: { orderId: number } }> }) => {
  const { orderId } = route.params;
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderEntity | null>(null);
  const orderService = OrderService.getInstance();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(String(orderId));
        const filteredOrder = response.content[0] || null;
        setOrder(filteredOrder);
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={PRIMARY_RED} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Package size={48} color="#CCC" />
        <Text style={styles.notFoundText}>No se encontró la orden</Text>
      </View>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PEDIDO_ENTREGADO':
        return {
          label: 'Entregado',
          color: '#22C55E',
          icon: CheckCircle,
          description: 'Tu pedido fue entregado exitosamente',
        };
      case 'EN_PREPARACION':
        return {
          label: 'En Preparación',
          color: '#F97316',
          icon: ChefHat,
          description: 'El comercio está preparando tu pedido',
        };
      case 'PEDIDO_EN_PROCESO':
        return {
          label: 'En Camino',
          color: '#3B82F6',
          icon: Truck,
          description: 'Tu pedido está en camino',
        };
      default:
        return {
          label: 'En Proceso',
          color: '#6B7280',
          icon: Clock,
          description: 'Procesando tu pedido',
        };
    }
  };

  const statusInfo = getStatusInfo(order.orderStatus);
  const StatusIcon = statusInfo.icon;
  const payment = order.getLatestPayment();
  const total = order.total + order.costDelivery + order.costFee;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Status Header */}
        <View style={[styles.statusCard, { backgroundColor: statusInfo.color }]}>
          <View style={styles.statusIconContainer}>
            <StatusIcon size={36} color="#FFF" />
          </View>
          <GlobalText variant="bold" style={styles.statusLabel}>
            {statusInfo.label}
          </GlobalText>
          <Text style={styles.statusDescription}>{statusInfo.description}</Text>
          <View style={styles.statusOrderBadge}>
            <Text style={styles.statusOrderText}>Orden #{order.id}</Text>
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Package size={18} color={PRIMARY_RED} />
            </View>
            <Text style={styles.cardTitle}>Información del pedido</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Código</Text>
            <Text style={styles.infoValue}>{order.qr || `#${order.id}`}</Text>
          </View>
          {order.deliveryTime && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tiempo de entrega</Text>
              <View style={styles.deliveryTimeBadge}>
                <Clock size={12} color={PRIMARY_RED} />
                <Text style={styles.deliveryTimeText}>{order.deliveryTime}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Products */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <ShoppingBag size={18} color={PRIMARY_RED} />
            </View>
            <Text style={styles.cardTitle}>Productos</Text>
          </View>
          {order.detailsOrder.map((item, index) => {
            return (
              <View
                key={item.id}
                style={[
                  styles.productRow,
                  index < order.detailsOrder.length - 1 && styles.borderBottom,
                ]}>
                <View style={styles.productImageContainer}>
                  <View style={styles.productImagePlaceholder}>
                    <ShoppingBag size={20} color="#CCC" />
                  </View>
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    Producto #{item.idMenu}
                  </Text>
                  <Text style={styles.productQty}>Cantidad: {item.quantity}</Text>
                  {item.observaciones && item.observaciones.length > 0 && (
                    <View style={styles.observations}>
                      {item.observaciones.map((obs, i) => (
                        <Text key={i} style={styles.observationText}>
                          {obs}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Delivery Address */}
        {order.delivery && order.deliveryAddress && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <MapPin size={18} color={PRIMARY_RED} />
              </View>
              <Text style={styles.cardTitle}>Dirección de entrega</Text>
            </View>
            <Text style={styles.addressTitle}>{order.deliveryAddress.title}</Text>
            <Text style={styles.addressStreet}>{order.deliveryAddress.streets}</Text>
          </View>
        )}

        {/* Payment Summary */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <CreditCard size={18} color={PRIMARY_RED} />
            </View>
            <Text style={styles.cardTitle}>Resumen de pago</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Productos</Text>
            <Text style={styles.priceValue}>${order.total.toFixed(2)}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Envío</Text>
            <Text style={[styles.priceValue, order.costDelivery === 0 && styles.freeText]}>
              {order.costDelivery > 0 ? `$${order.costDelivery.toFixed(2)}` : 'Gratis'}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Servicio</Text>
            <Text style={styles.priceValue}>${order.costFee.toFixed(2)}</Text>
          </View>

          <View style={[styles.priceRow, styles.totalRow]}>
            <GlobalText variant="bold" style={styles.totalLabel}>
              Total
            </GlobalText>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>

          {payment && (
            <View style={styles.paymentMethodRow}>
              <Text style={styles.paymentMethodLabel}>Método de pago</Text>
              <View style={styles.paymentMethodBadge}>
                <CreditCard size={14} color={PRIMARY_RED} />
                <Text style={styles.paymentMethodValue}>
                  {payment.paymentMethod || 'Efectivo'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffcfa',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  notFoundText: {
    fontSize: 16,
    color: '#666',
  },
  statusCard: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 24,
    color: '#FFF',
  },
  statusDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  statusOrderBadge: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusOrderText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${PRIMARY_RED}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  deliveryTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${PRIMARY_RED}10`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deliveryTimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY_RED,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productImageContainer: {
    marginRight: 12,
  },
  productImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
  },
  productQty: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  observations: {
    marginTop: 4,
  },
  observationText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  addressTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
  },
  addressStreet: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3436',
  },
  freeText: {
    color: '#22C55E',
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 17,
    color: '#2D3436',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: PRIMARY_RED,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  paymentMethodLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentMethodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${PRIMARY_RED}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  paymentMethodValue: {
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY_RED,
  },
});
