import { X } from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, Modal, Image, FlatList, TouchableOpacity, Alert } from 'react-native';

import { useUser } from '~/context/userContext';
import { AvatarData } from '~/domain/repositories/iuserRepository';
import { UserService } from '~/domain/services/userService';
import { AsyncStorageService } from '~/infrastructure/storage/asyncStorageService';
interface AvatarGridProps {
  visible: boolean;
  avatars: AvatarData[] | undefined;
  onClose: () => void;
}
const renderHeader = () => {
  return (
    <View className="self-center p-2">
      <Text className="text-3xl">Selecciona un avatar</Text>
    </View>
  );
};

const renderImages = ({
  item,
  selectedId,
  onSelect,
}: {
  item: AvatarData;
  selectedId?: number;
  onSelect: (id: number) => void;
}) => {
  const isSelected = item.id === selectedId;
  return (
    <TouchableOpacity onPress={() => onSelect(item.id)} className="flex-1">
      <View className={`p-2 ${isSelected ? 'rounded-full border-4 border-[#DA2919]' : ''}`}>
        <Image source={{ uri: item.url }} width={100} height={100} className="rounded-full" />
      </View>
    </TouchableOpacity>
  );
};

const renderFooter = ({ onSave, disabled }: { onSave: () => void; disabled: boolean }) => {
  return (
    <View className="h-fit flex-col justify-between self-center">
      <View className="w-fit self-center">
        <TouchableOpacity
          className={`w-fit rounded-full ${disabled ? 'bg-gray-400' : 'bg-[#DA2919]'} p-3`}
          onPress={onSave}
          disabled={disabled}>
          <Text className="text-2xl text-white">Guardar</Text>
        </TouchableOpacity>
      </View>
      <View className="w-fit self-center p-2">
        <Text className="text-center text-sm text-gray-500">
          Los avatares son puramente ilustrativos no afectan a la experiencia del usuario final
        </Text>
      </View>
    </View>
  );
};

export const AvatarGrid = ({ visible, avatars, onClose }: AvatarGridProps) => {
  const [selectedId, setSelectedId] = useState<number>();
  const userService = UserService.getInstance();
  const { fetchUserData } = useUser();

  const handleUpdateAvatar = async () => {
    if (!selectedId) return;

    try {
      await userService.updateAvatar(selectedId);
      const token = await AsyncStorageService.getItem('accessToken');
      if (!token)
        return Alert.alert(
          'Error',
          'No se pudo actualizar el avatar, inténtelo de nuevo más tarde.'
        );
      await fetchUserData();
      onClose();
    } catch {
      return Alert.alert('No se pudo actualizar el avatar', 'Inténtelo de nuevo más tarde.');
    }
  };

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };
  return (
    <View>
      {avatars && (
        <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
          <TouchableOpacity className="flex-1 justify-end bg-black/50" onPress={onClose} />
          <View className="absolute bottom-0 h-[90%] rounded-t-xl bg-white">
            <TouchableOpacity onPress={onClose} className="self-end p-2">
              <X color="black" size={20} />
            </TouchableOpacity>
            <FlatList
              data={avatars}
              ListHeaderComponent={renderHeader}
              renderItem={({ item }) =>
                renderImages({
                  item,
                  selectedId,
                  onSelect: handleSelect,
                })
              }
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              ListFooterComponent={() =>
                renderFooter({
                  onSave: handleUpdateAvatar,
                  disabled: !selectedId,
                })
              }
            />
          </View>
        </Modal>
      )}
    </View>
  );
};
