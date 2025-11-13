import { PlusIcon } from 'lucide-react-native';
import { Modal, View, TouchableOpacity, ActivityIndicator, FlatList, Text } from 'react-native';

import { Address } from '~/domain/entities/addressEntity';

interface AddressListProps {
  addresses: Address[];
  loading: boolean;
  addressListModalVisible: boolean;
  renderAddressItem: ({ item }: { item: Address }) => React.JSX.Element;
  setAddressListModalVisible: (state: boolean) => void;
  setAddAddressModalVisible: (state: boolean) => void;
}

export function AddressList({
  addresses,
  loading,
  addressListModalVisible,
  renderAddressItem,
  setAddressListModalVisible,
  setAddAddressModalVisible,
}: AddressListProps) {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent
        visible={addressListModalVisible}
        onRequestClose={() => setAddressListModalVisible(false)}>
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setAddressListModalVisible(false)}>
          <TouchableOpacity
            className="h-2/3 rounded-t-xl bg-white"
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}>
            <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
              <Text className="text-xl font-bold">Seleccionar dirección</Text>
              <TouchableOpacity
                className="rounded-full bg-[#DA2919] p-2"
                onPress={() => {
                  setAddressListModalVisible(false);
                  setAddAddressModalVisible(true);
                }}>
                <PlusIcon color="white" size={20} />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#DA2919" />
              </View>
            ) : addresses.length === 0 ? (
              <View className="flex-1 items-center justify-center p-4">
                <Text className="mb-4 text-center text-gray-500">
                  No tienes direcciones guardadas. Agrega una dirección para continuar.
                </Text>
                <TouchableOpacity
                  className="flex-row items-center rounded-full bg-[#DA2919] px-4 py-2"
                  onPress={() => {
                    setAddressListModalVisible(false);
                    setAddAddressModalVisible(true);
                  }}>
                  <PlusIcon color="white" size={20} />
                  <Text className="ml-2 font-semibold text-white">Agregar dirección</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={addresses}
                renderItem={renderAddressItem}
                keyExtractor={(item) => item.id.toString()}
              />
            )}

            <TouchableOpacity
              className="m-4 w-fit self-center rounded-full bg-gray-200 p-4"
              onPress={() => setAddressListModalVisible(false)}>
              <Text className="text-center font-semibold">Cancelar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
