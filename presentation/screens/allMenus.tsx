import React from 'react';
import { SafeAreaView, ScrollView, ActivityIndicator, View, FlatList } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { useMenus } from '~/presentation/hooks/useMenus';
import { CardMenuList } from '~/presentation/components/cardMenuList';
import { getThemedStyles } from '~/presentation/styles/theme';

type RootStackParamList = {
  CommerceDetail: { commerceId: number };
};

export default function AllMenus() {
  const theme = getThemedStyles();
  const { menus, loadingMenus } = useMenus();
  const router = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      {loadingMenus ? (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color={theme.primaryColor} />
        </View>
      ) : (
        <FlatList
          data={menus}
          renderItem={({ item }) => (
            <CardMenuList
              menu={item}
              commerceId={item.commerceId}
              commerceStatus
              navigateToCommerce
            />
          )}
          numColumns={2}
          keyExtractor={(item, index) => `menu-all-${item.commerceId}-${item.id}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      )}
    </SafeAreaView>
  );
}