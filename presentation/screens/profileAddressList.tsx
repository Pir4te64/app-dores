import { EllipsisVertical, MapPinIcon, PlusCircleIcon } from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';

import { AddressOptions } from '~/components/addressOptionsModal';
import { Address } from '~/domain/entities/addressEntity';
import { useAddress } from '~/hooks/useAddress';
import { AddressForm } from '~/presentation/components/addressForm';
import { getThemedStyles } from '~/presentation/styles/theme';

export function ProfileAddresses() {
  const theme = getThemedStyles();
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<Address>();
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);
  const { addressArr, getUserAddress } = useAddress();

  const handleAddAddress = () => setShowAddressForm(true);

  const handleAddressOptions = (address: Address) => {
    setSelectedAddress(address);
    setShowOptionsModal(true);
  };

  const renderEmptyAddress = () => {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center p-4">
          <MapPinIcon size={48} color={theme.primaryColor} className="mb-4" />
          <Text className="mb-6 text-center text-lg text-gray-600">
            No tienes direcciones guardadas
          </Text>
          <TouchableOpacity
            className="flex-row items-center rounded-full px-6 py-3"
            style={{ backgroundColor: theme.secondaryColor }}
            onPress={handleAddAddress}>
            <PlusCircleIcon size={24} color="white" className="mr-2" />
            <Text className="text-lg font-medium text-white">Añadir dirección</Text>
          </TouchableOpacity>
        </View>

        <AddressForm
          visible={showAddressForm}
          onClose={() => setShowAddressForm(false)}
          onAddressAdded={getUserAddress}
        />
      </SafeAreaView>
    );
  };
  const renderAddressItem = ({ item: a }: { item: Address }) => {
    return (
      <TouchableOpacity
        key={a.id}
        className="mb-4 w-[95%] flex-row items-center justify-between self-center rounded-xl border border-gray-200 bg-white px-6 py-4"
        onPress={() => handleAddressOptions(a)}>
        <View className="flex-row items-center">
          <MapPinIcon size={24} color={theme.primaryColor} className="mr-3 mt-1" />

          <View>
            <Text className="text-base font-semibold text-gray-900">{a.title}</Text>
            <Text className="text-sm text-gray-600">{a.reference}</Text>
            {a.isDefault && (
              <Text className="mt-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                Ubicación favorita
              </Text>
            )}
          </View>
        </View>

        <EllipsisVertical color="black" size={20} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <View className="flex">
        <View className="flex h-3/4">
          <FlatList
            data={addressArr}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderAddressItem}
            ListEmptyComponent={renderEmptyAddress}
          />
        </View>
        {addressArr.length > 0 && (
          <TouchableOpacity
            className="m-2 w-fit flex-row items-center justify-end gap-2 self-center rounded-full p-4"
            style={{ backgroundColor: theme.secondaryColor }}
            onPress={handleAddAddress}>
            <PlusCircleIcon size={24} color="white" className="mr-2" />
            <Text className="text-lg font-medium text-white">Añadir nueva dirección</Text>
          </TouchableOpacity>
        )}
        {selectedAddress && (
          <AddressOptions
            address={selectedAddress}
            isVisible={showOptionsModal}
            onClose={() => setShowOptionsModal(false)}
          />
        )}
        <AddressForm
          visible={showAddressForm}
          onClose={() => setShowAddressForm(false)}
          onAddressAdded={getUserAddress}
        />
      </View>
    </SafeAreaView>
  );
}
