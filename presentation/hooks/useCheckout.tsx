import { useNavigation } from '@react-navigation/native';
import { useState, useEffect, useCallback } from 'react';
import { Alert, Linking } from 'react-native';

import { Address } from '~/domain/entities/addressEntity';
import { Order } from '~/domain/entities/orderEntity';
import { MenuItem } from '~/domain/repositories/iorderRepository';
import { OrderService } from '~/domain/services/orderService';
import { useCart } from '~/presentation/context/cartContext';
import { useUser } from '~/presentation/context/userContext';

export const useCheckout = () => {
  const { items, orderId, clearCart, updateItemQuantity } = useCart();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isCashPayment, setIsCashPayment] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderUpdating, setOrderUpdating] = useState(false);
  const [orderItemIdMap, setOrderItemIdMap] = useState<Record<number, number>>({});
  const router = useNavigation();
  const orderService = OrderService.getInstance();

  const calculateTotal = useCallback(
    (currentOrder: Order) => {
      if (!currentOrder) return;

      const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const total = itemsTotal + (currentOrder.costDelivery || 0) + (currentOrder.costFee || 0);
      setTotalAmount(total);
    },
    [items]
  );

  const obtainOrder = useCallback(async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const order = await orderService.getOrderById(orderId);
      setOrder(order.content[0]);

      calculateTotal(order.content[0]);
    } catch {
      Alert.alert('Error', 'No se pudo obtener la orden');
    } finally {
      setLoading(false);
    }
  }, [orderId, items, calculateTotal]);

  const getCurrentQuantitiesSnapshot = useCallback(() => {
    return items.reduce(
      (acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      },
      {} as Record<number, number>
    );
  }, [items]);

  useEffect(() => {
    if (order?.detailsOrder && items.length > 0) {
      const newMapping: Record<number, number> = { ...orderItemIdMap };

      order.detailsOrder.forEach((detail) => {
        const matchingItem = items.find(
          (item) => !orderItemIdMap[item.id] && item.quantity === detail.quantity
        );

        if (matchingItem) {
          newMapping[matchingItem.id] = detail.id;
        }
      });

      if (Object.keys(newMapping).length !== Object.keys(orderItemIdMap).length) {
        setOrderItemIdMap(newMapping);
      }
    }
  }, [order?.detailsOrder, items, orderItemIdMap]);

  const prepareOrderDetails = useCallback((): MenuItem[] => {
    const details = items.map((item) => {
      const orderDetail = {
        idMenu: item.id,
        quantity: item.quantity,
        observaciones: [item.observations || ''],
      };
      return orderDetail;
    });
    return details;
  }, [items, orderItemIdMap]);

  useEffect(() => {
    obtainOrder();
  }, [orderId, obtainOrder]);

  const shouldUpdateOrder = useCallback(() => {
    if (!orderId) return false;

    getCurrentQuantitiesSnapshot();
    return false;
  }, [getCurrentQuantitiesSnapshot, orderId]);
  const updateOrderWithCurrentItems = async (address?: Address) => {
    if (!orderId || items.length === 0) {
      return false;
    }

    if (!validateCommerceConsistency()) {
      return false;
    }

    const deliveryAddress = address || selectedAddress || user?.address;
    if (!deliveryAddress?.id) {
      return false;
    }

    try {
      setOrderUpdating(true);
      const detailsOrder = prepareOrderDetails();

      const params = {
        idCommerce: items[0].commerceId,
        delivery: true,
        addProduct: false,
        usePositiveBalance: false,
        floor: deliveryAddress.floor || '',
        reference: deliveryAddress.reference || '',
        idDeliveryAddress: deliveryAddress.id,
        idOrder: orderId,
        orderRequests: detailsOrder,
      };

      await orderService.updateOrder(params);
      await obtainOrder();
      return true;
    } catch {
      Alert.alert('Disculpe', 'Error al actualizar el pedido');
      return false;
    } finally {
      setOrderUpdating(false);
    }
  };
  useEffect(() => {
    if (items.length > 0 && orderId && shouldUpdateOrder()) {
      updateOrderWithCurrentItems();
    }
  }, [items, updateOrderWithCurrentItems, orderId, shouldUpdateOrder]);

  useEffect(() => {
    obtainOrder();
  }, [orderId, obtainOrder]);

  const handleAddressSelected = useCallback(
    (address: Address) => {
      setSelectedAddress(address);

      if (orderId && items.length > 0) {
        updateOrderWithCurrentItems(address);
      }
    },
    [orderId, items, updateOrderWithCurrentItems]
  );

  const handlePaymentMethodSelected = useCallback((cashPayment: boolean) => {
    setIsCashPayment(cashPayment);
  }, []);

  const handleQuantityChange = useCallback(
    (itemId: number, newQuantity: number, observations?: string) => {
      if (newQuantity > 0) {
        updateItemQuantity(itemId, newQuantity, observations);
      }
    },
    [updateItemQuantity]
  );

  const openLink = useCallback(
    async (paymentLink: string) => {
      const canOpen = await Linking.canOpenURL(paymentLink);
      if (!canOpen) {
        Alert.alert('Error', 'No se puede abrir el enlace de pago');
      } else {
        await Linking.openURL(paymentLink);
        clearCart();
      }
    },
    [clearCart]
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
    if (!validateCommerceConsistency()) {
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'El carrito está vacío');
      return;
    }

    if (!selectedAddress) {
      Alert.alert('Error', 'Selecciona una dirección de entrega');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para realizar un pedido');
      return;
    }

    setLoading(true);

    try {
      const updated = await updateOrderWithCurrentItems(selectedAddress);
      if (!updated) {
        setLoading(false);
        return;
      }

      const orderPayment = await orderService.createOrderPayment(orderId!, isCashPayment);
      orderPayment.checkoutOrder?.paymentLink != null
        ? await openLink(orderPayment.checkoutOrder?.paymentLink!)
        : router.goBack();
      clearCart();
    } catch {
      Alert.alert('Error', 'No se pudo crear el pedido');
    } finally {
      setLoading(false);
    }
  }, [
    items,
    selectedAddress,
    user,
    orderId,
    isCashPayment,
    updateOrderWithCurrentItems,
    openLink,
    validateCommerceConsistency,
  ]);
  const handleCancelOrder = useCallback(async () => {
    if (!orderId) throw Alert.alert('Disculpe', 'No pudimos cancelar su pedido.');
    const response = await orderService.cancelOrder(orderId);
    if (response.description.includes(`Order with ID ${orderId} deleted successfully`)) clearCart();
  }, [orderId]);

  return {
    items,
    order,
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
  };
};
