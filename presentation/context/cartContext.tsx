import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

import { Menu } from '~/domain/entities/menuEntity';
import { OrderEntity } from '~/domain/entities/orderEntity';
import { OrderService } from '~/domain/services/orderService';
import { AsyncStorageService } from '~/infrastructure/storage/asyncStorageService';

const CART_STORAGE_KEY = 'cart_items';
const ORDER_ID_KEY = 'current_order_id';
const MAX_QUANTITY = 99;
const MIN_QUANTITY = 1;

export interface CartItem extends Menu {
  quantity: number;
  observations?: string;
  commerceId: number;
}

export interface CartContextType {
  items: CartItem[];
  orderId: number | null;
  order: OrderEntity | undefined;
  addItem: (
    item: Menu & { commerceId: number },
    quantity: number,
    observations?: string
  ) => Promise<void>;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  setOrderId: (id: number) => void;
  updateItemQuantity: (id: number, quantity: number, observations?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [order, setOrder] = useState<OrderEntity>();
  const orderService = OrderService.getInstance();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [savedCart, savedOrderId] = await Promise.all([
          AsyncStorageService.getItem(CART_STORAGE_KEY),
          AsyncStorageService.getItem(ORDER_ID_KEY),
        ]);

        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
        if (savedOrderId) {
          const parsedOrderId = JSON.parse(savedOrderId);
          setOrderId(parsedOrderId);
          const response = await orderService.getAllOrders();
          const savedOrder = response.content.find((o) => o.id === parsedOrderId);
          if (savedOrder) {
            setOrder(savedOrder);
          }
        }
      } catch (error) {
        console.error('Error loading cart data:', error);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await Promise.all([
          AsyncStorageService.setItem(CART_STORAGE_KEY, JSON.stringify(items)),
          AsyncStorageService.setItem(ORDER_ID_KEY, JSON.stringify(orderId)),
        ]);
      } catch (error) {
        console.error('Error saving cart data:', error);
      }
    };
    saveData();
  }, [items, orderId]);

  const setOrderIdCallback = useCallback(async (id: number) => {
    setOrderId(id);
    try {
      const response = await orderService.getAllOrders();
      const savedOrder = response.content.find((o) => o.id === id);
      if (savedOrder) {
        setOrder(savedOrder);
      }
    } catch (error) {
      console.error('Error loading order:', error);
    }
  }, []);

  const addItem = useCallback(
    async (item: Menu & { commerceId: number }, quantity: number, observations?: string) => {
      if (quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
        throw new Error(`Quantity must be between ${MIN_QUANTITY} and ${MAX_QUANTITY}`);
      }

      if (items.length > 0 && items[0].commerceId !== item.commerceId) {
        throw new Error('DIFFERENT_COMMERCE');
      }

      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (i) => i.id === item.id && i.observations === observations
        );

        if (existingItem) {
          return currentItems.map((i) =>
            i.id === item.id && i.observations === observations
              ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QUANTITY) }
              : i
          );
        }

        return [...currentItems, { ...item, quantity, observations: observations || '' }];
      });
    },
    [items]
  );

  const removeItem = useCallback((itemId: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: number, quantity: number, observations?: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId && item.observations === observations ? { ...item, quantity } : item
      )
    );
  }, []);

  const updateItemQuantity = useCallback((id: number, quantity: number, observations?: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.observations === observations ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setOrderId(null);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        orderId,
        order,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        setOrderId: setOrderIdCallback,
        updateItemQuantity,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
