import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { icons, LucideProps } from 'lucide-react-native';

import { GlobalText } from './GlobalText';
import { Subcategory } from '~/presentation/data/subcategories';

interface IconProps extends LucideProps {
  name: keyof typeof icons;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name];
  return <LucideIcon {...props} />;
};

interface SubcategoryCardProps {
  subcategory: Subcategory;
  onPress: (subcategory: Subcategory) => void;
}

export const SubcategoryCard: React.FC<SubcategoryCardProps> = ({
  subcategory,
  onPress,
}) => {
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 48) / 2; // 2 columnas con espaciado
  const cardHeight = 140; // Altura optimizada para subcategorías

  return (
    <TouchableOpacity
      style={{
        height: cardHeight,
        width: cardWidth,
        borderRadius: 16,
        backgroundColor: 'white',
        padding: 16,
        margin: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
      }}
      onPress={() => onPress(subcategory)}
      activeOpacity={0.8}>
      
      <View className="flex-1 items-center justify-between">
        {/* Icono con fondo de color */}
        <View
          className="mb-3 rounded-full p-4"
          style={{ backgroundColor: `${subcategory.color}20` }}>
          <Icon 
            name={subcategory.icon as keyof typeof icons} 
            size={28} 
            color={subcategory.color} 
          />
        </View>
        
        {/* Texto de la subcategoría */}
        <View className="flex-1 items-center justify-center">
          <GlobalText
            className="text-center text-base font-bold mb-1"
            numberOfLines={2}
            style={{
              color: '#2D3436',
              width: '100%',
              lineHeight: 20,
            }}>
            {subcategory.name}
          </GlobalText>
          
          <GlobalText
            className="text-center text-xs"
            numberOfLines={2}
            style={{
              color: '#636E72',
              width: '100%',
              lineHeight: 16,
            }}>
            {subcategory.description}
          </GlobalText>
        </View>
      </View>
    </TouchableOpacity>
  );
};
