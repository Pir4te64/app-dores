import { NotificationEntity } from '~/domain/entities/notificationEntity';

export interface INotificationRepository {
  getNotifications(
    page: number,
    size: number
  ): Promise<{ content: NotificationEntity[]; totalPages: number }>;
  markNotificationAsRead(notificationId: number): Promise<void>;
  markAllNotificationsAsRead(): Promise<void>;
}
