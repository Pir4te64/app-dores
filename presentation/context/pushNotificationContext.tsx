import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { useUser } from './userContext';

import { PushNotificationService } from '~/domain/services/pushNotificationService';
import { AsyncStorageService } from '~/infrastructure/storage/asyncStorageService';

interface PushNotificationContextType {
  deviceToken: string | null;
  isRegistered: boolean;
  registerDevice: () => Promise<string | null>;
}

const PushNotificationContext = createContext<PushNotificationContextType | undefined>(undefined);

export const PushNotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const { user } = useUser();
  const pushNotificationService = PushNotificationService.getInstance();

  const registerDevice = async (): Promise<string | null> => {
    try {
      const token = await pushNotificationService.registerForPushNotifications();
      if (token) {
        setDeviceToken(token);
        setIsRegistered(true);

        const storedToken = await AsyncStorageService.getItem('pushToken');

        if (user?.id) {
          if (storedToken && storedToken !== token) {
            await pushNotificationService.sendTokenToServer(storedToken, token);
          } else {
            await pushNotificationService.sendTokenToServer(token);
          }
        }
      }
      return token;
    } catch (error) {
      console.error('Error registering device:', error);
      return null;
    }
  };

  useEffect(() => {
    const initPushNotifications = async () => {
      await registerDevice();
    };

    initPushNotifications();

    return () => {
      pushNotificationService.removeNotificationListeners();
    };
  }, []);

  useEffect(() => {
    const sendTokenAfterLogin = async () => {
      if (user?.id && deviceToken) {
        const storedToken = await AsyncStorageService.getItem('pushToken');
        if (storedToken && storedToken !== deviceToken) {
          await pushNotificationService.sendTokenToServer(storedToken, deviceToken);
        } else {
          await pushNotificationService.sendTokenToServer(deviceToken);
        }
      }
    };

    sendTokenAfterLogin();
  }, [user?.id, deviceToken]);

  return (
    <PushNotificationContext.Provider
      value={{
        deviceToken,
        isRegistered,
        registerDevice,
      }}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotification = (): PushNotificationContextType => {
  const context = useContext(PushNotificationContext);
  if (context === undefined) {
    throw new Error('usePushNotification must be used within a PushNotificationProvider');
  }
  return context;
};
