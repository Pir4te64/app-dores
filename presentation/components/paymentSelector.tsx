import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import Cash from '~/assets/efectivo.svg';
import MP from '~/assets/mercado-pago.svg';

interface PaymentSelectorProps {
  onPaymentMethodSelected: (isCashPayment: boolean) => void;
}

export const PaymentSelector = ({ onPaymentMethodSelected }: PaymentSelectorProps) => {
  const [isCashPayment, setIsCashPayment] = useState<boolean>(false);

  const handlePaymentSelect = (value: boolean) => {
    setIsCashPayment(value);
    onPaymentMethodSelected(value);
  };

  return (
    <View className="rounded-lg p-4">
      <Text className="mb-4 text-lg font-bold">Método de Pago</Text>

      <View className="flex-row justify-around">
        <TouchableOpacity
          onPress={() => handlePaymentSelect(true)}
          className={`items-center rounded-lg p-4 ${isCashPayment ? 'bg-green-100' : ''}`}>
          <Cash />
          <Text
            className={`mt-2 font-medium ${isCashPayment ? 'text-green-600' : 'text-gray-600'}`}>
            Efectivo
          </Text>
          <Text className="mt-1 text-center text-xs text-gray-500">Pago al recibir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
