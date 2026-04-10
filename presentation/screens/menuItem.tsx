import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Minus, Plus, ShoppingCart, ArrowLeft, Clock, Star, Info } from 'lucide-react-native';

import { Menu } from '~/domain/entities/menuEntity';
import { useCart } from '~/presentation/context/cartContext';
import { GlobalText } from '~/presentation/components/GlobalText';

const PRIMARY_RED = '#DA2919';

export const MenuItem = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [count, setCount] = useState(1);
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const route = useRoute<RouteProp<{ params: { item: Menu; commerceId: number } }, 'params'>>();
  const { item, commerceId } = route.params;
  const { addItem, items, clearCart } = useCart();
  const [isCommerceOpen] = useState<boolean>(true);

  const handleIncrement = () => setCount((prev) => prev + 1);
  const handleDecrement = () => {
    if (count > 1) setCount((prev) => prev - 1);
  };

  const totalPrice = item.price * count;

  const handleAddToCart = async () => {
    try {
      setLoading(true);

      if (!isCommerceOpen) {
        Alert.alert('Comercio cerrado', 'Este comercio está cerrado. No es posible crear pedidos en este momento.');
        setLoading(false);
        return;
      }

      if (items.length > 0) {
        const firstCommerceId = items[0].commerceId;
        if (firstCommerceId !== commerceId) {
          Alert.alert(
            '¿Desea vaciar el carrito?',
            'No es posible agregar productos de diferentes comercios.',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Vaciar carrito',
                style: 'destructive',
                onPress: async () => {
                  clearCart();
                  await addItem(item, count, observations);
                  Alert.alert('Agregado', `${count}x ${item.name} agregado al carrito`, [
                    { text: 'OK', onPress: () => navigation.goBack() },
                  ]);
                },
              },
            ]
          );
          return;
        }
      }

      // Add item to cart directly (order is created at checkout)
      await addItem(item, count, observations);
      Alert.alert('Agregado', `${count}x ${item.name} agregado al carrito`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never">
        {/* Hero Image */}
        <ImageBackground
          source={
            typeof item?.image[0]?.url === 'string'
              ? { uri: item.image[0].url }
              : item?.image[0]?.url || { uri: 'https://via.placeholder.com/400x300' }
          }
          style={styles.heroContainer}
          imageStyle={styles.heroImage}
          resizeMode="cover">
          <View style={styles.heroGradient} />

          {/* Back Button */}
          <TouchableOpacity
            style={[styles.backButton, { top: insets.top + 8 }]}
            onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>

          {/* Price Badge */}
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>${item.price}</Text>
          </View>
        </ImageBackground>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <GlobalText variant="bold" style={styles.productName}>
              {item?.name}
            </GlobalText>

            {/* Rating & Time */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Star size={16} color="#FFB800" fill="#FFB800" />
                <Text style={styles.metaText}>4.8</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Clock size={16} color="#666" />
                <Text style={styles.metaText}>20-30 min</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <View style={styles.sectionHeader}>
              <Info size={18} color={PRIMARY_RED} />
              <Text style={styles.sectionTitle}>Descripción</Text>
            </View>
            <Text style={styles.description}>
              {item.description || 'Delicioso producto preparado con los mejores ingredientes.'}
            </Text>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Cantidad</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={[styles.quantityButton, count === 1 && styles.quantityButtonDisabled]}
                onPress={handleDecrement}
                disabled={count === 1}>
                <Minus size={20} color={count === 1 ? '#CCC' : PRIMARY_RED} />
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{count}</Text>
              </View>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrement}>
                <Plus size={20} color={PRIMARY_RED} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Observations */}
          <View style={styles.observationsSection}>
            <Text style={styles.sectionTitle}>Observaciones (opcional)</Text>
            <TextInput
              style={styles.observationsInput}
              placeholder="Ej: Sin cebolla, extra salsa..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              value={observations}
              onChangeText={setObservations}
            />
          </View>

          {/* Closed Notice */}
          {!isCommerceOpen && (
            <View style={styles.closedNotice}>
              <Text style={styles.closedText}>
                🔒 El comercio está cerrado. Intenta más tarde.
              </Text>
            </View>
          )}
        </View>

        {/* Spacer for bottom button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${totalPrice}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, !isCommerceOpen && styles.addButtonDisabled]}
          onPress={handleAddToCart}
          disabled={!isCommerceOpen || loading}
          activeOpacity={0.9}>
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <ShoppingCart size={22} color="#FFF" />
              <Text style={styles.addButtonText}>Agregar al carrito</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    width: '100%',
    height: 280,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBadge: {
    position: 'absolute',
    bottom: -20,
    right: 20,
    backgroundColor: PRIMARY_RED,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: PRIMARY_RED,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  priceText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
  },
  contentCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 26,
    color: '#2D3436',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#DDD',
    marginHorizontal: 12,
  },
  descriptionSection: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${PRIMARY_RED}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  quantityDisplay: {
    width: 60,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3436',
  },
  observationsSection: {
    marginBottom: 20,
  },
  observationsInput: {
    marginTop: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#2D3436',
  },
  closedNotice: {
    backgroundColor: '#FEF3F2',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  closedText: {
    textAlign: 'center',
    color: '#DC2626',
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  totalContainer: {
    marginRight: 16,
  },
  totalLabel: {
    fontSize: 12,
    color: '#999',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3436',
  },
  addButton: {
    flex: 1,
    backgroundColor: PRIMARY_RED,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#CCC',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
