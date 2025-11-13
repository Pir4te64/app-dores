import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { getThemedStyles } from '../styles/theme';

interface GlobalTextProps extends TextProps {
  children: React.ReactNode;
  variant?: 'regular' | 'medium' | 'bold' | 'heavy';
}

export const GlobalText: React.FC<GlobalTextProps> = ({ 
  children, 
  variant = 'regular', 
  style, 
  ...props 
}) => {
  const theme = getThemedStyles();
  
  const textStyle = [
    styles.base,
    styles[variant],
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'LuckiestGuy-Regular',
  },
  regular: {
    fontFamily: 'LuckiestGuy-Regular',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'LuckiestGuy-Regular',
    fontWeight: 'normal',
  },
  bold: {
    fontFamily: 'LuckiestGuy-Regular',
    fontWeight: 'normal',
  },
  heavy: {
    fontFamily: 'LuckiestGuy-Regular',
    fontWeight: 'normal',
  },
});
