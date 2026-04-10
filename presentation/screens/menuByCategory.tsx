import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Alert, SafeAreaView, StyleSheet } from 'react-native';
import { UtensilsCrossed } from 'lucide-react-native';

import { Menu } from '~/domain/entities/menuEntity';
import { MenuService } from '~/domain/services/menuService';
import { CardMenuList } from '~/presentation/components/cardMenuList';
import { GlobalText } from '~/presentation/components/GlobalText';

const PRIMARY_RED = '#DA2919';

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
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await menuService.getMenuByCategory(categoryId);
        setMenus(response.content);
        if (response.content.length > 0) {
          setCategoryName(response.content[0]?.category?.name || 'Categoría');
        }
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_RED} />
      </View>
    );
  }

  const renderMenuItem = ({ item }: { item: Menu }) => (
    <CardMenuList menu={item} commerceId={item.commerceId} commerceStatus />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {categoryName && (
        <View style={styles.header}>
          <GlobalText variant="bold" style={styles.title}>
            {categoryName}
          </GlobalText>
          <Text style={styles.subtitle}>
            {menus.length} {menus.length === 1 ? 'producto' : 'productos'}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        {menus.length > 0 ? (
          <FlatList
            data={menus}
            renderItem={renderMenuItem}
            keyExtractor={(item) => `menu-${item.commerceId}-${item.id}`}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <UtensilsCrossed size={64} color="#DDD" />
            <GlobalText variant="bold" style={styles.emptyTitle}>
              Sin productos
            </GlobalText>
            <Text style={styles.emptySubtitle}>
              No hay productos en esta categoría
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    color: '#2D3436',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    color: '#2D3436',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});
