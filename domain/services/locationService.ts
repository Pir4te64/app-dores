import * as Location from 'expo-location';

export class LocationService {
  static async requestLocationPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  static async getCurrentLocation() {
    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  static async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      const geocodedLocation = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      if (geocodedLocation.length > 0) {
        const firstLocation = geocodedLocation[0];
        return [
          firstLocation.name,
          firstLocation.street,
          firstLocation.city,
          firstLocation.region,
          firstLocation.country,
        ]
          .filter(Boolean)
          .join(', ');
      }
      return null;
    } catch {
      return null;
    }
  }

  static async geocodeAddress(address: string) {
    const geocodedLocation = await Location.geocodeAsync(address);
    if (geocodedLocation.length > 0) {
      return {
        latitude: geocodedLocation[0].latitude,
        longitude: geocodedLocation[0].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    return null;
  }
}
