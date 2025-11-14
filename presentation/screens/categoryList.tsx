import React from 'react';
import { SafeAreaView, ScrollView, ActivityIndicator, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { useCategories } from '~/presentation/hooks/useCategory';
import { CategoryGrid } from '~/presentation/components/categoryGrid';
import { getThemedStyles } from '~/presentation/styles/theme';

type RootStackParamList = {
  MenuByCategory: { categoryId: number; subcategoryName?: string };
};

export default function CategoryList() {
  const theme = getThemedStyles();
  const { categories, loadingCategories, refetchCategories } = useCategories();
  const router = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {loadingCategories ? (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color={theme.primaryColor} />
          </View>
        ) : (
          <CategoryGrid
            categories={categories}
            fullList
            onCategoryPress={(category) =>
              router.navigate('MenuByCategory', {
                categoryId: category.id,
                subcategoryName: undefined,
              })
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}