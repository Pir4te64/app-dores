import { MapPinIcon, CheckCircleIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

import { AddressForm } from './addressForm';
import { AddressList } from './addressListModal';

import { Address } from '~/domain/entities/addressEntity';
import { DeliveryAddressService } from '~/domain/services/deliveryAddressService';

interface DeliveryAddressSelectorProps {
  onAddressSelected: (address: Address) => void;
}

export const DeliveryAddressSelector = ({ onAddressSelected }: DeliveryAddressSelectorProps) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressListModalVisible, setAddressListModalVisible] = useState(false);
  const [addAddressModalVisible, setAddAddressModalVisible] = useState(false);
  const deliveryAddressService = DeliveryAddressService.getInstance();

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const addressList = await deliveryAddressService.getAllDeliveryAddresses();
      setAddresses(addressList || []);

      const defaultAddress =
        addressList && addressList.length > 0
          ? addressList.find((addr) => addr.isDefault) || addressList[0]
          : null;

      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
        onAddressSelected(defaultAddress);
      }
    } catch {
      setError('No se pudieron cargar las direcciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = async (address: Address) => {
    setSelectedAddress(address);
    onAddressSelected(address);
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
      } catch (error) {
        console.error('Error setting default address:', error);
        Alert.alert('Error', 'No se pudo establecer la dirección por defecto');
      }
    }
  };

  const handleAddressAdded = async (newAddress?: Address) => {
    setAddAddressModalVisible(false);

    if (newAddress) {
      setSelectedAddress(newAddress);
      onAddressSelected(newAddress);
    }

    await fetchAddresses();
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const renderAddressItem = ({ item }: { item: Address }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4"
      onPress={() => handleSelectAddress(item)}>
      <View className="flex-1">
        <Text className="text-base font-semibold">{item.title}</Text>
        <Text className="text-sm text-gray-600">{item.streets}</Text>
      </View>
      {item.id === selectedAddress?.id && <CheckCircleIcon color="#DA2919" size={24} />}
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        className="flex-row items-center rounded-lg p-3"
        onPress={() => setAddressListModalVisible(true)}>
        <MapPinIcon color="#DA2919" size={24} />
        <View className="ml-2 flex-1">
          {loading ? (
            <ActivityIndicator size="small" color="#DA2919" />
          ) : error ? (
            <Text className="text-red-500">{error}</Text>
          ) : selectedAddress ? (
            <>
              <Text className="text-sm text-gray-500">Entregar en</Text>
              <Text className="text-base font-semibold">{selectedAddress.title}</Text>
            </>
          ) : (
            <Text className="text-base">Seleccionar dirección de entrega</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Addres list modal */}
      <AddressList
        addresses={addresses}
        loading={loading}
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
    </View>
  );
};
