import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Alert, SafeAreaView, Image } from 'react-native';

import { Commerce } from '~/domain/entities/commerceEntity';
import { CommerceService } from '~/domain/services/commerceService';
import { SearchBar } from '~/presentation/components/searchBar';

type RootStackParamList = {
  MenuByCategory: { categoryId: number };
  CommerceDetail: { commerceId: number };
};

export default function MenuByCategory() {
  const route = useRoute<RouteProp<RootStackParamList, 'MenuByCategory'>>();
  const { categoryId } = route.params;
  const navigate = useNavigation<NavigationProp<RootStackParamList>>();
  const commmerceService = CommerceService.getInstance();
  const [menus, setMenus] = useState<Commerce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const commerces = await commmerceService.getCommerceByCategory(categoryId);
        setMenus(commerces);
      } catch {
        Alert.alert('Error', 'No se pudieron cargar los menús');
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, [categoryId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const renderCommerceItem = ({ item }: { item: Commerce }) => (
    <View
      className="mx-4 size-40"
      onTouchStart={() => navigate.navigate('CommerceDetail', { commerceId: item.id })}>
      <View className="aspect-[4/3] w-full">
        <Image
          source={{ uri: item.coverImage }}
          className="h-full w-full rounded-xl"
          style={{ objectFit: 'cover' }}
        />
      </View>
      <Text className="mt-1 text-center text-sm font-medium">{item.businessName}</Text>
    </View>
  );
  return (
    <SafeAreaView>
      <View className="gap-4">
        <View className="py-2">
          <SearchBar />
        </View>
        {menus.length > 0 ? (
          <FlatList
            data={menus}
            renderItem={renderCommerceItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-around', gap: 10, marginBottom: 10 }}
          />
        ) : (
          <View className="flex items-center justify-center">
            <Text>No se encontraron menús</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
