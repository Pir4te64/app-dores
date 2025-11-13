import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Star, Clock, Heart } from 'lucide-react-native';

import { ControlledTooltip } from './controlledTooltip';
import { GlobalText } from './GlobalText';

import { Menu } from '~/domain/entities/menuEntity';
import { getThemedStyles } from '~/presentation/styles/theme';

interface CardMenuListProps {
  menu: Menu;
  commerceId: number;
  commerceStatus?: boolean;
}

type RootStackParamList = {
  MenuItem: { item: Menu; commerceId: number };
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columnas con espaciado

export const CardMenuList = ({ menu, commerceId, commerceStatus = true }: CardMenuListProps) => {
  const theme = getThemedStyles();
  const navigate = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View className="mx-2 mb-4">
      <TouchableOpacity
        disabled={!commerceStatus}
        onPress={() => navigate.navigate('MenuItem', { item: menu, commerceId })}
        activeOpacity={0.8}>
        <View
          className={`rounded-2xl bg-white shadow-lg ${!commerceStatus ? 'opacity-50' : ''}`}
          style={{
            width: CARD_WIDTH,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 6,
          }}>
          
          {/* Imagen del producto */}
          <View className="relative">
            <Image
              source={{ uri: menu.image[0].url }}
              className="h-40 w-full rounded-t-2xl"
              style={{ objectFit: 'cover' }}
            />
            
            {/* Botón de favorito */}
            <TouchableOpacity 
              className="absolute right-2 top-2 rounded-full bg-white/80 p-2"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <Heart size={16} color={theme.primaryColor} />
            </TouchableOpacity>

            {/* Badge de disponibilidad */}
            <View 
              className="absolute left-2 top-2 rounded-full px-2 py-1"
              style={{ backgroundColor: commerceStatus ? theme.successColor : '#FF6B6B' }}>
              <GlobalText className="text-xs font-bold text-white">
                {commerceStatus ? 'Disponible' : 'Agotado'}
              </GlobalText>
            </View>
          </View>

          {/* Contenido de la tarjeta */}
          <View className="p-4">
            {/* Nombre del producto */}
            <GlobalText 
              className="text-lg font-bold text-gray-800 mb-2"
              numberOfLines={2}>
              {menu.name}
            </GlobalText>

            {/* Descripción */}
            <GlobalText 
              className="text-sm text-gray-600 mb-3"
              numberOfLines={2}>
              {menu.description}
            </GlobalText>

            {/* Precio y rating */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <GlobalText className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                  ${menu.price}
                </GlobalText>
                {menu.price && (
                  <GlobalText className="text-sm text-gray-500 ml-1">
                    /unidad
                  </GlobalText>
                )}
              </View>
              
              {/* Rating simulado */}
              <View className="flex-row items-center">
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <GlobalText className="text-sm text-gray-600 ml-1">4.5</GlobalText>
              </View>
            </View>

            {/* Restricciones dietéticas */}
            {menu.dietaryRestrictions && menu.dietaryRestrictions.length > 0 && (
              <View className="flex-row flex-wrap gap-1 mb-3">
                {menu.dietaryRestrictions.slice(0, 3).map((restriction) => (
                  <ControlledTooltip
                    key={restriction.id}
                    animationType="fade"
                    popover={<GlobalText>{restriction.name}</GlobalText>}
                    backgroundColor={theme.cardBackground}>
                    <View className="rounded-full bg-gray-100 p-1">
                      <SvgUri uri={restriction.icon} height={16} width={16} />
                    </View>
                  </ControlledTooltip>
                ))}
                {menu.dietaryRestrictions.length > 3 && (
                  <View className="rounded-full bg-gray-100 px-2 py-1">
                    <GlobalText className="text-xs text-gray-600">
                      +{menu.dietaryRestrictions.length - 3}
                    </GlobalText>
                  </View>
                )}
              </View>
            )}

            {/* Tiempo estimado */}
            <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
              <View className="flex-row items-center">
                <Clock size={14} color={theme.primaryColor} />
                <GlobalText className="text-xs text-gray-600 ml-1">
                  15-25 min
                </GlobalText>
              </View>
              
              <GlobalText className="text-xs font-bold" style={{ color: theme.primaryColor }}>
                Ver detalles
              </GlobalText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
