import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';

import { useOrders } from '../hooks/useOrders';

import { OrderEntity } from '~/domain/entities/orderEntity';
import { getThemedStyles } from '~/presentation/styles/theme';
import { textOrderStatus } from '~/utils/helpers';

type OrderNavigationProp = {
  navigate: (screen: string, params: { orderId: number }) => void;
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
  const theme = getThemedStyles();

  const renderOrderItem = ({ item }: { item: OrderEntity }) => {
    const itemsQuantity = item.detailsOrder.reduce((total, detail) => total + detail.quantity, 0);
    const stylesOrderStatus = (orderStatus: string) => {
      switch (orderStatus) {
        case 'CANCELADO':
          return 'text-red-600';
        case 'EN_PREPARACION':
          return 'text-orange-600';
        case 'EN_PROCESO':
          return 'text-orange-600';
        case 'PEDIDO_EN_PROCESO':
          return 'text-blue-600';
        case 'PEDIDO_ENTREGADO':
          return 'text-green-600';
        default:
          return 'text-[#1a3260]';
      }
    };
    return (
      <TouchableOpacity
        className="mb-4 rounded-xl bg-white p-4"
        style={{ elevation: 2 }}
        onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1 gap-y-2">
            <Text className="text-lg font-bold" style={{ color: theme.primaryColor }}>
              Orden #{item.id}
            </Text>
            <Text className="text-gray-600">
              {itemsQuantity} {itemsQuantity === 1 ? 'producto' : 'productos'}
            </Text>
            <Text style={{ color: theme.primaryColor }}>
              ${item.total + item.costFee + item.costDelivery}
            </Text>
            {item.delivery && (
              <Text className="text-sm text-gray-500">{item.deliveryAddress.title}</Text>
            )}
          </View>
          <View>
            <View className="items-end">
              <Text className={`text-lg font-semibold ${stylesOrderStatus(item.orderStatus)}`}>
                {textOrderStatus(item.orderStatus)}
              </Text>
            </View>
          </View>
        </View>

        {item.orderPayment !== undefined && item.orderPayment.length > 0 && (
          <View className="mt-2 border-t border-gray-200 pt-2">
            <Text className="text-sm text-gray-500">
              Método de pago:{' '}
              {item.orderPayment[0].paymentType === 'BUY_MENU' ? 'Tarjeta' : 'Efectivo'}
            </Text>
            <Text className="text-sm text-gray-500">
              Estado:{' '}
              {item.orderPayment[0].paymentStatus === 'EN_PROCESO'
                ? 'En proceso'
                : item.orderPayment[0].paymentStatus === 'EN_PROCESO_EFECTIVO'
                  ? 'En proceso'
                  : item.orderPayment[0].paymentStatus === 'APPROVED'
                    ? 'Aprobado'
                    : 'Rechazado'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.backgroundColor }}>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.primaryColor} />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text>Disculpe, no pudimos obtener las órdenes</Text>
        </View>
      ) : (
        <View className="flex-1 p-4">
          <FlatList
            data={orders}
            onScrollEndDrag={handleRefresh}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View className="items-center justify-center py-8">
                <View className="items-center justify-center">
                  <Image
                    source={require('~/assets/splash.png')}
                    className="size-40"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-xl">No tienes pedidos aún</Text>
              </View>
            }
          />
          {totalPages > 0 && (
            <View className="mt-4 flex-row justify-between px-8">
              <TouchableOpacity
                className="rounded-full p-1"
                style={{
                  backgroundColor: currentPage === 0 ? '#e0e0e0' : theme.primaryColor,
                  opacity: currentPage === 0 ? 0.6 : 1,
                }}
                disabled={currentPage === 0}
                onPress={handlePreviousPage}>
                <ChevronLeft color={currentPage === 0 ? '#909090' : 'white'} />
              </TouchableOpacity>

              <View className="items-center justify-center px-4">
                <Text className="text-sm" style={{ color: theme.secondaryTextColor }}>
                  Página {currentPage + 1} de {totalPages}
                </Text>
              </View>

              <TouchableOpacity
                className="rounded-full p-1"
                style={{
                  backgroundColor: currentPage >= totalPages - 1 ? '#e0e0e0' : theme.primaryColor,
                  opacity: currentPage >= totalPages - 1 ? 0.6 : 1,
                }}
                disabled={currentPage >= totalPages - 1}
                onPress={handleNextPage}>
                <ChevronRight color={currentPage >= totalPages - 1 ? '#909090' : 'white'} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};
