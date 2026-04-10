import { MapPinIcon, CheckCircleIcon, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';

import { AddressForm } from './addressForm';
import { AddressList } from './addressListModal';
import { GlobalText } from './GlobalText';

import { Address } from '~/domain/entities/addressEntity';

const PRIMARY_RED = '#DA2919';

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

  const fetchAddresses = async () => {
    // Addresses are managed locally for now
    setLoading(false);
  };

  const handleSelectAddress = async (address: Address) => {
    setSelectedAddress(address);
    onAddressSelected(address);
    setAddressListModalVisible(false);

    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === address.id,
      }))
    );
  };

  const handleAddressAdded = async (newAddress?: Address) => {
    setAddAddressModalVisible(false);

    if (newAddress) {
      const mockNewAddress = {
        ...newAddress,
        id: Date.now(),
      };
      setAddresses([...addresses, mockNewAddress]);
      setSelectedAddress(mockNewAddress);
      onAddressSelected(mockNewAddress);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const renderAddressItem = ({ item }: { item: Address }) => (
    <TouchableOpacity
      style={[
        styles.addressItem,
        item.id === selectedAddress?.id && styles.addressItemSelected,
      ]}
      onPress={() => handleSelectAddress(item)}>
      <View style={styles.addressInfo}>
        <Text style={styles.addressTitle}>{item.title}</Text>
        <Text style={styles.addressStreet}>{item.streets}</Text>
        {item.floor && <Text style={styles.addressFloor}>Piso: {item.floor}</Text>}
      </View>
      {item.id === selectedAddress?.id && (
        <View style={styles.checkCircle}>
          <CheckCircleIcon color="#FFF" size={16} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setAddressListModalVisible(true)}>
        <View style={styles.iconContainer}>
          <MapPinIcon color={PRIMARY_RED} size={22} />
        </View>
        <View style={styles.selectorContent}>
          {loading ? (
            <ActivityIndicator size="small" color={PRIMARY_RED} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : selectedAddress ? (
            <>
              <Text style={styles.label}>Entregar en</Text>
              <Text style={styles.addressName}>{selectedAddress.title}</Text>
              <Text style={styles.addressStreetSmall} numberOfLines={1}>
                {selectedAddress.streets}
              </Text>
            </>
          ) : (
            <Text style={styles.placeholder}>Seleccionar dirección</Text>
          )}
        </View>
        <Text style={styles.changeText}>Cambiar</Text>
      </TouchableOpacity>

      {/* Address list modal */}
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

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${PRIMARY_RED}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectorContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#999',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
    marginTop: 2,
  },
  addressStreetSmall: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  placeholder: {
    fontSize: 15,
    color: '#999',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
  },
  changeText: {
    fontSize: 13,
    color: PRIMARY_RED,
    fontWeight: '600',
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  addressItemSelected: {
    backgroundColor: '#FFF9F8',
  },
  addressInfo: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
  },
  addressStreet: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addressFloor: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PRIMARY_RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
