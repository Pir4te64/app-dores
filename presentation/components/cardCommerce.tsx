import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Text, Image, View, TouchableOpacity } from 'react-native';

import { Commerce } from '~/domain/entities/commerceEntity';

type RootStackParamList = {
  CommerceDetail: { commerceId: number };
};

export const CommerceCard = ({ item }: { item: Commerce }) => {
  const navigate = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      className="mx-4 size-40 rounded-xl border-[1px] border-[#d9d9d9]"
      onPress={() => navigate.navigate('CommerceDetail', { commerceId: item.id })}>
      <View className="aspect-[4/3] w-full">
        <Image
          source={{ uri: item.coverImage }}
          className="size-full rounded-t-xl border-b-[1px] border-b-[#D9D9D9]"
          style={{ objectFit: 'cover' }}
        />
      </View>
      <Text className="mt-1 text-center text-sm font-medium">{item.businessName}</Text>
    </TouchableOpacity>
  );
};
