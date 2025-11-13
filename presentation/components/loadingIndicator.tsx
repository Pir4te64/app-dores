import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

type LoadingIndicatorProps = {
  loading: boolean;
  fullScreen?: boolean;
  message?: string;
  size?: 'small' | 'large';
  color?: string;
};

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  loading,
  fullScreen = false,
  message,
  size = 'small',
  color = '#DA2919',
}) => {
  if (!loading) return null;

  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <ActivityIndicator size={size} color={color} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
