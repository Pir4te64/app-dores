import { useNavigation } from '@react-navigation/native';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CheckoutItem } from './checkoutItem';

import Delivery from '~/assets/delivery.svg';
import Dollar from '~/assets/dollar-sign.svg';
import Logo from '~/assets/logo-black.svg';
import { DeliveryAddressSelector } from '~/presentation/components/addressSelector';
import { PaymentSelector } from '~/presentation/components/paymentSelector';
import { useCheckout } from '~/presentation/hooks/useCheckout';

export default function Checkout() {
  const {
    order,
    items,
    loading,
    orderUpdating,
    selectedAddress,
    isCashPayment,
    totalAmount,
    handleAddressSelected,
    handlePaymentMethodSelected,
    handleQuantityChange,
    handleCreateOrder,
    handleCancelOrder,
  } = useCheckout();
  const router = useNavigation();

  const cancelOder = async () => {
    Alert.alert('¿Estás seguro?', 'Su orden sera cancelada', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Si',
        style: 'destructive',
        onPress: async () => {
          await handleCancelOrder();
          router.goBack();
        },
      },
    ]);
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 pb-20">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }} className="p-4">
          <View className="mb-4">
            <DeliveryAddressSelector onAddressSelected={handleAddressSelected} />
          </View>
          <View>
            {items.map((item) => (
              <CheckoutItem
                key={`${item.id}-${item.observations}`}
                item={item}
                onQuantityChange={(newQuantity) =>
                  handleQuantityChange(item.id, newQuantity, item.observations)
                }
              />
            ))}
          </View>

          <View className="gap-y-4 rounded-lg p-4">
            <Text className="text-[15px] font-medium">Detalles del pedido</Text>
            <View className="flex-row justify-between border-b-[1px] border-gray-300 py-3">
              <View className="flex-row items-center">
                <Delivery height={30} width={50} />
                <Text className="text-[14px]">Costo de envío</Text>
              </View>
              <Text className="font-medium">
                ${order?.costDelivery?.toFixed(2).replace('.00', '') ?? 0}
              </Text>
            </View>
            <View className="flex-row items-center justify-between border-b-[1px] border-gray-300 py-3">
              <View className="flex-row items-center">
                <Logo height={40} width={50} />
                <Text className="text-[14px]">Servicio de Dores</Text>
              </View>
              <Text className="font-medium">${order?.costFee ?? 0}</Text>
            </View>
            <View className="flex-row justify-between border-b-[1px] border-gray-300 py-3">
              <View className="flex-row items-center">
                <Dollar height={30} width={50} />
                <Text className="text-[14px] font-semibold">Total</Text>
              </View>
              <Text className="text-lg font-semibold">
                ${totalAmount.toFixed(2).replace('.00', '')}
              </Text>
            </View>
          </View>

          {items.length > 0 && (
            <>
              <View className="mb-4 mt-4">
                <PaymentSelector onPaymentMethodSelected={handlePaymentMethodSelected} />
              </View>

              <View className="flex-col p-4">
                <TouchableOpacity
                  className="mt-2 rounded-full bg-[#DA2919] p-4"
                  onPress={handleCreateOrder}
                  disabled={loading || orderUpdating || !selectedAddress}>
                  {loading || orderUpdating ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-center text-lg font-semibold text-white">
                      {isCashPayment ? 'Crear Pedido' : 'Proceder al Pago'}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={cancelOder} className="mt-2 self-center">
                  <Text className="text-lg text-gray-500 underline">Cancelar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
