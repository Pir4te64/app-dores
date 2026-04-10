import { useNavigation } from '@react-navigation/native';
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

import { Address } from '~/domain/entities/addressEntity';
import { OrderService } from '~/domain/services/orderService';
import { CommerceSupabaseService } from '~/domain/services/supabase/commerceService';
import { CheckoutDataService } from '~/domain/services/supabase/checkoutDataService';
import { DbPaymentMethod, DbDeliveryZone, DbExchangeRate } from '~/domain/entities/supabaseTypes';
import { useCart } from '~/presentation/context/cartContext';
import { useUser } from '~/presentation/context/userContext';
import { useOrderEvents } from '~/presentation/context/orderContext';

export const useCheckout = () => {
  const { items, clearCart, updateItemQuantity, removeItem } = useCart();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isCashPayment, setIsCashPayment] = useState<boolean>(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderUpdating, setOrderUpdating] = useState(false);

  // Supabase checkout data
  const [paymentMethods, setPaymentMethods] = useState<DbPaymentMethod[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DbDeliveryZone[]>([]);
  const [exchangeRate, setExchangeRate] = useState<DbExchangeRate | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<DbPaymentMethod | null>(null);
  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState<DbDeliveryZone | null>(null);

  const router = useNavigation();
  const orderService = OrderService.getInstance();
  const checkoutDataService = CheckoutDataService.getInstance();
  const commerceService = CommerceSupabaseService.getInstance();
  const { notifyOrdersChanged } = useOrderEvents();

  // Load checkout data from Supabase
  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const commerceId = await commerceService.getCommerceId();
        const [methods, zones, rate] = await Promise.all([
          checkoutDataService.getPaymentMethods(commerceId),
          checkoutDataService.getDeliveryZones(commerceId),
          checkoutDataService.getExchangeRate(commerceId),
        ]);
        setPaymentMethods(methods);
        setDeliveryZones(zones);
        setExchangeRate(rate);

        if (methods.length > 0) setSelectedPaymentMethod(methods[0]);
        if (zones.length > 0) setSelectedDeliveryZone(zones[0]);
      } catch (err) {
        console.error('Error loading checkout data:', err);
      }
    };

    loadCheckoutData();
  }, []);

  const calculateTotal = useCallback(() => {
    const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCost = selectedDeliveryZone?.delivery_fee || 0;
    setTotalAmount(itemsTotal + deliveryCost);
  }, [items, selectedDeliveryZone]);

  useEffect(() => {
    calculateTotal();
  }, [items, calculateTotal]);

  const handleAddressSelected = useCallback((address: Address) => {
    setSelectedAddress(address);
  }, []);

  const handlePaymentMethodSelected = useCallback((cashPayment: boolean) => {
    setIsCashPayment(cashPayment);
  }, []);

  const handleQuantityChange = useCallback(
    (itemId: number, newQuantity: number, observations?: string) => {
      if (newQuantity === 0) {
        removeItem(itemId);
      } else if (newQuantity > 0) {
        updateItemQuantity(itemId, newQuantity, observations);
      }
    },
    [updateItemQuantity, removeItem]
  );

  const validateCommerceConsistency = useCallback(() => {
    if (items.length === 0) return true;

    const commerceIds = new Set(items.map((item) => item.commerceId));
    if (commerceIds.size > 1) {
      clearCart();
      Alert.alert('Error', 'No se pueden mezclar productos de diferentes comercios');
      return false;
    }

    return true;
  }, [items, clearCart]);

  const handleCreateOrder = useCallback(async () => {
    if (!validateCommerceConsistency()) return;

    if (items.length === 0) {
      Alert.alert('Error', 'El carrito está vacío');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para realizar un pedido');
      return;
    }

    setLoading(true);

    try {
      const commerceId = await commerceService.getCommerceId();
      const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const deliveryCost = selectedDeliveryZone?.delivery_fee || 0;
      const total = itemsTotal + deliveryCost;
      const rate = exchangeRate?.rate || 0;
      const totalBs = rate > 0 ? total * rate : undefined;

      const newOrder = await orderService.createOrder({
        commerceId,
        orderType: selectedAddress ? 'DELIVERY' : 'IN_STORE',
        customerFirstName: user.firstName,
        customerLastName: user.lastName,
        customerPhone: user.numberPhone || '',
        total,
        costDelivery: deliveryCost,
        paymentMethod: selectedPaymentMethod?.name || 'EFECTIVO_DIVISAS',
        deliveryZoneId: selectedDeliveryZone?.id,
        deliveryAddress: selectedAddress?.streets || '',
        deliveryLatitude: selectedAddress?.latitude || '',
        deliveryLongitude: selectedAddress?.longitude || '',
        exchangeRate: rate || undefined,
        totalBs,
        items: items.map((item) => ({
          productId: String(item.id),
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: item.price * item.quantity,
          observations: item.observations ? [item.observations] : undefined,
        })),
      });

      notifyOrdersChanged();
      clearCart();

      Alert.alert(
        '¡Pedido creado!',
        `Tu orden está siendo procesada.\n\nTotal: $${total.toFixed(2)}${totalBs ? `\nTotal Bs: ${totalBs.toFixed(2)}` : ''}`,
        [{ text: 'Ver pedidos', onPress: () => router.goBack() }]
      );
    } catch (err) {
      console.error('Error creating order:', err);
      Alert.alert('Error', 'No se pudo crear el pedido');
    } finally {
      setLoading(false);
    }
  }, [
    items,
    selectedAddress,
    user,
    selectedPaymentMethod,
    selectedDeliveryZone,
    exchangeRate,
    validateCommerceConsistency,
    clearCart,
    notifyOrdersChanged,
    router,
  ]);

  const handleCancelOrder = useCallback(async () => {
    clearCart();
  }, [clearCart]);

  return {
    items,
    order: null,
    loading,
    orderUpdating,
    selectedAddress,
    isCashPayment,
    totalAmount,
    paymentMethods,
    deliveryZones,
    exchangeRate,
    selectedPaymentMethod,
    selectedDeliveryZone,
    setSelectedPaymentMethod,
    setSelectedDeliveryZone,
    handleAddressSelected,
    handlePaymentMethodSelected,
    handleQuantityChange,
    handleCreateOrder,
    handleCancelOrder,
  };
};
