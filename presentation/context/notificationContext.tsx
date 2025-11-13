import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

import { NotificationEntity } from '~/domain/entities/notificationEntity';
import { NotificationService } from '~/domain/services/notificationService';

interface NotificationContextType {
  notifications: NotificationEntity[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const notificationService = NotificationService.getInstance();

  const loadNotifications = useCallback(
    async (pageNumber: number = 0, retryCount: number = 0) => {
      setLoading(true);
      if (pageNumber === 0) {
        setError(null);
      }

      try {
        const { content, totalPages } = await notificationService.getNotifications(pageNumber, 10);

        if (pageNumber === 0) {
          setNotifications(content);
        } else {
          setNotifications((prev) => [...prev, ...content]);
        }

        setHasMore(pageNumber < totalPages - 1);

        const unreadNotifications = content.filter(
          (notification) => !notification.notificationView
        );
        if (pageNumber === 0) {
          setUnreadCount(unreadNotifications.length);
        }

        setPage(pageNumber);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load notifications in context:', err);

        if (pageNumber === 0 && retryCount < 2) {
          setTimeout(
            () => {
              loadNotifications(pageNumber, retryCount + 1);
            },
            2000 * (retryCount + 1)
          );
          return;
        }

        setError(err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    },
    [notificationService]
  );

  const markAsRead = useCallback(
    async (notificationId: number) => {
      try {
        await notificationService.markNotificationAsRead(notificationId);

        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, notificationView: true }
              : notification
          )
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err: any) {
        setError(err.message || 'Failed to mark notification as read');
      }
    },
    [notificationService]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, notificationView: true }))
      );

      setUnreadCount(0);
    } catch (err: any) {
      setError(err.message || 'Failed to mark all notifications as read');
    }
  }, [notificationService]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadNotifications(page + 1);
    }
  }, [loading, hasMore, page, loadNotifications]);

  const refreshNotifications = useCallback(() => {
    loadNotifications(0);
  }, [loadNotifications]);

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
