import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

import { SearchResults } from './searchResults';

import { Commerce } from '~/domain/entities/commerceEntity';
import { Menu } from '~/domain/entities/menuEntity';
import { CommerceService } from '~/domain/services/commerceService';
import { getThemedStyles } from '~/presentation/styles/theme';

type RootStackParamList = {
  CommerceDetail: { commerceId: number };
  MenuItem: { item: Menu; commerceId: number };
};

export const SearchBar = () => {
  const theme = getThemedStyles();
  const commerceService = CommerceService.getInstance();
  const [input, setInput] = useState('');
  const [searchResults, setSearchResults] = useState<Commerce[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSearch = async () => {
    if (input.trim().length < 3) return;

    setIsLoading(true);
    try {
      const commerceResult = await commerceService.getCommerceSearch(input);

      setSearchResults(commerceResult);
      setIsSearchActive(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPress = (item: Commerce | Menu) => {
    if ('businessName' in item) {
      navigation.navigate('CommerceDetail', { commerceId: item.id });
    } else {
      navigation.navigate('MenuItem', { item: item as Menu, commerceId: item.id });
    }
    clearSearch();
  };

  const clearSearch = () => {
    setInput('');
    setSearchResults([]);
    setIsSearchActive(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={clearSearch}>
      <View className="flex px-8">
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View>
            <TextInput
              ref={inputRef}
              className="rounded-full px-10 py-2"
              style={{
                borderColor: theme.borderColor,
                borderWidth: 1,
                backgroundColor: theme.backgroundColor,
                color: '#000000',
                height: 40,
              }}
              placeholder="Ensalada de..."
              placeholderTextColor="#777"
              value={input}
              onChangeText={(text) => {
                setInput(text);
                if (text.length > 2) {
                  handleSearch();
                } else {
                  setSearchResults([]);
                }
              }}
              onSubmitEditing={handleSearch}
              autoCapitalize="none"
              onFocus={() => setIsSearchActive(true)}
            />

            {isLoading && (
              <View className="absolute right-4 top-2">
                <ActivityIndicator size="small" />
              </View>
            )}

            {isSearchActive && searchResults.length > 0 && (
              <SearchResults results={searchResults} onItemPress={handleCardPress} />
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};
