import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';

import { CartItem } from '~/context/cartContext';

const PRIMARY_RED = '#DA2919';

interface CheckoutItemProps {
  item: CartItem;
  onQuantityChange?: (quantity: number, observations?: string) => void;
}

export const CheckoutItem = ({ item, onQuantityChange }: CheckoutItemProps) => {
  const handleIncrement = () => {
    if (onQuantityChange) {
      onQuantityChange(item.quantity + 1, item.observations);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1 && onQuantityChange) {
      onQuantityChange(item.quantity - 1, item.observations);
    }
  };

  const handleRemove = () => {
    if (onQuantityChange) {
      onQuantityChange(0, item.observations);
    }
  };

  const totalPrice = item.price * item.quantity;

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={{ uri: item.image[0]?.url || 'https://via.placeholder.com/80' }}
        style={styles.image}
      />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <TouchableOpacity onPress={handleRemove} style={styles.deleteButton}>
            <Trash2 size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {item.observations ? (
          <Text style={styles.observations} numberOfLines={1}>
            📝 {item.observations}
          </Text>
        ) : null}

        <View style={styles.footer}>
          {/* Quantity Controls */}
          {onQuantityChange && (
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={[styles.quantityButton, item.quantity === 1 && styles.quantityButtonDisabled]}
                onPress={handleDecrement}
                disabled={item.quantity === 1}>
                <Minus size={16} color={item.quantity === 1 ? '#CCC' : PRIMARY_RED} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrement}>
                <Plus size={16} color={PRIMARY_RED} />
              </TouchableOpacity>
            </View>
          )}

          {/* Price */}
          <Text style={styles.price}>${totalPrice}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3436',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  observations: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  quantityButtonDisabled: {
    backgroundColor: '#F5F5F5',
    shadowOpacity: 0,
    elevation: 0,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3436',
    marginHorizontal: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: PRIMARY_RED,
  },
});
