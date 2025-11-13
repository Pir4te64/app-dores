import { X, Check, Bell } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import { NotificationEntity } from '~/domain/entities/notificationEntity';
import { useNotifications } from '~/presentation/context/notificationContext';
import { getThemedStyles } from '~/presentation/styles/theme';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

type TabType = 'all' | 'unread' | 'read';

export const NotificationsModal = ({ visible, onClose }: NotificationModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    hasMore,
    loadMore,
  } = useNotifications();
  const theme = getThemedStyles();
  const { height } = Dimensions.get('window');

  useEffect(() => {
    if (visible) {
      refreshNotifications();
    }
  }, [visible, refreshNotifications]);

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.notificationView;
    if (activeTab === 'read') return notification.notificationView;
    return true;
  });

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getNotificationTypeColor = (type: string): string => {
    switch (type) {
      case 'PAYMENT_CONFIRMED':
      case 'PAYMENT_SUCCESSFUL':
      case 'ORDER_DELIVERED':
        return '#4CAF50';
      case 'ORDER_CANCELLATION_REQUESTED':
      case 'ORDER_CANCELLED_REFUNDED':
      case 'ORDER_CANCELLED_NOT_REFUNDED':
        return '#F44336';
      case 'PAYMENT_PENDING':
      case 'ORDER_WAITING':
      case 'ORDER_PREPARING':
      case 'ORDER_DISPATCHED':
      case 'ORDER_SHIPPED':
        return '#FF9800';
      case 'PAYMENT_FAILED':
      case 'PAYMENT_REJECTED':
        return '#E91E63';
      case 'USER_REGISTERED':
      case 'USER_UPDATED':
      case 'ORDER_RECEIVED':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderNotificationItem = ({ item }: { item: NotificationEntity }) => (
    <TouchableOpacity
      className={`mt-3 rounded-xl p-3 ${item.notificationView ? 'opacity-50' : ''}`}
      onPress={() => handleMarkAsRead(item.id)}
      activeOpacity={0.7}
      disabled={item.notificationView}>
      <View className="flex-row">
        <View
          className="mr-3 w-1 rounded-sm"
          style={{ backgroundColor: getNotificationTypeColor(item.type) }}
        />
        <View className="flex-1">
          <Text className="mb-1 text-base font-bold">{item.title}</Text>
          <Text className="mb-2 text-sm text-gray-600">{item.message}</Text>
          <Text className="text-xs text-gray-400">{formatDate(item.createdAt)}</Text>
        </View>
        {!item.notificationView ? (
          <Text className="text-gray-600">No leída</Text>
        ) : (
          <Text className="text-gray-600">Leída</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View className="flex-1 items-center justify-center py-10">
      <Bell size={50} color="#cccccc" />
      <Text className="mt-4 text-base text-gray-400">No hay notificaciones</Text>
    </View>
  );

  return (
    <View>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="w-full rounded-t-3xl bg-white" style={{ height: height * 0.8 }}>
            <View className="flex-row items-center justify-between border-b border-gray-100 p-4">
              <Text className="text-lg font-bold">Notificaciones</Text>
              <TouchableOpacity onPress={onClose} className="p-1">
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View className="flex-row border-b border-gray-100">
              <TouchableOpacity
                className={`flex-1 items-center py-3 ${
                  activeTab === 'all' ? 'border-b-2 border-blue-900' : ''
                }`}
                onPress={() => setActiveTab('all')}>
                <Text
                  className={`font-medium ${
                    activeTab === 'all' ? 'font-bold text-blue-900' : 'text-gray-600'
                  }`}>
                  Todas
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 items-center py-3 ${
                  activeTab === 'unread' ? 'border-b-2 border-blue-900' : ''
                }`}
                onPress={() => setActiveTab('unread')}>
                <Text
                  className={`font-medium ${
                    activeTab === 'unread' ? 'font-bold text-blue-900' : 'text-gray-600'
                  }`}>
                  No leídas {unreadCount > 0 && `(${unreadCount})`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 items-center py-3 ${
                  activeTab === 'read' ? 'border-b-2 border-blue-900' : ''
                }`}
                onPress={() => setActiveTab('read')}>
                <Text
                  className={`font-medium ${
                    activeTab === 'read' ? 'font-bold text-blue-900' : 'text-gray-600'
                  }`}>
                  Leídas
                </Text>
              </TouchableOpacity>
            </View>

            {unreadCount > 0 && (
              <TouchableOpacity
                className="mx-4 my-2 flex-row items-center justify-center rounded-lg bg-blue-900 py-2"
                onPress={handleMarkAllAsRead}>
                <Check size={16} color="#ffffff" />
                <Text className="ml-2 font-medium text-white">Marcar todas como leídas</Text>
              </TouchableOpacity>
            )}

            {loading && filteredNotifications.length === 0 ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={theme.primaryColor} />
              </View>
            ) : error ? (
              <View className="flex-1 items-center justify-center p-5">
                <Text className="text-center text-red-500">{error}</Text>
                <TouchableOpacity
                  className="mt-4 rounded-lg bg-blue-900 px-4 py-2"
                  onPress={() => refreshNotifications()}>
                  <Text className="font-medium text-white">Intentar nuevamente</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={filteredNotifications}
                renderItem={renderNotificationItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 20 }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                refreshing={loading && filteredNotifications.length > 0}
                onRefresh={refreshNotifications}
                ListEmptyComponent={renderEmptyList}
                ListFooterComponent={
                  hasMore && loading ? (
                    <ActivityIndicator size="small" color={theme.primaryColor} className="my-4" />
                  ) : null
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
