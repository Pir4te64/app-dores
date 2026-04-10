import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Banknote, CreditCard, Check } from 'lucide-react-native';

import { GlobalText } from '~/presentation/components/GlobalText';

const PRIMARY_RED = '#DA2919';

interface PaymentSelectorProps {
  onPaymentMethodSelected: (isCashPayment: boolean) => void;
}

export const PaymentSelector = ({ onPaymentMethodSelected }: PaymentSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'card' | null>(null);

  const handlePaymentSelect = (method: 'cash' | 'card') => {
    setSelectedMethod(method);
    // Pass true if cash selected, false if card selected
    onPaymentMethodSelected(method === 'cash');
  };

  return (
    <View style={styles.container}>
      {/* Cash Option */}
      <TouchableOpacity
        style={[
          styles.option,
          selectedMethod === 'cash' && styles.optionSelected,
        ]}
        onPress={() => handlePaymentSelect('cash')}
        activeOpacity={0.7}>
        <View style={[
          styles.iconContainer,
          selectedMethod === 'cash' && styles.iconContainerSelected,
        ]}>
          <Banknote size={28} color={selectedMethod === 'cash' ? '#FFF' : '#666'} />
        </View>
        <View style={styles.textContainer}>
          <GlobalText style={[
            styles.title,
            selectedMethod === 'cash' && styles.titleSelected,
          ]}>Efectivo</GlobalText>
          <Text style={styles.subtitle}>Pago al recibir</Text>
        </View>
        {selectedMethod === 'cash' && (
          <View style={styles.checkmark}>
            <Check size={18} color="#FFF" />
          </View>
        )}
      </TouchableOpacity>

      {/* Card Option */}
      <TouchableOpacity
        style={[
          styles.option,
          selectedMethod === 'card' && styles.optionSelected,
        ]}
        onPress={() => handlePaymentSelect('card')}
        activeOpacity={0.7}>
        <View style={[
          styles.iconContainer,
          selectedMethod === 'card' && styles.iconContainerSelected,
        ]}>
          <CreditCard size={28} color={selectedMethod === 'card' ? '#FFF' : '#666'} />
        </View>
        <View style={styles.textContainer}>
          <GlobalText style={[
            styles.title,
            selectedMethod === 'card' && styles.titleSelected,
          ]}>Tarjeta</GlobalText>
          <Text style={styles.subtitle}>
            Débito o crédito
          </Text>
        </View>
        {selectedMethod === 'card' && (
          <View style={styles.checkmark}>
            <Check size={18} color="#FFF" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionSelected: {
    borderColor: PRIMARY_RED,
    backgroundColor: '#FFF9F8',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconContainerSelected: {
    backgroundColor: PRIMARY_RED,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
  },
  titleSelected: {
    color: PRIMARY_RED,
  },
  subtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PRIMARY_RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
