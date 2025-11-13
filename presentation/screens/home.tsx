import { NavigationProp, useNavigation } from '@react-navigation/native';
import { CheckCircleIcon, Search } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { useNotifications } from '../context/notificationContext';

import { Address } from '~/domain/entities/addressEntity';
import { useAddress } from '~/hooks/useAddress';
import { useCategories } from '~/hooks/useCategory';
import { useCommerces } from '~/hooks/useCommerces';
import { useHome } from '~/hooks/useHome';
import { useMenus } from '~/hooks/useMenus';
import { GlobalText } from '~/presentation/components/GlobalText';
import { AddressForm } from '~/presentation/components/addressForm';
import { UserAddressHeader } from '~/presentation/components/addressHeader';
import { AddressList } from '~/presentation/components/addressListModal';
import { BannerCarousel } from '~/presentation/components/bannerCarousel';
import { CardMenuList } from '~/presentation/components/cardMenuList';
import { CategoryGrid } from '~/presentation/components/categoryGrid';
import { getThemedStyles } from '~/presentation/styles/theme';

type RootStackParamList = {
  Subcategories: { categoryName: string; categoryId: number };
  MenuByCategory: { categoryId: number; subcategoryName?: string };
  CommerceList: undefined;
};

export default function Home() {
  const theme = getThemedStyles();
  const router = useNavigation<NavigationProp<RootStackParamList>>();

  const {
    banners,
    selectedAddress,
    loadingAddress,
    addressListModalVisible,
    addAddressModalVisible,
    handleAddressPress,
    handleAddressAdded,
    handleSelectAddress,
    setAddressListModalVisible,
    refetchBanners,
    setAddAddressModalVisible,
  } = useHome();
  const { categories, refetchCategories } = useCategories();
  const { refetchCommerces } = useCommerces();
  const { menus, loadingMenus, refetchMenus } = useMenus();
  const { addressArr, refreshAddresses } = useAddress();
  const { refreshNotifications } = useNotifications();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log('🎨 Home - Banners state:', banners);
    console.log('🎨 Home - Banners length:', banners?.length);
  }, [banners]);

  const renderAddressItem = ({ item }: { item: Address }) => {
    return (
      <TouchableOpacity
        className="flex-row items-center justify-between p-4"
        onPress={() => handleSelectAddress(item)}>
        <View className="flex-1">
          <Text className="text-base font-semibold">{item.title}</Text>
          <Text className="text-sm text-gray-600">{item.streets}</Text>
          {item.floor && <Text className="text-xs text-gray-500">Piso: {item.floor}</Text>}
          {item.reference && <Text className="text-xs text-gray-500">Ref: {item.reference}</Text>}
        </View>
        {item.id === selectedAddress?.id && <CheckCircleIcon color="#DA2919" size={24} />}
      </TouchableOpacity>
    );
  };

  const refreshData = async () => {
    if (loading) return; // Evitar múltiples recargas simultáneas
    setLoading(true);
    try {
      await Promise.all([
        refetchBanners(),
        refetchCategories(),
        refetchCommerces(),
        refetchMenus(),
        refreshAddresses(),
        refreshNotifications(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={{ backgroundColor: theme.backgroundColor }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshData}
            colors={[theme.primaryColor]}
            tintColor={theme.primaryColor}
          />
        }
        showsVerticalScrollIndicator={false}>
        <UserAddressHeader onPressAddress={handleAddressPress} />

        {/* Ejemplo de texto con la nueva fuente Luckiest Guy */}
        <View className="mx-4 mb-2 mt-2">
          <GlobalText
            variant="bold"
            style={{
              fontSize: 24,
              color: theme.primaryColor,
              textAlign: 'center',
            }}>
            ¡Bienvenido a Dores!
          </GlobalText>
        </View>

        <TouchableOpacity
          className="mx-10 mt-4 flex-row items-center justify-between rounded-full px-10 py-2"
          style={{
            borderColor: theme.borderColor,
            borderWidth: 1,
            backgroundColor: theme.backgroundColor,
            height: 40,
          }}
          onPress={() => router.navigate('CommerceList')}>
          <GlobalText>¿Qué quieres comer hoy?</GlobalText>
          <Search color="gray" />
        </TouchableOpacity>
        <View className="my-4">
          <CategoryGrid
            categories={categories}
            onCategoryPress={(category) =>
              router.navigate('Subcategories', {
                categoryName: category.name,
                categoryId: category.id,
              })
            }
            onViewAllPress={() => router.navigate('CommerceList')}
          />

          {/* Banner Carousel */}
          {banners && banners.length > 0 && (
            <View className="my-4">
              <BannerCarousel banners={banners} />
            </View>
          )}

          <View className="mb-4 flex-row justify-between px-4">
            <GlobalText className="text-lg font-medium">Productos Destacados</GlobalText>
            <GlobalText
              className="text-lg font-medium text-[#DA2919]"
              onPress={() => router.navigate('CommerceList')}>
              Ver todos
            </GlobalText>
          </View>

          {loadingMenus ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color={theme.primaryColor} />
              <GlobalText className="mt-2 text-sm text-gray-600">Cargando productos...</GlobalText>
            </View>
          ) : (
            <FlatList
              data={menus}
              renderItem={({ item }) => (
                <CardMenuList menu={item} commerceId={item.commerceId} commerceStatus />
              )}
              numColumns={2}
              keyExtractor={(item, index) => `menu-${item.commerceId}-${item.id}-${index}`}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={{
                paddingHorizontal: 8,
                paddingBottom: 20,
              }}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
            />
          )}
        </View>

        {/* Address List Modal */}
        <AddressList
          addresses={addressArr}
          loading={loadingAddress}
          renderAddressItem={renderAddressItem}
          addressListModalVisible={addressListModalVisible}
          setAddressListModalVisible={setAddressListModalVisible}
          setAddAddressModalVisible={setAddAddressModalVisible}
        />

        {/* Add Address Modal */}
        <AddressForm
          visible={addAddressModalVisible}
          onClose={() => setAddAddressModalVisible(false)}
          onAddressAdded={handleAddressAdded}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
