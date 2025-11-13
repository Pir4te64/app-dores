import { icons, LucideProps } from 'lucide-react-native';
import React from 'react';
import { View, Dimensions, Image, TouchableOpacity } from 'react-native';

import { GlobalText } from './GlobalText';
import { getThemedStyles } from '~/presentation/styles/theme';

interface CardProps {
  iconName?: string;
  image?: string;
  footerText: string;
  onPress?: () => void;
  categoryType?: string;
}

interface IconProps extends LucideProps {
  name: keyof typeof icons;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name];
  return <LucideIcon {...props} />;
};

// Mapeo de categorías a iconos específicos de comida
const getCategoryIcon = (categoryName: string): keyof typeof icons => {
  const name = categoryName.toLowerCase();

  // Categorías principales
  if (name.includes('almuerzo') || name.includes('lunch')) return 'Sun';
  if (name.includes('desayuno') || name.includes('breakfast')) return 'Coffee';
  if (name.includes('cena') || name.includes('dinner')) return 'Moon';
  if (name.includes('postre') || name.includes('dessert')) return 'Cake';
  if (name.includes('bebida') || name.includes('drink')) return 'Wine';

  // Categorías específicas de comida
  if (name.includes('pizza')) return 'CircleDot';
  if (name.includes('hamburguesa') || name.includes('burger')) return 'Beef';
  if (name.includes('sushi')) return 'Fish';
  if (name.includes('taco') || name.includes('mexican')) return 'Star';
  if (name.includes('pasta') || name.includes('italian')) return 'Flame';
  if (name.includes('salad') || name.includes('ensalada')) return 'Leaf';
  if (name.includes('sandwich')) return 'Square';
  if (name.includes('soup') || name.includes('sopa')) return 'CircleDot';
  if (name.includes('chicken') || name.includes('pollo')) return 'Zap';
  if (name.includes('seafood') || name.includes('marisco')) return 'Fish';
  if (name.includes('vegetarian') || name.includes('vegetariano')) return 'Leaf';
  if (name.includes('vegan')) return 'Leaf';
  if (name.includes('fast') || name.includes('rápida')) return 'Zap';
  if (name.includes('healthy') || name.includes('saludable')) return 'Heart';
  if (name.includes('snack') || name.includes('aperitivo')) return 'Star';

  // Default fallback - icono más genérico
  return 'ChefHat';
};

// Colores específicos para cada tipo de categoría
const getCategoryColor = (categoryName: string): string => {
  const name = categoryName.toLowerCase();

  if (name.includes('almuerzo') || name.includes('lunch')) return '#FF6B35'; // Naranja
  if (name.includes('desayuno') || name.includes('breakfast')) return '#FFD93D'; // Amarillo
  if (name.includes('cena') || name.includes('dinner')) return '#6C5CE7'; // Púrpura
  if (name.includes('postre') || name.includes('dessert')) return '#FD79A8'; // Rosa
  if (name.includes('bebida') || name.includes('drink')) return '#00B894'; // Verde agua
  if (name.includes('pizza')) return '#E17055'; // Rojo pizza
  if (name.includes('hamburguesa') || name.includes('burger')) return '#D63031'; // Rojo
  if (name.includes('sushi')) return '#74B9FF'; // Azul
  if (name.includes('taco') || name.includes('mexican')) return '#FDCB6E'; // Amarillo mexicano
  if (name.includes('pasta') || name.includes('italian')) return '#E84393'; // Rosa italiano
  if (name.includes('salad') || name.includes('ensalada')) return '#00B894'; // Verde
  if (name.includes('sandwich')) return '#FDCB6E'; // Amarillo
  if (name.includes('soup') || name.includes('sopa')) return '#A29BFE'; // Púrpura claro
  if (name.includes('chicken') || name.includes('pollo')) return '#FDCB6E'; // Amarillo
  if (name.includes('seafood') || name.includes('marisco')) return '#74B9FF'; // Azul mar
  if (name.includes('vegetarian') || name.includes('vegetariano')) return '#00B894'; // Verde
  if (name.includes('vegan')) return '#00B894'; // Verde
  if (name.includes('fast') || name.includes('rápida')) return '#FDCB6E'; // Amarillo
  if (name.includes('healthy') || name.includes('saludable')) return '#00B894'; // Verde
  if (name.includes('snack') || name.includes('aperitivo')) return '#FDCB6E'; // Amarillo

  // Default color
  return '#636E72'; // Gris
};

export const Card = ({ iconName, image, footerText, onPress }: CardProps) => {
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 48) / 3; // 3 columnas con espaciado
  const cardHeight = 120; // Más alto para mejor proporción

  const categoryColor = getCategoryColor(footerText);
  const categoryIcon = getCategoryIcon(footerText);

  const renderIcon = () => {
    if (!iconName && image) {
      return (
        <Image
          source={{ uri: image }}
          width={cardWidth * 0.4}
          height={cardHeight * 0.4}
          style={{ alignSelf: 'center' }}
        />
      );
    }
    return <Icon name={categoryIcon} size={32} color={categoryColor} />;
  };

  return (
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
      }}
      onPress={onPress}
      activeOpacity={0.8}>
      <View className="flex-1 items-center justify-between">
        {/* Icono con fondo de color */}
        <View className="mb-2 rounded-full p-3" style={{ backgroundColor: `${categoryColor}20` }}>
          {renderIcon()}
        </View>

        {/* Texto de la categoría */}
        <GlobalText
          className="text-center text-sm font-bold"
          numberOfLines={2}
          style={{
            color: '#2D3436',
            width: '100%',
            lineHeight: 16,
          }}>
          {footerText}
        </GlobalText>
      </View>
    </TouchableOpacity>
  );
};
