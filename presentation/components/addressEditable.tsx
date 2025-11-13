import { X } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Switch,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { Address } from '~/domain/entities/addressEntity';
import { useAddressForm } from '~/hooks/useLocation';

interface AddressFormProps {
  title: string;
  location: {
    latitude: string;
    longitude: string;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  floor?: string;
  reference?: string;
  visible: boolean;
  onClose: () => void;
  onAddressEdited: (newAddress?: Address) => void;
}

export const AddressEditableForm = ({
  title,
  location,
  floor,
  reference,
  visible,
  onClose,
  onAddressEdited,
}: AddressFormProps) => {
  const {
    setTitle,
    setFloor,
    setReference,
    showMap,
    setShowMap,
    searchAddress,
    setSearchAddress,
    locationPermission,
    requestLocationPermission,
    addressDetails,
    searchLocation,
    setLocation,
    defaultAddress,
    setDefaultAddress,
    loading,
    handleSubmit,
    updateLocationWithAddress,
  } = useAddressForm(visible, onAddressEdited, onClose);

  const handleShowMap = () => {
    requestLocationPermission();
    setShowMap(true);
  };

  const handleMapPress = async (e: any) => {
    const { coordinate } = e.nativeEvent;
    await updateLocationWithAddress(coordinate);
  };
  const validatedLocation = {
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  return (
    <View>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={onClose}>
        <SafeAreaView className="my-4 h-full bg-[#fffcfa]">
          <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
            <Text className="text-xl font-bold">Agregar dirección</Text>
            <TouchableOpacity onPress={onClose} className="p-4">
              <X color="black" size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View className="flex-1 p-4">
              <Text className="mb-2 text-base font-medium">Título</Text>
              <TextInput
                className="mb-4 min-h-[48px] rounded-lg border border-gray-300 p-3 placeholder:text-gray-400"
                placeholder="Ej: Casa, Trabajo"
                value={title}
                onChangeText={setTitle}
              />

              <Text className="mb-2 text-base font-medium">Buscar dirección</Text>
              <View className="mb-4 flex-row">
                <TextInput
                  className="min-h-[48px] flex-1 rounded-lg border border-gray-300 p-3 placeholder:text-gray-400"
                  placeholder="Ingrese una dirección"
                  value={searchAddress}
                  onChangeText={setSearchAddress}
                />
                <TouchableOpacity
                  className="ml-2 items-center justify-center rounded-lg bg-gray-200 px-4"
                  onPress={searchLocation}
                  disabled={!searchAddress.trim()}>
                  <Text>Buscar</Text>
                </TouchableOpacity>
              </View>

              {addressDetails && (
                <View className="mb-4 rounded-lg bg-gray-100 p-3">
                  <Text className="text-base font-medium">Ubicación seleccionada:</Text>
                  <Text className="text-gray-700" numberOfLines={2} ellipsizeMode="tail">
                    {addressDetails}
                  </Text>
                </View>
              )}

              <Text className="mb-2 text-base font-medium">Piso/Departamento </Text>
              <Text className="mb-2 text-sm text-gray-500">(Opcional)</Text>
              <TextInput
                className="mb-4 min-h-[48px] rounded-lg border border-gray-300 p-3 placeholder:text-gray-400"
                placeholder="Ej: 1, 2, PB"
                value={floor}
                onChangeText={setFloor}
              />

              <Text className="mb-2 text-base font-medium">Referencias</Text>
              <Text className="mb-2 text-sm text-gray-500">(Opcional)</Text>
              <TextInput
                className="mb-4 min-h-[48px] rounded-lg border border-gray-300 p-3 placeholder:text-gray-400"
                placeholder="Ej: Cerca de la plaza"
                value={reference}
                onChangeText={setReference}
                multiline
              />

              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-base font-medium">Dirección por defecto</Text>
                <Switch
                  value={defaultAddress}
                  onValueChange={setDefaultAddress}
                  trackColor={{ false: '#767577', true: '#DA2919' }}
                  thumbColor={defaultAddress ? '#fff' : '#f4f3f4'}
                />
              </View>

              {!showMap ? (
                <TouchableOpacity
                  className="mb-4 rounded-lg bg-gray-100 p-4"
                  onPress={handleShowMap}>
                  <Text className="text-center text-base font-medium">
                    Usar mi ubicación actual
                  </Text>
                </TouchableOpacity>
              ) : (
                <View className="mb-4 h-52 overflow-hidden rounded-lg">
                  {locationPermission ? (
                    <MapView
                      key={showMap.toString()}
                      style={{ width: '100%', height: 200 }}
                      initialRegion={validatedLocation}
                      onPress={handleMapPress}>
                      <Marker
                        coordinate={validatedLocation}
                        draggable
                        onDragEnd={() => setLocation(validatedLocation)}
                      />
                    </MapView>
                  ) : (
                    <View className="flex-1 items-center justify-center">
                      <ActivityIndicator size="large" color="#DA2919" />
                      <Text className="mt-2 text-center">Solicitando permisos de ubicación...</Text>
                    </View>
                  )}
                </View>
              )}

              <TouchableOpacity
                className="mt-4 rounded-full bg-[#DA2919] p-4"
                onPress={handleSubmit}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-center text-lg font-semibold text-white">
                    Agregar dirección
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};
