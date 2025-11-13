import { Address } from '~/domain/entities/addressEntity';
import { ApiClient } from '~/domain/sources/remote/apiClient';

export interface AddressData {
  id?: number;
  latitude: string;
  longitude: string;
  title: string;
  reference?: string;
  floor?: string;
  isDefault: boolean;
  streets?: string;
}

export class DeliveryAddressService {
  private static instance: DeliveryAddressService;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = new ApiClient();
  }

  static getInstance(): DeliveryAddressService {
    if (!DeliveryAddressService.instance) {
      DeliveryAddressService.instance = new DeliveryAddressService();
    }
    return DeliveryAddressService.instance;
  }

  async getAllDeliveryAddresses(): Promise<Address[]> {
    try {
      const response = await this.apiClient.getWithAuth<Address[]>(
        '/pedidos/user/v1/get-all-deliverys-address'
      );
      return response || [];
    } catch {
      return [];
    }
  }

  async addDeliveryAddress(addressData: AddressData): Promise<Address> {
    try {
      if (!this.isValidCoordinates(addressData.latitude, addressData.longitude)) {
        throw new Error('Invalid coordinates provided');
      }

      const response = await this.apiClient.putWithAuth<Address>(
        '/pedidos/user/v1/update-or-create-deliverys-address',
        addressData
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateDeliveryAddress(addressData: AddressData): Promise<Address> {
    try {
      if (!this.isValidCoordinates(addressData.latitude, addressData.longitude))
        throw new Error('Invalid coordinates provided');

      if (!addressData.id) {
        throw new Error('Address ID is required for updates');
      }

      const response = await this.apiClient.putWithAuth<Address>(
        `/pedidos/user/v1/update-or-create-deliverys-address?id-address=${addressData.id}`,
        addressData
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
  async deleteDeliveryAddress(addressId: number): Promise<any> {
    return await this.apiClient.deleteWithAuth(
      `/pedidos/user/v1/delete-delivery-address?id-address=${addressId}`
    );
  }
  private isValidCoordinates(latitude: string, longitude: string): boolean {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    return !isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  }
}
