import { NotificationEntity } from '~/domain/entities/notificationEntity';
import { INotificationRepository } from '~/domain/repositories/inotificationRepository';
import { ApiClient } from '~/domain/sources/remote/apiClient';

export class NotificationRepository implements INotificationRepository {
  private static instance: NotificationRepository;
  private readonly apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  static getInstance(): NotificationRepository {
    if (!NotificationRepository.instance) {
      NotificationRepository.instance = new NotificationRepository();
    }
    return NotificationRepository.instance;
  }

  async getNotifications(
    page: number = 0,
    size: number = 10
  ): Promise<{ content: NotificationEntity[]; totalPages: number }> {
    try {
      const data = await this.apiClient.getWithAuth<{
        content: NotificationEntity[];
        totalPages: number;
      }>(
        `/notificaciones/user/v1/get-notifications?page-number=${page}&page-size=${size}&sort-direction=DESC`
      );

      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      await this.apiClient.putWithAuth<void>(
        `/notificaciones/user/v1/update-notification?id-notification=${notificationId}`
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    try {
      await this.apiClient.putWithAuth<void>('/notificaciones/user/v1/mark-all-read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}
