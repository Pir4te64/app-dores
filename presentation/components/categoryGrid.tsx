import React from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { MoreHorizontal } from 'lucide-react-native';

import { Category } from '~/domain/entities/categoryEntity';
import { Card } from '~/presentation/components/card';
import { getThemedStyles } from '~/presentation/styles/theme';
import { GlobalText } from './GlobalText';

interface CategoryGridProps {
  categories: Category[];
  onCategoryPress?: (category: Category) => void;
  onViewAllPress?: () => void;
}

export const CategoryGrid = ({
  categories,
  onViewAllPress,
  onCategoryPress,
}: CategoryGridProps) => {
  const theme = getThemedStyles();
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 48) / 3; // 3 columnas con espaciado
  const cardHeight = 120;
  const itemsPerRow = 3;
  const rowsToShow = 2;

  const visibleItems =
    itemsPerRow * rowsToShow - (categories.length > itemsPerRow * rowsToShow ? 1 : 0);

  const ViewAllCard = () => (
    <TouchableOpacity
      style={{
        height: cardHeight,
        width: cardWidth,
        borderRadius: 16,
        backgroundColor: 'white',
        padding: 12,
        margin: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderStyle: 'dashed',
      }}
      onPress={onViewAllPress}
      activeOpacity={0.8}>
      
      <View className="flex-1 items-center justify-between">
        {/* Icono de más opciones */}
        <View 
          className="rounded-full p-3 mb-2"
          style={{ backgroundColor: `${theme.primaryColor}20` }}>
          <MoreHorizontal size={32} color={theme.primaryColor} />
        </View>
        
        {/* Texto "Ver más" */}
        <GlobalText
          className="text-center text-sm font-bold"
          numberOfLines={2}
          style={{
            color: theme.primaryColor,
            width: '100%',
            lineHeight: 16,
          }}>
          Ver más
        </GlobalText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="my-6">
      {/* Título de la sección */}
      <View className="mb-4 px-4">
        <GlobalText className="text-xl font-bold" style={{ color: '#2D3436' }}>
          Categorías
        </GlobalText>
        <GlobalText className="text-sm text-gray-600 mt-1">
          Elige tu tipo de comida favorita
        </GlobalText>
      </View>

      {/* Grid de categorías */}
      <View className="flex flex-row flex-wrap px-2">
        {categories.slice(0, visibleItems).map((item) => (
          <Card
            key={item.id}
            footerText={item.name}
            onPress={() => onCategoryPress?.(item)}
            categoryType={item.name}
          />
        ))}

        <ViewAllCard />
      </View>
    </View>
  );
};
