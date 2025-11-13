import React from 'react';
import { View } from 'react-native';

import { SearchBar } from './searchBar';

interface SearchWrapperProps {
  children: React.ReactNode;
  showSearch?: boolean;
}
export const SearchWrapper = ({ children, showSearch = true }: SearchWrapperProps) => {
  return (
    <View>
      {showSearch && <SearchBar />}
      {children}
    </View>
  );
};
