import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Camera, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';

import { AvatarData } from '~/domain/repositories/iuserRepository';
import { UserService } from '~/domain/services/userService';
import { AvatarGrid } from '~/presentation/components/avatarModal';
import { useUser } from '~/presentation/context/userContext';
import { getThemedStyles } from '~/presentation/styles/theme';

type RootStackParamList = {
  ProfileDetail: undefined;
  ProfileAddresses: undefined;
  Terms: undefined;
  Privacy: undefined;
};

export default function Profile() {
  const [showAvatarGrid, setShowAvatarGrid] = useState<boolean>(false);
  const [images, setImages] = useState<AvatarData[]>();
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const router = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, logout } = useUser();
  const theme = getThemedStyles();
  const userService = UserService.getInstance();

  const handleAvatarPress = async () => {
    const images = await userService.getAvatars();
    setImages(images);
    setShowAvatarGrid(true);
  };
  const handleLogout = async () => {
    Alert.alert('¿Estás seguro?', 'Tendrás que volver a iniciar sesión', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Si',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };
  const handleOpenUrl = () => {
    setShowWebView(true);
  };
  return (
    <SafeAreaView className="h-full flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="h-full gap-y-4 text-balance px-2">
          <View className="flex flex-row items-center">
            <TouchableOpacity onPress={handleAvatarPress} className="m-4">
              <View className="relative">
                <Image
                  source={{ uri: user?.imageProfile ?? 'https://placehold.co/600x400' }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: '#c4c4c4',
                  }}
                />
                <View className="absolute bottom-5 right-1 z-10 rounded-full p-1">
                  <Camera size={16} color="black" />
                </View>
              </View>
            </TouchableOpacity>
            <View className="flex flex-col">
              <Text className="text-[24px] font-light">
                {user?.firstName} {user?.lastName}
              </Text>
              <Text className="text-[16px] font-light">{user?.email ?? 'test@email.com'}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.navigate('ProfileDetail')}>
            <View className="flex w-full flex-row items-center justify-between self-center">
              <Text className="text-[24px] font-light">Datos personales</Text>
              <ChevronRight size={20} color={theme.iconColor} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.navigate('ProfileAddresses')}>
            <View className="flex w-full flex-row items-center justify-between self-center">
              <Text className="text-[24px] font-light">Direcciones</Text>
              <ChevronRight size={20} color={theme.iconColor} />
            </View>
          </TouchableOpacity>

          <View className="my-40" />

          <TouchableOpacity onPress={() => router.navigate('Terms')}>
            <View className="flex w-full flex-row items-center justify-between self-center">
              <Text className="text-[16px] font-light">Términos y condiciones</Text>
              <ChevronRight size={20} color={theme.iconColor} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.navigate('Privacy')}>
            <View className="flex w-full flex-row items-center justify-between self-center">
              <Text className="text-[16px] font-light">Política de privacidad</Text>
              <ChevronRight size={20} color={theme.iconColor} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="self-start rounded-full py-4" onPress={handleLogout}>
            <Text className="text-xl font-medium text-[#DA2919]">Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AvatarGrid
        visible={showAvatarGrid}
        avatars={images}
        onClose={() => setShowAvatarGrid(false)}
      />
    </SafeAreaView>
  );
}
