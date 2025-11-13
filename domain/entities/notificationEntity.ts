export class NotificationEntity {
  id: number;
  idUser: number;
  title: string;
  message: string;
  type: NotificationType;
  notificationView: boolean;
  createdAt: string;

  constructor(not: NotificationEntity) {
    this.id = not.id;
    this.idUser = not.idUser;
    this.title = not.title;
    this.message = not.message;
    this.type = not.type;
    this.notificationView = not.notificationView;
    this.createdAt = not.createdAt;
  }
}

export enum NotificationType {
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  ORDER_CANCELLATION_REQUESTED = 'ORDER_CANCELLATION_REQUESTED',
  ORDER_CANCELLED_REFUNDED = 'ORDER_CANCELLED_REFUNDED',
  ORDER_CANCELLED_NOT_REFUNDED = 'ORDER_CANCELLED_NOT_REFUNDED',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  ORDER_DISPATCHED = 'ORDER_DISPATCHED',
  ORDER_PREPARING = 'ORDER_PREPARING',
  ORDER_RECEIVED = 'ORDER_RECEIVED',
  ORDER_SHIPPED = 'ORDER_SHIPPED',
  ORDER_WAITING = 'ORDER_WAITING',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_REJECTED = 'PAYMENT_REJECTED',
  PAYMENT_SUCCESSFUL = 'PAYMENT_SUCCESSFUL',
  USER_REGISTERED = 'USER_REGISTERED',
  USER_UPDATED = 'USER_UPDATED',
}
