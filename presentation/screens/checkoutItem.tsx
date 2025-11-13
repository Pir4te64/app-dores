import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import { CartItem } from '~/context/cartContext';

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

  return (
    <View className="mb-4 rounded-lg p-4">
      <View className="flex-row items-center gap-x-2">
        <Image
          source={{ uri: item.image[0].url }}
          className="mr-2 h-24 w-24 rounded-lg"
          style={{ objectFit: 'cover' }}
        />
        <View className="flex-1">
          <View className="flex-row justify-between">
            <Text className="w-[70%] text-lg font-bold">{item.name}</Text>
            <Text className="text-lg font-medium">${item.price}</Text>
          </View>
          <Text className="text-sm text-gray-600">{item.observations}</Text>
          {onQuantityChange && (
            <View className="mt-2 flex-row items-center justify-end">
              <TouchableOpacity
                onPress={handleDecrement}
                className="h-8 w-8 items-center justify-center rounded-full bg-[#F4F4F4]">
                <Text className="text-xl font-bold">-</Text>
              </TouchableOpacity>
              <Text className="mx-2 text-lg font-semibold">{item.quantity}</Text>
              <TouchableOpacity
                onPress={handleIncrement}
                className="h-8 w-8 items-center justify-center rounded-full bg-[#F4F4F4]">
                <Text className="text-xl font-bold">+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
