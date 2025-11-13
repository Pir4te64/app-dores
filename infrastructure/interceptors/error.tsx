import { View, TouchableOpacity, Text } from 'react-native';

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Something went wrong:
      </Text>
      <Text style={{ color: 'red', marginBottom: 20 }}>{error.message}</Text>
      <TouchableOpacity
        style={{ backgroundColor: '#1a3260', padding: 10, borderRadius: 5 }}
        onPress={resetErrorBoundary}>
        <Text style={{ color: 'white' }}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
};
