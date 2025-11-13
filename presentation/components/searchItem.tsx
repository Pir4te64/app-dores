import React from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';

import { Commerce } from '~/domain/entities/commerceEntity';
import { Menu } from '~/domain/entities/menuEntity';

type SearchItemProps = {
  item: Commerce | Menu;
  onPress: (item: Commerce | Menu) => void;
};

export const SearchItem = ({ item, onPress }: SearchItemProps) => (
  <TouchableWithoutFeedback onPress={() => onPress(item)}>
    <View className="flex-row items-center border-b border-gray-200 p-2">
      <View className="h-16 w-16 overflow-hidden rounded-md">
        <Image
          source={{
            uri:
              'coverImage' in item
                ? item.coverImage
                : Array.isArray(item.image)
                  ? item.image[0].url
                  : item.image,
          }}
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />
      </View>
      <View className="flex-1 px-3">
        <Text className="text-base font-medium" numberOfLines={1}>
          {'businessName' in item ? item.businessName : item.name}
        </Text>
        {item.description && (
          <Text className="text-xs text-gray-500" numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
    </View>
  </TouchableWithoutFeedback>
);
