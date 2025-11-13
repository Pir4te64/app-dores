import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

import { Address } from '~/domain/entities/addressEntity';
import { DeliveryAddressService } from '~/domain/services/deliveryAddressService';
import { LocationService } from '~/domain/services/locationService';

export const useAddressForm = (
  visible: boolean,
  onAddressAdded: (newAddress?: Address) => void,
  onClose: () => void
) => {
  const [title, setTitle] = useState('');
  const [floor, setFloor] = useState('');
  const [reference, setReference] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [location, setLocation] = useState({
    latitude: -27.467631,
    longitude: -55.795168,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [locationPermission, setLocationPermission] = useState(false);
  const [addressDetails, setAddressDetails] = useState<string | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const addressService = DeliveryAddressService.getInstance();

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    setTitle('');
    setFloor('');
    setReference('');
    setDefaultAddress(false);
    setAddressDetails(null);
    setShowMap(false);
  };
  const updateLocationWithAddress = async (newLocation: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => {
    setLocation(newLocation);
    try {
      const address = await LocationService.reverseGeocode(
        newLocation.latitude,
        newLocation.longitude
      );
      if (address) {
        setAddressDetails(address);
        setSearchAddress(address);
      }
    } catch (error) {
      console.error('Error getting address details:', error);
    }
  };
  const requestLocationPermission = useCallback(async () => {
    const granted = await LocationService.requestLocationPermission();
    setLocationPermission(granted);
    if (granted) {
      const newLocation = await LocationService.getCurrentLocation();
      await updateLocationWithAddress(newLocation);
    }
  }, []);

  const searchLocation = useCallback(async () => {
    if (!searchAddress) return;
    try {
      const newLocation = await LocationService.geocodeAddress(searchAddress);
      if (newLocation) {
        await updateLocationWithAddress(newLocation);
        setShowMap(true);
      } else {
        Alert.alert('Error', 'No se pudo encontrar la ubicación');
      }
    } catch {
      Alert.alert('Error', 'No se pudo encontrar la ubicación');
    }
  }, [searchAddress, locationPermission]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!title.trim()) {
        Alert.alert('Error', 'Por favor ingrese un título para la dirección');
        return;
      }

      const newAddress = await addressService.addDeliveryAddress({
        title,
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        floor: floor || undefined,
        reference: reference || undefined,
        isDefault: defaultAddress,
      });

      Alert.alert('Éxito', 'Dirección agregada correctamente', [
        {
          text: 'OK',
          onPress: () => {
            onAddressAdded(newAddress);

            resetForm();
            onClose();
          },
        },
      ]);
    } catch {
      Alert.alert('Error', 'No se pudo agregar la dirección');
    } finally {
      setLoading(false);
    }
  };

  return {
    title,
    setTitle,
    floor,
    setFloor,
    reference,
    setReference,
    showMap,
    setShowMap,
    searchAddress,
    setSearchAddress,
    location,
    setLocation,
    updateLocationWithAddress,
    locationPermission,
    requestLocationPermission,
    addressDetails,
    searchLocation,
    defaultAddress,
    setDefaultAddress,
    loading,
    handleSubmit,
  };
};
