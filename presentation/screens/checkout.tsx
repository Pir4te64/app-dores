import { useNavigation } from '@react-navigation/native';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import { useState } from 'react';
import { MapPin, Truck, CreditCard, ShoppingBag, Trash2 } from 'lucide-react-native';

import { CheckoutItem } from './checkoutItem';

import { GlobalText } from '~/presentation/components/GlobalText';
import { DeliveryAddressSelector } from '~/presentation/components/addressSelector';
import { PaymentSelector } from '~/presentation/components/paymentSelector';
import { useCheckout } from '~/presentation/hooks/useCheckout';

const PRIMARY_RED = '#DA2919';

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
  const [showVES, setShowVES] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState(false);

  const getVESRate = async () => {
    try {
      setRateLoading(true);
      const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=VES');
      const json = await res.json();
      const rate = json?.rates?.VES;
      if (typeof rate === 'number' && rate > 0) {
        setExchangeRate(rate);
      } else {
        setExchangeRate(40);
      }
    } catch (e) {
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
      return `Bs. ${ves.toFixed(0)}`;
    }
    return `$${usd.toFixed(0)}`;
  };

  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCost = totalAmount - itemsTotal;
  const serviceFee = 0;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    // handleCreateOrder handles both demo mode (cash/card) and real mode
    await handleCreateOrder();
  };

  const cancelOrder = async () => {
    Alert.alert('¿Estás seguro?', 'Tu orden será cancelada', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: async () => {
          await handleCancelOrder();
          router.goBack();
        },
      },
    ]);
  };

  // Empty Cart State
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ShoppingBag size={80} color="#DDD" />
          <GlobalText variant="bold" style={styles.emptyTitle}>
            Tu carrito está vacío
          </GlobalText>
          <Text style={styles.emptySubtitle}>
            Agrega productos para comenzar tu pedido
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.goBack()}>
            <Text style={styles.exploreButtonText}>Explorar menú</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <GlobalText variant="bold" style={styles.title}>Tu carrito</GlobalText>
          <Text style={styles.itemCount}>{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</Text>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <MapPin size={18} color={PRIMARY_RED} />
            </View>
            <GlobalText style={styles.sectionTitle}>Dirección de entrega</GlobalText>
          </View>
          <DeliveryAddressSelector onAddressSelected={handleAddressSelected} />
        </View>

        {/* Items Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <ShoppingBag size={18} color={PRIMARY_RED} />
            </View>
            <GlobalText style={styles.sectionTitle}>Productos</GlobalText>
          </View>
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

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <CreditCard size={18} color={PRIMARY_RED} />
            </View>
            <GlobalText style={styles.sectionTitle}>Método de pago</GlobalText>
          </View>
          <PaymentSelector onPaymentMethodSelected={handlePaymentMethodSelected} />
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen del pedido</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatAmount(itemsTotal)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelRow}>
              <Truck size={16} color="#666" />
              <Text style={styles.summaryLabel}>Envío</Text>
            </View>
            <Text style={[styles.summaryValue, deliveryCost === 0 && styles.freeDelivery]}>
              {deliveryCost === 0 ? 'Gratis' : formatAmount(deliveryCost)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Servicio</Text>
            <Text style={styles.summaryValue}>{formatAmount(serviceFee)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatAmount(totalAmount)}</Text>
          </View>

          {/* Currency Toggle */}
          <TouchableOpacity style={styles.currencyToggle} onPress={toggleCurrency}>
            <Text style={styles.currencyToggleText}>
              {showVES ? 'Ver en USD 💵' : 'Ver en Bolívares 🇻🇪'}
            </Text>
            {rateLoading && <ActivityIndicator size="small" style={{ marginLeft: 8 }} />}
          </TouchableOpacity>
        </View>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelButton} onPress={cancelOrder}>
          <Trash2 size={18} color="#999" />
          <Text style={styles.cancelButtonText}>Cancelar pedido</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomTotal}>
          <Text style={styles.bottomTotalLabel}>Total</Text>
          <Text style={styles.bottomTotalValue}>{formatAmount(totalAmount)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            (!selectedAddress || loading) && styles.checkoutButtonDisabled,
          ]}
          onPress={handleCheckout}
          disabled={!selectedAddress || loading || orderUpdating}>
          {loading || orderUpdating ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.checkoutButtonText}>
              {isCashPayment ? 'Confirmar pedido' : 'Pagar con tarjeta'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffcfa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 160,
  },
  header: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    color: '#2D3436',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${PRIMARY_RED}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#2D3436',
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  freeDelivery: {
    color: '#22C55E',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: PRIMARY_RED,
  },
  currencyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  currencyToggleText: {
    fontSize: 13,
    color: '#666',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 6,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  bottomTotal: {
    marginRight: 16,
  },
  bottomTotalLabel: {
    fontSize: 12,
    color: '#999',
  },
  bottomTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3436',
  },
  checkoutButton: {
    flex: 1,
    backgroundColor: PRIMARY_RED,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#CCC',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  warningBanner: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: '#FEF3C7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    color: '#2D3436',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  exploreButton: {
    marginTop: 24,
    backgroundColor: PRIMARY_RED,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
