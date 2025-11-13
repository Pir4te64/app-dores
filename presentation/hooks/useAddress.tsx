import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';

import { Address } from '~/domain/entities/addressEntity';
import { DeliveryAddressService } from '~/domain/services/deliveryAddressService';

interface AddressContextType {
  address: Address | undefined;
  addressArr: Address[];
  getUserAddress: () => void;
  refreshAddresses: () => void;
  makeDefaultAddress: (address: Address) => void;
  deleteAddress: (addressId: number) => void;
  isRefreshing: boolean;
}

const AddressRefreshContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<Address | undefined>(undefined);
  const [addressArr, setAddressArr] = useState<Address[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const deliveryAddressService = DeliveryAddressService.getInstance();

  const loadDefaultAddress = async () => {
    const addressArr = await deliveryAddressService.getAllDeliveryAddresses();
    const defaultAddress = addressArr.find((a) => a.isDefault === true);
    setAddress(defaultAddress);
  };
  const getUserAddress = async () => {
    const addresses = await deliveryAddressService.getAllDeliveryAddresses();
    setAddressArr(addresses || []);
  };
  const makeDefaultAddress = async (address: Address) => {
    if (!address) return;

    try {
      const updatedAddress = {
        ...address,
        isDefault: true,
      };
      await deliveryAddressService.updateDeliveryAddress(updatedAddress);
      refreshAddresses();
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const deleteAddress = async (addressId: number) => {
    if (!address) return;

    try {
      await deliveryAddressService.deleteDeliveryAddress(addressId);
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const refreshAddresses = useCallback(async () => {
    await loadDefaultAddress();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 100);
  }, []);

  useEffect(() => {
    getUserAddress();
    loadDefaultAddress();
  }, []);

  return (
    <AddressRefreshContext.Provider
      value={{
        address,
        addressArr,
        getUserAddress,
        makeDefaultAddress,
        deleteAddress,
        refreshAddresses,
        isRefreshing,
      }}>
      {children}
    </AddressRefreshContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressRefreshContext);
  if (context === undefined) {
    throw new Error('useAddressRefresh must be used within an AddressRefreshProvider');
  }
  return context;
};
