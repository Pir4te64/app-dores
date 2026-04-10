import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRef } from 'react';

interface EnhancedTabBarIconProps {
  focused: boolean;
  icon: React.ElementType;
  color: string;
  size: number;
  badge?: number;
}

export const EnhancedTabBarIcon: React.FC<EnhancedTabBarIconProps> = ({
  focused,
  icon: Icon,
  color,
  size,
  badge,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useFocusEffect(() => {
    if (focused) {
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconWrapper,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}>

        {/* Icono */}
        <Icon
          color={focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'}
          size={24}
          strokeWidth={focused ? 2.5 : 2}
        />

        {/* Badge */}
        {badge && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badge > 9 ? '9+' : badge}
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -10,
    backgroundColor: '#FFEB3B',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#DA2919',
  },
  badgeText: {
    color: '#DA2919',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 4,
  },
});
