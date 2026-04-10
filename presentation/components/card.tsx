import React from 'react';
import { View, Dimensions, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { GlobalText } from './GlobalText';

// Custom category icons
const CATEGORY_ICONS: { [key: string]: any } = {
  hamburguesas: require('../../assets/category-01.png'),
  pizza: require('../../assets/category-02.png'),
  pollos: require('../../assets/category-03.png'),
  nuggets: require('../../assets/category-04.png'),
  alitas: require('../../assets/category-05.png'),
  combos: require('../../assets/category-06.png'),
  default: require('../../assets/category-07.png'),
};

interface CardProps {
  iconName?: string;
  image?: string;
  footerText: string;
  onPress?: () => void;
  categoryType?: string;
}

// Get category icon based on name
const getCategoryIcon = (categoryName: string): any => {
  const name = categoryName.toLowerCase();

  if (name.includes('hamburguesa') || name.includes('burger')) {
    return CATEGORY_ICONS.hamburguesas;
  }
  if (name.includes('pizza')) {
    return CATEGORY_ICONS.pizza;
  }
  if (name.includes('pollo') || name.includes('chicken') || name.includes('broaster')) {
    return CATEGORY_ICONS.pollos;
  }
  if (name.includes('nugget') || name.includes('papas') || name.includes('snack')) {
    return CATEGORY_ICONS.nuggets;
  }
  if (name.includes('alita') || name.includes('wing')) {
    return CATEGORY_ICONS.alitas;
  }
  if (name.includes('combo') || name.includes('promo')) {
    return CATEGORY_ICONS.combos;
  }
  if (name.includes('ensalada') || name.includes('salad')) {
    return CATEGORY_ICONS.default;
  }
  if (name.includes('bebida') || name.includes('drink')) {
    return CATEGORY_ICONS.default;
  }
  if (name.includes('postre') || name.includes('dessert')) {
    return CATEGORY_ICONS.default;
  }

  return CATEGORY_ICONS.default;
};

export const Card = ({ iconName, image, footerText, onPress }: CardProps) => {
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 48) / 3;

  const categoryIcon = getCategoryIcon(footerText);

  const renderIcon = () => {
    // Always use local PNG icons matched by category name
    return (
      <Image
        source={categoryIcon}
        style={styles.categoryIcon}
        resizeMode="contain"
      />
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}>
      <View style={styles.content}>
        {/* Category Icon */}
        {renderIcon()}

        {/* Label */}
        <GlobalText
          style={styles.label}
          numberOfLines={2}>
          {footerText}
        </GlobalText>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 3;

const styles = StyleSheet.create({
  card: {
    height: 120,
    width: cardWidth,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 8,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  categoryIcon: {
    width: 64,
    height: 64,
  },
  externalImage: {
    width: 48,
    height: 48,
  },
  label: {
    color: '#2D3436',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 13,
  },
});
