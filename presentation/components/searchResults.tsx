import React from 'react';
import { View, FlatList } from 'react-native';

import { SearchItem } from './searchItem';

import { Commerce } from '~/domain/entities/commerceEntity';
import { Menu } from '~/domain/entities/menuEntity';
import { getThemedStyles } from '~/presentation/styles/theme';

type SearchResultsProps = {
  results: (Commerce | Menu)[];
  onItemPress: (item: Commerce | Menu) => void;
};

export const SearchResults = ({ results, onItemPress }: SearchResultsProps) => {
  const theme = getThemedStyles();

  return (
    <View
      style={{
        marginTop: 8,
        maxHeight: 300,
        backgroundColor: theme.backgroundColor,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.borderColor,
        overflow: 'hidden',
      }}>
      <FlatList
        data={results}
        keyExtractor={(item) => `${item.id}-${'businessName' in item ? 'commerce' : 'menu'}`}
        renderItem={({ item }) => <SearchItem item={item} onPress={onItemPress} />}
      />
    </View>
  );
};
