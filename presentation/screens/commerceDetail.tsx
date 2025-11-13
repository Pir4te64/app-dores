import { RouteProp } from '@react-navigation/native';
import { MapPinIcon } from 'lucide-react-native';
import { View, FlatList, ActivityIndicator, Image, Text } from 'react-native';

import { CardMenuList } from '~/components/cardMenuList';
import { useCommerceDetail } from '~/hooks/useCommerce';
import { CardCommerceDetail } from '~/presentation/components/cardCommerceDetail';
import { getThemedStyles } from '~/presentation/styles/theme';

export const CommerceDetail = ({
  route,
}: {
  route: RouteProp<{ params: { commerceId: number } }>;
}) => {
  const { commerceId } = route.params;
  const { commerce, menus, loading, handleLoadMore } = useCommerceDetail(commerceId);
  const theme = getThemedStyles();

  if (loading && commerce === null) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const badge = (status: boolean | undefined) => {
    return (
      <View className={`${status ? 'bg-[#E5F2DB]' : 'bg-[#FFD2CE]'} rounded-2xl p-2`}>
        {status ? (
          <Text className="text-[12px] font-semibold text-[#7EBA4C]">Abierto</Text>
        ) : (
          <Text className="text-[12px] font-semibold text-[#F35757]">Cerrado</Text>
        )}
      </View>
    );
  };
  const renderHeader = () => (
    <View className="w-full">
      <View className="aspect-[16/9] w-full">
        <Image
          source={{ uri: commerce?.coverImage }}
          className="size-full"
          style={{ objectFit: 'cover' }}
        />
      </View>
      <View className="mx-2 mt-4 px-2">
        <View className="flex-row justify-between">
          <Text className="text-2xl font-bold">{commerce?.businessName}</Text>
          <Text>{badge(commerce?.active)}</Text>
        </View>
        <Text className="text-sm text-gray-600">{commerce?.description}</Text>
        <View className="flex-row items-center gap-2">
          <MapPinIcon color={theme.iconColor} size={20} />
          <Text className="text-sm text-gray-600">
            {commerce?.address.street}, {commerce?.address?.city}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View>
      <FlatList
        data={menus}
        renderItem={({ item }) => (
          <CardMenuList menu={item} commerceId={commerce?.id!} commerceStatus={commerce?.active!} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={() => (
          <View>
            {renderHeader()}
            {commerce && <CardCommerceDetail commerce={commerce} />}
          </View>
        )}
        ListFooterComponent={() => (loading ? <ActivityIndicator /> : null)}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};
