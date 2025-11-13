import { House, PenIcon, Trash, X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';

import { AddressEditableForm } from './addressEditable';

import { Address } from '~/domain/entities/addressEntity';
import { useAddress } from '~/hooks/useAddress';

interface AddressOptionsProps {
  address: Address | null;
  isVisible: boolean;
  onClose: () => void;
}

export function AddressOptions({ address, isVisible, onClose }: AddressOptionsProps) {
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const { refreshAddresses, makeDefaultAddress, deleteAddress } = useAddress();

  const handleEditAddress = () => setShowAddressForm(true);
  const handleMakeDefaultAddress = () => {
    Alert.alert('¿Estás seguro?', 'Esta será tu nueva dirección por defecto', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Si',
        style: 'default',
        onPress: () => {
          makeDefaultAddress(address!);
          refreshAddresses();
          onClose();
        },
      },
    ]);
  };
  const handleDeleteAddress = () => {
    Alert.alert('¿Estás seguro?', 'Esta acción es irreversible', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Si',
        style: 'destructive',
        onPress: () => {
          deleteAddress(address?.id!);
          refreshAddresses();
          onClose();
        },
      },
    ]);
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={onClose} />
      <View className="absolute bottom-0 w-full rounded-t-3xl bg-white p-6">
        <View className="flex-row items-center justify-between">
          <Text className="mb-4 text-xl font-bold">{address?.title}</Text>
          <X color="black" onPress={onClose} />
        </View>

        <TouchableOpacity
          className="mb-4 flex-row items-center gap-2 rounded-lg p-4"
          onPress={handleMakeDefaultAddress}>
          <House color="black" />
          <Text className="text-lg">Usar como dirección predeterminada</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mb-4 flex-row items-center gap-2 rounded-lg p-4"
          onPress={handleEditAddress}>
          <PenIcon color="black" />
          <Text className="text-lg">Editar dirección</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mb-4 flex-row items-center gap-2 rounded-lg p-4"
          onPress={handleDeleteAddress}>
          <Trash color="#ef4444" />
          <Text className="text-lg text-red-500">Eliminar dirección</Text>
        </TouchableOpacity>
      </View>
      {address && (
        <AddressEditableForm
          title={address?.title}
          location={{
            latitude: address?.latitude,
            longitude: address?.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          reference={address?.reference}
          floor={address?.floor}
          visible={showAddressForm}
          onClose={() => setShowAddressForm(false)}
          onAddressEdited={refreshAddresses}
        />
      )}
    </Modal>
  );
}
