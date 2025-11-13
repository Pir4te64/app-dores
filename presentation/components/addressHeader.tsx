import { Bell, MapPinIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';

import { NotificationsModal } from './notificationsModal';

import { useAddress } from '~/hooks/useAddress';
import { useNotifications } from '~/presentation/context/notificationContext';
import { getThemedStyles } from '~/presentation/styles/theme';

const screenWidth = Dimensions.get('window').width;

interface UserAddressHeaderProps {
  onPressAddress?: () => void;
}

export const UserAddressHeader = ({ onPressAddress }: UserAddressHeaderProps) => {
  // const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const { address, isRefreshing } = useAddress();
  const { unreadCount } = useNotifications();
  const theme = getThemedStyles();

  // const toggleNotificationModal = () => {
  //   setNotificationModalVisible(!notificationModalVisible);
  // };

  if (isRefreshing) {
    return (
      <View className="flex-row items-center justify-between px-4 py-3">
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <View
        className={`flex-row items-center justify-between bg-[${theme.tertiaryColor}] px-4 py-3`}>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={onPressAddress}
          activeOpacity={0.7}>
          <View style={{ maxWidth: screenWidth - 100 }}>
            <Text className="text-sm font-medium text-gray-500">Enviar a</Text>
            <View className="flex-row items-center gap-1">
              <Text className="flex text-base font-semibold">
                {address ? address.title : 'Agregar dirección'}
              </Text>
              <MapPinIcon className="ml-1" size={20} color={theme.iconColor} />
            </View>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={toggleNotificationModal} activeOpacity={0.7} className="p-4">
          <View className="relative">
            <Bell size={20} color={theme.iconColor} />
            {unreadCount > 0 && (
              <View className="absolute -right-1 -top-1 h-4 w-4 items-center justify-center rounded-full bg-red-500">
                <Text className="text-xs text-white">{unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity> */}
      </View>

      {/* <NotificationsModal visible={notificationModalVisible} onClose={toggleNotificationModal} /> */}
    </>
  );
};
