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
import { useState } from 'react';
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
  // Conversión de moneda USD → VES (Bolívares)
  const [showVES, setShowVES] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState(false);

  const getVESRate = async () => {
    try {
      setRateLoading(true);
      const res = await fetch(
        'https://api.exchangerate.host/latest?base=USD&symbols=VES'
      );
      const json = await res.json();
      const rate = json?.rates?.VES;
      if (typeof rate === 'number' && rate > 0) {
        setExchangeRate(rate);
      } else {
        // Fallback básico si la API no entrega VES
        setExchangeRate(40);
      }
    } catch (e) {
      // Fallback en caso de error de red
      setExchangeRate(40);
    } finally {
      setRateLoading(false);
    }
  };

  const toggleCurrency = async () => {
    if (!showVES) {
      if (!exchangeRate) {
        await getVESRate();
      }
      setShowVES(true);
    } else {
      setShowVES(false);
    }
  };

  const formatAmount = (usd: number) => {
    if (showVES && exchangeRate) {
      const ves = usd * exchangeRate;
      const formatted = ves.toFixed(2).replace('.00', '');
      return `Bs. ${formatted}`;
    }
    const formatted = usd.toFixed(2).replace('.00', '');
    return `$${formatted}`;
  };

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
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }} className="p-4">
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
                {formatAmount(order?.costDelivery ?? 0)}
              </Text>
            </View>
            <View className="flex-row justify-between border-b-[1px] border-gray-300 py-3">
              <View className="flex-row items-center">
                <Dollar height={30} width={50} />
                <Text className="text-[14px] font-semibold">Total</Text>
              </View>
              <Text className="text-lg font-semibold">
                {formatAmount(totalAmount)}
              </Text>
            </View>
            <View className="mt-2 flex-row items-center justify-end">
              <TouchableOpacity
                onPress={toggleCurrency}
                className="rounded-full bg-[#1a3260] px-3 py-2">
                <Text className="text-sm font-medium text-white">
                  {showVES ? 'Ver montos en $' : 'Ver montos en Bs.'}
                </Text>
              </TouchableOpacity>
              {rateLoading && (
                <ActivityIndicator className="ml-2" />
              )}
            </View>
          </View>

          {items.length > 0 && (
            <>
              <View className="mb-1 mt-2">
                <PaymentSelector onPaymentMethodSelected={handlePaymentMethodSelected} />
              </View>

              <View className="flex-col px-4 pt-0 pb-4 mb-12">
                <TouchableOpacity
                  className="rounded-full p-4"
                  style={{
                    backgroundColor:
                      loading || orderUpdating || !selectedAddress || !isCashPayment
                        ? '#ccc'
                        : '#DA2919',
                    opacity:
                      loading || orderUpdating || !selectedAddress || !isCashPayment ? 0.7 : 1,
                  }}
                  onPress={handleCreateOrder}
                  disabled={loading || orderUpdating || !selectedAddress || !isCashPayment}>
                  {loading || orderUpdating ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-center text-lg font-semibold text-white">
                      {isCashPayment ? 'Crear Pedido' : 'Proceder al Pago'}
                    </Text>
                  )}
                </TouchableOpacity>
                {!isCashPayment && (
                  <Text className="mt-2 text-center text-sm text-gray-600">
                    Selecciona el método de pago Efectivo para continuar
                  </Text>
                )}
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
