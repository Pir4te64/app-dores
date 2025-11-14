import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Alert, SafeAreaView } from 'react-native';

import { Menu } from '~/domain/entities/menuEntity';
import { MenuService } from '~/domain/services/menuService';
import { CardMenuList } from '~/presentation/components/cardMenuList';

type RootStackParamList = {
  MenuByCategory: { categoryId: number };
  CommerceDetail: { commerceId: number };
};

export default function MenuByCategory() {
  const route = useRoute<RouteProp<RootStackParamList, 'MenuByCategory'>>();
  const { categoryId } = route.params;
  const navigate = useNavigation<NavigationProp<RootStackParamList>>();
  const menuService = MenuService.getInstance();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await menuService.getMenuByCategory(categoryId);
        const items = response.content.map((m) => new Menu(m));
        setMenus(items);
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
  const renderMenuItem = ({ item }: { item: Menu }) => (
    <CardMenuList menu={item} commerceId={item.commerceId} commerceStatus />
  );
  return (
    <SafeAreaView>
      <View className="gap-4">
        {menus.length > 0 ? (
          <FlatList
            data={menus}
            renderItem={renderMenuItem}
            keyExtractor={(item) => `menu-${item.commerceId}-${item.id}`}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
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
