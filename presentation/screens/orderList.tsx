import { useNavigation } from '@react-navigation/native';
import {
  ChevronRight,
  ClipboardList,
  MapPin,
  CreditCard,
  CheckCircle,
  Truck,
  ChefHat,
  Clock,
  ShoppingBag,
} from 'lucide-react-native';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import { useOrders } from '../hooks/useOrders';

import { OrderEntity } from '~/domain/entities/orderEntity';
import { GlobalText } from '~/presentation/components/GlobalText';
import { textOrderStatus } from '~/utils/helpers';

const PRIMARY_RED = '#DA2919';

type OrderNavigationProp = {
  navigate: (screen: string, params?: { orderId?: number }) => void;
  getParent: () => { navigate: (screen: string) => void } | undefined;
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'PEDIDO_ENTREGADO':
      return { color: '#22C55E', bgColor: '#F0FDF4', icon: CheckCircle, label: 'Entregado' };
    case 'EN_PREPARACION':
      return { color: '#F97316', bgColor: '#FFF7ED', icon: ChefHat, label: 'Preparando' };
    case 'PEDIDO_EN_PROCESO':
    case 'EN_PROCESO':
      return { color: '#3B82F6', bgColor: '#EFF6FF', icon: Truck, label: 'En camino' };
    case 'CANCELADO':
      return { color: '#EF4444', bgColor: '#FEF2F2', icon: Clock, label: 'Cancelado' };
    default:
      return { color: '#6B7280', bgColor: '#F3F4F6', icon: Clock, label: 'En proceso' };
  }
};

export const OrderList = () => {
  const {
    orders,
    currentPage,
    totalPages,
    loading,
    refreshing,
    error,
    handleNextPage,
    handleRefresh,
    handlePreviousPage,
  } = useOrders();
  const navigation = useNavigation<OrderNavigationProp>();

  const renderOrderItem = ({ item }: { item: OrderEntity }) => {
    const itemsQuantity = item.detailsOrder.reduce((total, detail) => total + detail.quantity, 0);
    const statusConfig = getStatusConfig(item.orderStatus);
    const StatusIcon = statusConfig.icon;
    const totalPrice = item.total + item.costFee + item.costDelivery;
    const paymentMethod =
      item.orderPayment?.[0]?.paymentMethod === 'EFECTIVO' ? 'Efectivo' : 'Tarjeta';

    return (
      <TouchableOpacity
        style={[styles.orderCard, { borderLeftColor: statusConfig.color }]}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}>
        {/* Header: Order ID + Status Badge */}
        <View style={styles.cardHeader}>
          <GlobalText variant="bold" style={styles.orderId}>
            Orden #{item.id}
          </GlobalText>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <StatusIcon size={14} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {/* Products summary */}
        <View style={styles.summaryRow}>
          <ShoppingBag size={16} color="#999" />
          <Text style={styles.summaryText}>
            {itemsQuantity} {itemsQuantity === 1 ? 'producto' : 'productos'}
          </Text>
        </View>

        {/* Price */}
        <Text style={styles.price}>${totalPrice}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer: Address + Payment + Arrow */}
        <View style={styles.cardFooter}>
          <View style={styles.footerInfo}>
            {item.delivery && item.deliveryAddress?.title && (
              <View style={styles.footerItem}>
                <MapPin size={14} color="#999" />
                <Text style={styles.footerText} numberOfLines={1}>
                  {item.deliveryAddress.title}
                </Text>
              </View>
            )}
            <View style={styles.footerItem}>
              <CreditCard size={14} color="#999" />
              <Text style={styles.footerText}>{paymentMethod}</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#CCC" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PRIMARY_RED} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ClipboardList size={48} color="#CCC" />
          <Text style={styles.errorText}>No pudimos cargar tus pedidos</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <GlobalText variant="bold" style={styles.headerTitle}>
          Mis Pedidos
        </GlobalText>
        {orders.length > 0 && (
          <Text style={styles.headerSubtitle}>
            {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
          </Text>
        )}
      </View>

      {/* List */}
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={orders.length === 0 ? styles.emptyContainer : styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <ClipboardList size={56} color={PRIMARY_RED} />
            </View>
            <GlobalText variant="bold" style={styles.emptyTitle}>
              Aún no tienes pedidos
            </GlobalText>
            <Text style={styles.emptySubtitle}>
              Cuando realices tu primer pedido, aparecerá aquí
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.getParent()?.navigate('Home')}>
              <Text style={styles.exploreButtonText}>Explorar menú</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageButton, currentPage === 0 && styles.pageButtonDisabled]}
            disabled={currentPage === 0}
            onPress={handlePreviousPage}>
            <Text
              style={[
                styles.pageButtonText,
                currentPage === 0 && styles.pageButtonTextDisabled,
              ]}>
              Anterior
            </Text>
          </TouchableOpacity>

          <Text style={styles.pageIndicator}>
            {currentPage + 1} / {totalPages}
          </Text>

          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage >= totalPages - 1 && styles.pageButtonDisabled,
            ]}
            disabled={currentPage >= totalPages - 1}
            onPress={handleNextPage}>
            <Text
              style={[
                styles.pageButtonText,
                currentPage >= totalPages - 1 && styles.pageButtonTextDisabled,
              ]}>
              Siguiente
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingHorizontal: 32,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    color: PRIMARY_RED,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 18,
    color: '#2D3436',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerInfo: {
    flex: 1,
    gap: 6,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: '#999',
    flex: 1,
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${PRIMARY_RED}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    color: '#2D3436',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: PRIMARY_RED,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Error state
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: PRIMARY_RED,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  // Pagination
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  pageButton: {
    backgroundColor: PRIMARY_RED,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pageButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  pageButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  pageButtonTextDisabled: {
    color: '#999',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});
