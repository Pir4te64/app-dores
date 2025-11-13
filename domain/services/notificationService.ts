import { NotificationRepository } from '~/data/repository/notificationRepository';
import { NotificationEntity } from '~/domain/entities/notificationEntity';
import { INotificationRepository } from '~/domain/repositories/inotificationRepository';

export class NotificationService {
  private static instance: NotificationService;
  private repository: INotificationRepository;
  private isConnected: boolean = false;

  private constructor() {
    this.repository = NotificationRepository.getInstance();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }
  async getNotifications(
    page: number = 0,
    size: number = 10
  ): Promise<{ content: NotificationEntity[]; totalPages: number }> {
    return await this.repository.getNotifications(page, size);
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await this.repository.markNotificationAsRead(notificationId);
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.repository.markAllNotificationsAsRead();
  }

  isNotificationConnected(): boolean {
    return this.isConnected;
  }
}
