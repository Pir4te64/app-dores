import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Star, Clock, Heart } from 'lucide-react-native';

import { GlobalText } from './GlobalText';

import { Menu } from '~/domain/entities/menuEntity';
import { getThemedStyles } from '~/presentation/styles/theme';

interface CardMenuListProps {
  menu: Menu;
  commerceId: number;
  commerceStatus?: boolean;
  navigateToCommerce?: boolean;
}

type RootStackParamList = {
  MenuItem: { item: Menu; commerceId: number };
  CommerceDetail: { commerceId: number };
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const getImageSource = (menu: Menu) => {
  if (!menu.image || menu.image.length === 0 || !menu.image[0]?.url) {
    return { uri: 'https://via.placeholder.com/400x300/f5f5f5/999?text=Sin+imagen' };
  }
  const url = menu.image[0].url;
  if (typeof url === 'string') {
    return { uri: url };
  }
  return url; // require() returns a number
};

export const CardMenuList = ({ menu, commerceId, commerceStatus = true, navigateToCommerce = false }: CardMenuListProps) => {
  const theme = getThemedStyles();
  const navigate = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        disabled={!commerceStatus}
        onPress={() =>
          navigateToCommerce
            ? navigate.navigate('CommerceDetail', { commerceId })
            : navigate.navigate('MenuItem', { item: menu, commerceId })
        }
        activeOpacity={0.8}>
        <View style={[styles.card, !commerceStatus && styles.cardDisabled]}>

          {/* Imagen del producto */}
          <View style={styles.imageContainer}>
            <Image
              source={getImageSource(menu)}
              style={styles.image}
              resizeMode="contain"
            />

            {/* Botón de favorito */}
            <TouchableOpacity style={styles.heartButton}>
              <Heart size={14} color={theme.primaryColor} />
            </TouchableOpacity>

            {/* Badge de disponibilidad */}
            <View style={[styles.badge, { backgroundColor: commerceStatus ? '#27AE60' : '#FF6B6B' }]}>
              <GlobalText style={styles.badgeText}>
                {commerceStatus ? 'Disponible' : 'Agotado'}
              </GlobalText>
            </View>
          </View>

          {/* Contenido */}
          <View style={styles.content}>
            <GlobalText style={styles.name} numberOfLines={2}>
              {menu.name}
            </GlobalText>

            <GlobalText style={styles.description} numberOfLines={2}>
              {menu.description}
            </GlobalText>

            {/* Precio */}
            <View style={styles.priceRow}>
              <GlobalText style={[styles.price, { color: theme.primaryColor }]}>
                ${menu.price}
              </GlobalText>
              <View style={styles.ratingRow}>
                <Star size={12} color="#FFD700" fill="#FFD700" />
                <GlobalText style={styles.ratingText}>4.5</GlobalText>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.timeRow}>
                <Clock size={12} color={theme.primaryColor} />
                <GlobalText style={styles.timeText}>15-25 min</GlobalText>
              </View>
              <GlobalText style={[styles.detailsText, { color: theme.primaryColor }]}>
                Ver detalles
              </GlobalText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardDisabled: {
    opacity: 0.5,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    overflow: 'hidden',
    backgroundColor: '#F8F8F8',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 6,
  },
  badge: {
    position: 'absolute',
    left: 8,
    top: 8,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
    lineHeight: 15,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 10,
    color: '#666',
  },
  detailsText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
