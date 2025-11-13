import * as Notifications from 'expo-notifications';

import { ApiClient } from '~/domain/sources/remote/apiClient';
import { AsyncStorageService } from '~/infrastructure/storage/asyncStorageService';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

export class PushNotificationService {
  private static instance: PushNotificationService;
  private readonly apiClient: ApiClient = ApiClient.getInstance();
  private foregroundSubscription: any = null;

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async registerForPushNotifications(): Promise<string | null> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return null;
      }
      const pushToken = (
        await Notifications.getExpoPushTokenAsync({
          projectId: '548b5fb3-afc2-4cbd-9558-79e5f1d1bf97',
        })
      ).data;

      await AsyncStorageService.setItem('pushToken', pushToken);

      // await this.sendTokenToServer(pushToken);

      return pushToken;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  public async sendTokenToServer(token: string, newToken?: string): Promise<boolean> {
    try {
      if (!newToken) {
        const previousToken = await AsyncStorageService.getItem('previousPushToken');
        if (previousToken && previousToken !== token) {
          newToken = token;
          token = previousToken;
        }
      }

      const payload = newToken ? { token, newToken } : { token };

      await this.apiClient.postWithAuth('/auth/user/v1/save-token', payload);
      await AsyncStorageService.setItem('pushToken', newToken || token);

      if (newToken) {
        await AsyncStorageService.removeItem('previousPushToken');
      }

      return true;
    } catch {
      if (!newToken) {
        await AsyncStorageService.setItem('pushToken', token);
      }

      return false;
    }
  }

  public setupNotificationListeners(): void {
    this.foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {}
    );

    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      this.handleNotificationResponse(data);
    });
  }
  private handleNotificationResponse(data: any): void {
    switch (data.type) {
      case 'ORDER_UPDATE':
        // Navigate to order screen
        break;
      case 'NEW_MESSAGE':
        // Navigate to messages
        break;
      default:
    }
  }
  public removeNotificationListeners(): void {
    if (this.foregroundSubscription) {
      this.foregroundSubscription.remove();
    }
  }
}
