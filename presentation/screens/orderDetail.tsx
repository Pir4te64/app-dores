import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, Image } from 'react-native';

import { Commerce } from '~/domain/entities/commerceEntity';
import { MenuItem } from '~/domain/entities/menuEntity';
import { OrderEntity } from '~/domain/entities/orderEntity';
import { CommerceService } from '~/domain/services/commerceService';
import { MenuService } from '~/domain/services/menuService';
import { OrderService } from '~/domain/services/orderService';
import { useCheckout } from '~/hooks/useCheckout';
import { getThemedStyles } from '~/presentation/styles/theme';
import { stylesOrderStatus, textOrderStatus } from '~/utils/helpers';

export const OrderDetail = ({ route }: { route: RouteProp<{ params: { orderId: number } }> }) => {
  const { orderId } = route.params;
  const theme = getThemedStyles();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderEntity | null>(null);
  const [menu, setMenu] = useState<MenuItem>();
  const [commerce, setCommerce] = useState<Commerce | null>(null);
  const { isCashPayment } = useCheckout();
  const orderService = OrderService.getInstance();
  const commerceService = CommerceService.getInstance();
  const menuService = MenuService.getInstance();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(orderId);
        const filteredOrder = response.content.find((o) => o.id === orderId);
        const commerceId = filteredOrder?.detailsOrder.find(
          (order) => order.idCommerce
        )?.idCommerce;
        if (!commerceId) throw new Error('Comercio no encontrado');
        const commerceData = await commerceService.getCommerceById(commerceId);
        const menuResponse = await menuService.getMenuByCommerce(commerceId);
        const menuData = menuResponse.content.find((menu) => menu.commerceId === commerceId);
        setOrder(filteredOrder);
        setMenu(menuData);
        setCommerce(commerceData || null);
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
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={theme.primaryColor} />
      </View>
    );
  }

  if (!order) {
    return (
      <View
        className="flex-1 items-center justify-center p-4"
        style={{ backgroundColor: theme.backgroundColor }}>
        <Text className="text-center text-lg" style={{ color: theme.secondaryTextColor }}>
          No se encontró la orden
        </Text>
      </View>
    );
  }

  const menuItemsTotal = order.total + (order.costDelivery || 0) + (order.costFee || 0);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}>
        <View>
          {commerce && (
            <View className="mb-4 rounded-lg">
              <View className="aspect-[16/9] w-full">
                <Image
                  source={{ uri: commerce?.coverImage }}
                  className="size-full"
                  style={{ objectFit: 'cover' }}
                />
              </View>
              <Text className="px-4 text-lg font-bold" style={{ color: theme.primaryColor }}>
                {commerce.businessName}
              </Text>
              <Text className="text-sm text-gray-500">{commerce.description}</Text>
            </View>
          )}
          <View className="mb-4 flex-row items-center justify-between px-4">
            <Text className="text-xl font-bold">Tu pedido</Text>
            <Text className={`text-lg font-medium ${stylesOrderStatus(order.orderStatus)}`}>
              {textOrderStatus(order.orderStatus)}
            </Text>
          </View>
          <View className="mb-4 px-4">
            {order.detailsOrder.map((item) => (
              <View key={item.id} className="mb-2 flex-row rounded-lg">
                <Image
                  source={{ uri: menu?.image[0].url }}
                  className="mr-2 h-24 w-24 rounded-lg"
                  style={{ objectFit: 'cover' }}
                />
                <View>
                  <Text className="font-medium">
                    {item.quantity}x Menú {menu?.name}
                  </Text>
                  {item.observaciones && item.observaciones.length > 0 && (
                    <View className="mt-1">
                      {item.observaciones.map((obs, index) => (
                        <Text key={index} className="text-sm text-gray-600">
                          • {obs}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          <View className="gap-y-4 rounded-lg  p-4 ">
            <Text className="text-xl font-semibold">Detalles del pedido</Text>
            <View className="flex-row items-center justify-between border-b-[1px] border-gray-300 py-3">
              <Text className="text-lg">Costo de envío</Text>
              <Text className="text-lg">
                ${order.costDelivery?.toFixed(2).replace('.00', '') ?? 0}
              </Text>
            </View>
            <View className="flex-row items-center justify-between border-b-[1px] border-gray-300 py-3">
              <Text className="text-lg">Servicio de Dores</Text>
              <Text className="text-lg">${order.costFee ?? 0}</Text>
            </View>
            <View className="flex-row items-center justify-between border-b-[1px] border-gray-300 py-3">
              <Text className="text-lg">Productos</Text>
              <Text className="text-lg">${order.total.toFixed(2).replace('.00', '')}</Text>
            </View>
            <View className="flex-row items-center justify-between pt-3">
              <Text className="text-lg font-bold">Total</Text>
              <Text className="text-lg">${menuItemsTotal.toFixed(2).replace('.00', '')}</Text>
            </View>
          </View>

          <View className="mt-4 rounded-lg  p-4 ">
            <View className="flex-row items-end justify-between">
              <View>
                <Text className="mb-2 text-xl font-semibold">Medio de pago</Text>
                <Text className="text-lg">{isCashPayment ? 'Mercado Pago' : 'Efectivo'}</Text>
              </View>
              <Text className="text-lg">${menuItemsTotal.toFixed(2).replace('.00', '')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
