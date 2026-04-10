import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useCategories } from './useCategory';
import { useCheckout } from './useCheckout';
import { useCommerces } from './useCommerces';
import { Address } from '~/domain/entities/addressEntity';
import { Banner } from '~/domain/entities/bannerEntity';
import { BannerService } from '~/domain/services/bannerService';
import { useUser } from '~/presentation/context/userContext';

export const useHome = () => {
  const { loadingUser } = useUser();
  const { commerces, loadingCommerces } = useCommerces();
  const { categories, loadingCategories } = useCategories();
  const { handleAddressSelected } = useCheckout();
  const bannerService = BannerService.getInstance();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addressListModalVisible, setAddressListModalVisible] = useState(false);
  const [addAddressModalVisible, setAddAddressModalVisible] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
  const loading = loadingUser || loadingCommerces || loadingCategories;
  const hasMountedRef = useRef(false);
  const isFetchingBanners = useRef(false);
  const [lastBannerFetchTime, setLastBannerFetchTime] = useState<number>(0);
  const BANNERS_CACHE_DURATION = 5 * 60 * 1000;

  const handleAddressPress = useCallback(() => {
    setAddressListModalVisible(true);
  }, []);

  const fetchAddresses = useCallback(async () => {
    // For now, addresses are managed locally
    setLoadingAddress(false);
  }, []);

  const handleAddressAdded = useCallback(
    async (newAddress?: Address) => {
      setAddAddressModalVisible(false);

      if (newAddress) {
        setSelectedAddress(newAddress);
        handleAddressSelected(newAddress);
      }
    },
    [handleAddressSelected]
  );

  const handleSelectAddress = useCallback(
    async (address: Address) => {
      setSelectedAddress(address);
      handleAddressSelected(address);
      setAddressListModalVisible(false);
    },
    [handleAddressSelected]
  );

  const fetchBanners = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();

      if (!forceRefresh && now - lastBannerFetchTime < BANNERS_CACHE_DURATION && banners.length > 0) {
        return;
      }

      if (isFetchingBanners.current) return;

      isFetchingBanners.current = true;
      try {
        const response = await bannerService.getBanners();
        if (Array.isArray(response)) {
          setBanners(response);
          setLastBannerFetchTime(now);
        } else {
          setBanners([]);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        setBanners([]);
      } finally {
        isFetchingBanners.current = false;
      }
    },
    [bannerService, lastBannerFetchTime, banners.length]
  );

  useEffect(() => {
    if (hasMountedRef.current) return;
    hasMountedRef.current = true;
    fetchAddresses();
    fetchBanners();
  }, []);

  return {
    banners,
    refetchBanners: () => fetchBanners(true),
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
