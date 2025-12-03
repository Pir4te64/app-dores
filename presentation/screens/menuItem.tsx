import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Menu } from '~/domain/entities/menuEntity';
import { CreateOrderBody } from '~/domain/repositories/iorderRepository';
import { OrderService } from '~/domain/services/orderService';
import { CommerceService } from '~/domain/services/commerceService';
import { useAddress } from '~/hooks/useAddress';
import { useCart } from '~/presentation/context/cartContext';
import { useOrderEvents } from '~/presentation/context/orderContext';

export const MenuItem = () => {
  const navigation = useNavigation();
  const [count, setCount] = useState(1);
  const orderService = OrderService.getInstance();
  const commerceService = CommerceService.getInstance();
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const route = useRoute<RouteProp<{ params: { item: Menu; commerceId: number } }, 'params'>>();
  const { item, commerceId } = route.params;
  const { addItem, setOrderId, items, clearCart } = useCart();
  const { address } = useAddress();
  const { notifyOrdersChanged } = useOrderEvents();
  const [isCommerceOpen, setIsCommerceOpen] = useState<boolean>(true);

  // Consultar el estado del comercio (abierto/cerrado) por ID
  useEffect(() => {
    let mounted = true;
    const fetchStatus = async () => {
      try {
        const commerce = await commerceService.getCommerceById(commerceId);
        if (mounted) {
          // Usamos la propiedad "active" como indicador de abierto/cerrado
          setIsCommerceOpen(Boolean(commerce?.active));
        }
      } catch (e) {
        // Ante error, por defecto consideramos cerrado para evitar pedidos inválidos
        if (mounted) setIsCommerceOpen(false);
      }
    };
    fetchStatus();
    return () => {
      mounted = false;
    };
  }, [commerceId]);

  const handleIncrement = () => setCount((prev) => prev + 1);

  const handleDecrement = () => {
    if (count > 1) setCount((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);

      // Bloquear si el comercio está cerrado
      if (!isCommerceOpen) {
        Alert.alert('Comercio cerrado', 'Este comercio está cerrado. No es posible crear pedidos en este momento.');
        setLoading(false);
        return;
      }

      // Validar dirección antes de crear el pedido
      if (!address || !address.latitude || !address.longitude || !address.id) {
        Alert.alert(
          'Dirección requerida',
          'Selecciona o agrega una dirección antes de crear el pedido.',
          [
            {
              text: 'Ir a direcciones',
              onPress: () =>
                // Navegar al tab Perfil y abrir la pantalla de direcciones
                (navigation.getParent() as any)?.navigate('Profile', {
                  screen: 'ProfileAddresses',
                }),
            },
            { text: 'Cancelar', style: 'cancel' },
          ]
        );
        setLoading(false);
        return;
      }

      if (items.length > 0) {
        const firstCommerceId = items[0].commerceId;
        if (firstCommerceId !== commerceId) {
          Alert.alert(
            '¿Desea vaciar el carrito y agregar este producto?',
            'No es posible agregar productos de diferentes comercios en el mismo pedido.',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Vaciar carrito',
                style: 'destructive',
                onPress: async () => {
                  try {
                    clearCart();
                    await createNewOrder();
                  } catch (e) {
                    console.error(e);
                    Alert.alert('Error', 'Intente de nuevo más tarde.');
                  }
                },
              },
            ]
          );
          return;
        }
      }

      await createNewOrder();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const createNewOrder = async () => {
    const orderBody: CreateOrderBody = {
      latitude: address?.latitude,
      longitude: address?.longitude,
      floor: address?.floor ?? '',
      reference: address?.reference ?? '',
      titleAddress: address?.title ?? '',
      idCommerce: commerceId,
      addProduct: true,
      usePositiveBalance: false,
      delivery: true,
      idDeliveryAddress: address?.id,
      orderRequests: [{ idMenu: item.id, quantity: count, observaciones: [observations] }],
    };
    try {
      const newOrder = await orderService.createOrder(orderBody);
      setOrderId(newOrder.id);
      await addItem(item, count, observations);
      // Notificar para refrescar la lista de pedidos
      notifyOrdersChanged();

      Alert.alert('Éxito', 'Producto agregado al carrito', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      throw error;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View>
          <View>
            <Image
              source={{ uri: item?.image[0].url }}
              className="h-44 w-full"
              style={{ objectFit: 'cover' }}
            />
            <View className="mx-2 mt-4 px-2">
              <Text className="text-2xl font-bold">{item?.name}</Text>
              <Text className="text-gray-600">{item.description}</Text>
            </View>
          </View>
          <View className="flex-row">
            <View className="ml-4 flex-1">
              <View className="mt-2 flex-row items-center justify-between">
                <Text className="text-xl font-bold">${item.price}</Text>
                <View className="mx-4 flex-row items-center gap-x-4">
                  <TouchableOpacity
                    onPress={handleDecrement}
                    className="size-8  items-center justify-center rounded-full bg-[#F4F4F4]">
                    <Text className="text-xl font-bold">-</Text>
                  </TouchableOpacity>
                  <Text className="text-lg font-semibold">{count}</Text>
                  <TouchableOpacity
                    onPress={handleIncrement}
                    className="h-8 w-8 items-center justify-center rounded-full bg-[#F4F4F4]">
                    <Text className="text-xl font-bold">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View className="mt-4 px-4">
            <Text className="mb-2 text-xl font-light">Observaciones</Text>
            <TextInput
              className="h-20 rounded-2xl border border-gray-300 p-2"
              placeholder="Describe tu pedido"
              multiline
              numberOfLines={4}
              value={observations}
              onChangeText={setObservations}
            />
          </View>
          <TouchableOpacity
            className={`mt-4 w-48 self-center rounded-full p-4 ${isCommerceOpen ? 'bg-[#DA2919]' : 'bg-gray-300'}`}
            onPress={handleAddToCart}
            disabled={!isCommerceOpen}>
            {loading ? (
              <ActivityIndicator className="self-center" size="small" />
            ) : (
              <Text className="text-center text-lg font-semibold text-white">Crear pedido</Text>
            )}
          </TouchableOpacity>
          {!isCommerceOpen && (
            <View className="mt-2 self-center">
              <Text className="text-center text-sm text-gray-600">El comercio está cerrado. Intenta más tarde.</Text>
            </View>
          )}
          <TouchableOpacity className="my-4 self-center" onPress={() => navigation.goBack()}>
            <Text className="text-lg text-gray-500 underline">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
