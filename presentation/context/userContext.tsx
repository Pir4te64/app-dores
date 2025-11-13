import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { User } from '~/domain/entities/userEntity';
import { RegisterData, LoginData } from '~/domain/repositories/iuserRepository';
import { AuthService } from '~/domain/services/authService';
import { PushNotificationService } from '~/domain/services/pushNotificationService';
import { UserService } from '~/domain/services/userService';
import { tryCatch } from '~/infrastructure/config/tryCatch';
import { AsyncStorageService } from '~/infrastructure/storage/asyncStorageService';

interface UserContextType {
  user: User | null;
  loadingUser: boolean;
  error: Error | null;
  login: (loginData: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const authService = AuthService.getInstance();
const userService = UserService.getInstance();
const pushNotificationService = PushNotificationService.getInstance();

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isTokenExpired = (token: string): boolean => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp ? decodedToken.exp < currentTime : true;
    } catch {
      return true;
    }
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorageService.getItem('accessToken');

      if (!token || isTokenExpired(token)) {
        await refreshToken();
        return;
      }

      const { data: userData, error } = await tryCatch(userService.getCurrentUser());

      if (userData) {
        setUser(userData);
        await AsyncStorageService.setItem('user', JSON.stringify(userData));
        await registerPushToken();
      } else if (error) {
        if (error.message?.includes('401')) {
          await refreshToken();
        } else {
          setError(error);
        }
      }
    } catch (error) {
      setError(error as Error);
    }
  };

  const registerPushToken = async () => {
    try {
      const pushToken = await AsyncStorageService.getItem('pushToken');
      if (pushToken) {
        const storedToken = await AsyncStorageService.getItem('previousPushToken');
        if (storedToken && storedToken !== pushToken) {
          await pushNotificationService.sendTokenToServer(storedToken, pushToken);
        } else {
          await pushNotificationService.sendTokenToServer(pushToken);
        }
      } else {
        const newToken = await pushNotificationService.registerForPushNotifications();
        if (newToken) {
          await pushNotificationService.sendTokenToServer(newToken);
        }
      }
    } catch (error) {
      console.error('Error registering push token after auth:', error);
    }
  };

  const login = async (loginData: LoginData) => {
    try {
      const { data, error } = await tryCatch(authService.login(loginData));

      if (error || !data) {
        setError(error);
        throw error;
      }

      await AsyncStorageService.setItem('accessToken', data.accessToken);
      await AsyncStorageService.setItem('refreshToken', data.refreshToken);

      await fetchUserData();
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const { data, error } = await tryCatch(authService.register(userData));

      if (error || !data) {
        setError(error);
        throw error;
      }

      await AsyncStorageService.setItem('accessToken', data.accessToken);
      await AsyncStorageService.setItem('refreshToken', data.refreshToken);

      await fetchUserData();
    } catch (error) {
      setError(error as Error);
    }
  };

  const refreshToken = async () => {
    try {
      const { data, error } = await tryCatch(authService.refreshToken());

      if (error) {
        await logout();
        setError(error);
        throw error;
      }

      if (!data) {
        await logout();
        return;
      }

      await AsyncStorageService.setItem('accessToken', data.accessToken);
      await AsyncStorageService.setItem('refreshToken', data.refreshToken);

      await fetchUserData();
    } catch {
      await logout();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      await AsyncStorageService.multiRemove(['accessToken', 'refreshToken', 'user']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const initializeUserData = async () => {
      try {
        const { data: storedToken } = await tryCatch(AsyncStorageService.getItem('accessToken'));

        if (storedToken) await fetchUserData();
      } catch (error) {
        console.error('Error initializing user data:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    initializeUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loadingUser: loading,
        error,
        login,
        register,
        logout,
        fetchUserData,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
