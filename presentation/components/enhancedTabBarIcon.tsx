import React from 'react';
import { View, Text, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRef } from 'react';

interface EnhancedTabBarIconProps {
  focused: boolean;
  icon: React.ElementType;
  color: string;
  size: number;
  badge?: number;
  isChicken?: boolean;
}

export const EnhancedTabBarIcon: React.FC<EnhancedTabBarIconProps> = ({
  focused,
  icon: Icon,
  color,
  size,
  badge,
  isChicken = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(() => {
    if (focused) {
      // Animación de entrada suave
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Animación de rebote para el pollo
      if (isChicken) {
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* Contenedor del icono con animaciones */}
      <Animated.View
        style={{
          transform: [
            { scale: scaleAnim },
            { translateY: isChicken ? bounceAnim : 0 },
          ],
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        
        {/* Fondo circular para el icono activo */}
        {focused && (
          <View
            style={{
              position: 'absolute',
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          />
        )}

        {/* Icono principal */}
        <View style={{ position: 'relative' }}>
          <Icon 
            color="#FFFFFF" 
            size={focused ? size + 2 : size} 
          />
          
          {/* Badge de notificación */}
          {badge && badge > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                backgroundColor: '#FF4444',
                borderRadius: 8,
                minWidth: 16,
                height: 16,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#FFFFFF',
              }}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 8,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {badge > 99 ? '99+' : badge}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};
