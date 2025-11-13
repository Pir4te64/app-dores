import { View, Text, TouchableOpacity } from 'react-native';

type ErrorHandlerProps = {
  error: Error | null;
  onRetry?: () => void;
  customMessage?: string;
};

export const ErrorHandler = ({ error, onRetry, customMessage }: ErrorHandlerProps) => {
  if (!error) return null;

  return (
    <View className="my-2 rounded-lg border border-gray-300 bg-gray-100 p-4">
      <Text className="mb-2 text-lg font-bold">{customMessage || 'Something went wrong'}</Text>
      <Text className="mb-4 text-red-600">{error.message}</Text>
      {onRetry && (
        <TouchableOpacity className="items-center rounded-full bg-green-500 p-2" onPress={onRetry}>
          <Text className="font-bold text-white">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
