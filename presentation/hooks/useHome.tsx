import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

import { useCategories } from './useCategory';
import { useCheckout } from './useCheckout';
import { useCommerces } from './useCommerces';

import { Address } from '~/domain/entities/addressEntity';
import { Banner } from '~/domain/entities/bannerEntity';
import { BannerService } from '~/domain/services/bannerService';
import { DeliveryAddressService } from '~/domain/services/deliveryAddressService';
import { UserService } from '~/domain/services/userService';
import { useAddress } from '~/hooks/useAddress';
import { AsyncStorageService } from '~/infrastructure/storage/asyncStorageService';
import { useUser } from '~/presentation/context/userContext';

export const useHome = () => {
  const { loadingUser } = useUser();
  const { refreshAddresses } = useAddress();
  const { commerces, loadingCommerces } = useCommerces();
  const { categories, loadingCategories } = useCategories();
  const { handleAddressSelected } = useCheckout();
  const userService = UserService.getInstance();
  const deliveryAddressService = DeliveryAddressService.getInstance();
  const bannerService = BannerService.getInstance();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addressListModalVisible, setAddressListModalVisible] = useState(false);
  const [addAddressModalVisible, setAddAddressModalVisible] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
  const loading = loadingUser || loadingCommerces || loadingCategories;

  const handleAddressPress = useCallback(() => {
    setAddressListModalVisible(true);
  }, []);

  const fetchAddresses = useCallback(async () => {
    setLoadingAddress(true);
    try {
      const addressList = await deliveryAddressService.getAllDeliveryAddresses();
      setAddresses(addressList || []);

      const defaultAddress =
        addressList && addressList.length > 0
          ? addressList.find((addr) => addr.isDefault) || addressList[0]
          : null;

      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
        handleAddressSelected(defaultAddress);
      }
    } catch {
      Alert.alert('Hubo un incoveniente', 'No se pudieron cargar las direcciones');
    } finally {
      setLoadingAddress(false);
    }
  }, [deliveryAddressService, handleAddressSelected]);

  const handleAddressAdded = useCallback(
    async (newAddress?: Address) => {
      setAddAddressModalVisible(false);

      if (newAddress) {
        setSelectedAddress(newAddress);
        handleAddressSelected(newAddress);
      }

      await fetchAddresses();
      try {
        const userData = await userService.getCurrentUser();
        await AsyncStorageService.setItem('user', JSON.stringify(userData));
      } catch {
        Alert.alert('Error', 'No se pudo actualizar los datos del usuario');
      }
    },
    [userService, handleAddressSelected, fetchAddresses]
  );

  const handleSelectAddress = useCallback(
    async (address: Address) => {
      setSelectedAddress(address);
      handleAddressSelected(address);
      setAddressListModalVisible(false);
      if (!address.isDefault) {
        try {
          await deliveryAddressService.updateDeliveryAddress({
            ...address,
            isDefault: true,
          });
          setAddresses(
            addresses.map((addr) => ({
              ...addr,
              isDefault: addr.id === address.id,
            }))
          );
          refreshAddresses();
        } catch (error) {
          console.error('Error setting default address:', error);
          Alert.alert('Error', 'No se pudo establecer la dirección por defecto');
        }
      }
    },
    [addresses, deliveryAddressService, handleAddressSelected]
  );
  const fetchBanners = useCallback(async () => {
    try {
      console.log('🔄 Fetching banners...');
      const response = await bannerService.getBanners();
      console.log('✅ Banners fetched:', response);
      console.log('📊 Number of banners:', response?.length);
      if (Array.isArray(response)) {
        setBanners(response);
      } else {
        console.warn('⚠️ Response is not an array:', response);
        setBanners([]);
      }
    } catch (error) {
      console.error('❌ Error fetching banners:', error);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error stack:', error?.stack);
      // No establecer banners vacíos si hay error de autenticación
      // Los banners pueden cargarse después cuando el usuario se autentique
      if (!error?.message?.includes('Authentication required')) {
        setBanners([]);
      }
    }
  }, [bannerService]);

  useEffect(() => {
    fetchAddresses();
    fetchBanners();
  }, [fetchAddresses, fetchBanners]);

  return {
    banners,
    refetchBanners: fetchBanners,
    commerces,
    categories,
    addresses,
    selectedAddress,
    loading,
    loadingAddress,
    addressListModalVisible,
    addAddressModalVisible,
    handleAddressPress,
    handleAddressAdded,
    handleSelectAddress,
    setAddressListModalVisible,
    setAddAddressModalVisible,
  };
};
