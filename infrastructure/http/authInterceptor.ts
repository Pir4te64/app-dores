import { jwtDecode } from 'jwt-decode';

import { AuthService } from '~/domain/services/authService';
import { tryCatch } from '~/infrastructure/config/tryCatch';
import { AsyncStorageService } from '~/infrastructure/storage/asyncStorageService';

export const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp ? decodedToken.exp < currentTime : true;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const getValidToken = async (): Promise<string | null> => {
  try {
    const { data: accessToken } = await tryCatch(AsyncStorageService.getItem('accessToken'));

    if (!accessToken) {
      return null;
    }

    if (!isTokenExpired(accessToken)) {
      return accessToken;
    }

    const authService = AuthService.getInstance();
    const { data, error } = await tryCatch(authService.refreshToken());

    if (error || !data) {
      await AsyncStorageService.multiRemove(['accessToken', 'refreshToken', 'user']);
      return null;
    }

    await AsyncStorageService.setItem('accessToken', data.accessToken);
    await AsyncStorageService.setItem('refreshToken', data.refreshToken);

    return data.accessToken;
  } catch (error) {
    console.error('Error getting valid token:', error);
    return null;
  }
};

export const withAuth = async <T>(apiCall: (token: string) => Promise<T>): Promise<T> => {
  const token = await getValidToken();

  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    return await apiCall(token);
  } catch (error: any) {
    if (error.message?.includes('401')) {
      const newToken = await getValidToken();

      if (!newToken) {
        throw new Error('Failed to refresh authentication');
      }

      return await apiCall(newToken);
    }

    throw error;
  }
};
