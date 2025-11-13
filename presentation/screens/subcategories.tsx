import React from 'react';
import { View, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';

import { GlobalText } from '~/presentation/components/GlobalText';
import { SubcategoryCard } from '~/presentation/components/subcategoryCard';
import { getSubcategoriesByCategory } from '~/presentation/data/subcategories';
import { getThemedStyles } from '~/presentation/styles/theme';

type RootStackParamList = {
  Subcategories: { categoryName: string; categoryId: number };
  MenuByCategory: { categoryId: number; subcategoryName?: string };
  CommerceList: undefined;
};

export default function Subcategories() {
  const route = useRoute<RouteProp<RootStackParamList, 'Subcategories'>>();
  const { categoryName, categoryId } = route.params;
  const navigate = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = getThemedStyles();
  
  const subcategories = getSubcategoriesByCategory(categoryName);
  const { width } = Dimensions.get('window');

  const handleSubcategoryPress = (subcategory: any) => {
    // Navegar a la pantalla de comercios con filtro de subcategoría
    navigate.navigate('MenuByCategory', { 
      categoryId, 
      subcategoryName: subcategory.name 
    });
  };

  const renderSubcategoryItem = ({ item }: { item: any }) => (
    <SubcategoryCard
      subcategory={item}
      onPress={handleSubcategoryPress}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      {/* Header */}
      <View className="px-4 py-4 bg-white">
        <GlobalText className="text-2xl font-bold mb-2" style={{ color: '#2D3436' }}>
          {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
        </GlobalText>
        <GlobalText className="text-sm text-gray-600">
          Elige el tipo de comida que prefieres
        </GlobalText>
      </View>

      {/* Grid de subcategorías */}
      <View className="flex-1 px-2 py-4">
        <FlatList
          data={subcategories}
          renderItem={renderSubcategoryItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
        />
      </View>

      {/* Botón de ver todos los comercios */}
      <View className="px-4 pb-4">
        <View
          className="rounded-xl py-3 px-4"
          style={{ backgroundColor: theme.primaryColor }}>
          <GlobalText
            className="text-center text-white font-bold text-base"
            onPress={() => navigate.navigate('MenuByCategory', { categoryId })}>
            Ver todos los comercios
          </GlobalText>
        </View>
      </View>
    </SafeAreaView>
  );
}
