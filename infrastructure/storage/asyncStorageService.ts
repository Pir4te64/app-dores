import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageService {
  static async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }

  static async setItem(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(key, value);
  }

  static async removeItem(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }

  static async multiRemove(keys: string[]): Promise<void> {
    return AsyncStorage.multiRemove(keys);
  }
}
