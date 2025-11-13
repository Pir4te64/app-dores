import { View, Text } from 'react-native';

import { Commerce } from '~/domain/entities/commerceEntity';
import { formatTime, distanceFormatter, deliveryPriceFormatter } from '~/utils/helpers';

export const CardCommerceDetail = ({ commerce }: { commerce: Commerce }) => {
  return (
    <View className="m-4 flex-row items-center justify-between gap-2 rounded-lg bg-gray-200 p-4">
      <View className="flex-col items-center gap-2">
        <Text className="text-gray-600">Distancia al local</Text>
        <Text className="font-medium">{distanceFormatter(commerce.distance)}</Text>
      </View>
      <View className="h-8 w-[1px] bg-gray-400" />
      <View className="flex-col items-center gap-2">
        <Text className="text-gray-600">Horario de atención</Text>
        <Text className="font-medium">
          {formatTime(commerce.rangeHours.openingTime)} -
          {formatTime(commerce.rangeHours.closingTime)}
        </Text>
      </View>
      <View className="h-8 w-[1px] bg-gray-400" />
      <View className="flex-col items-center gap-2">
        <Text className="text-gray-600">Envíos</Text>
        <Text className="font-medium">{deliveryPriceFormatter(commerce.cost)}</Text>
      </View>
    </View>
  );
};
