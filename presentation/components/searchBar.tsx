import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Search, X } from 'lucide-react-native';

import { SearchResults } from './searchResults';

import { Commerce } from '~/domain/entities/commerceEntity';
import { Menu } from '~/domain/entities/menuEntity';
import { MenuService } from '~/domain/services/menuService';

type RootStackParamList = {
  CommerceDetail: { commerceId: number };
  MenuItem: { item: Menu; commerceId: number };
};

export const SearchBar = () => {
  const menuService = MenuService.getInstance();
  const [input, setInput] = useState('');
  const [searchResults, setSearchResults] = useState<Commerce[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSearch = useCallback(async (searchText: string) => {
    if (searchText.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await menuService.getMenuSearch(searchText);
      const results = response.content.slice(0, 5).map(menu => ({
        id: menu.id,
        businessName: menu.name,
        description: menu.description || '',
        rating: 4.5,
        deliveryTime: '25-35 min',
        imageUrl: menu.image?.[0]?.url || '',
      } as unknown as Commerce));

      setSearchResults(results);
      setIsSearchActive(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [menuService]);

  const handleTextChange = useCallback((text: string) => {
    setInput(text);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (text.length < 2) {
      setSearchResults([]);
      setIsSearchActive(false);
      return;
    }

    // Debounce search by 300ms
    debounceRef.current = setTimeout(() => {
      handleSearch(text);
    }, 300);
  }, [handleSearch]);

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
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Search size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Buscar productos..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={handleTextChange}
          onSubmitEditing={() => handleSearch(input)}
          autoCapitalize="none"
          onFocus={() => input.length >= 2 && setIsSearchActive(true)}
          returnKeyType="search"
        />
        {isLoading && (
          <ActivityIndicator size="small" color="#DA2919" style={styles.loader} />
        )}
        {input.length > 0 && !isLoading && (
          <TouchableWithoutFeedback onPress={clearSearch}>
            <View style={styles.clearButton}>
              <X size={16} color="#999" />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>

      {isSearchActive && searchResults.length > 0 && (
        <SearchResults results={searchResults} onItemPress={handleCardPress} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
  },
  loader: {
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
});
