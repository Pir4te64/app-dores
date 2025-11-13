import { View, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import { BannerItem } from './bannerItem';

import { Banner } from '~/domain/entities/bannerEntity';
const { width } = Dimensions.get('window');

export const BannerCarousel = ({ banners }: { banners: Banner[] }) => {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <View className="w-full self-center px-4">
      <Carousel
        width={width - 32}
        height={140}
        data={banners}
        loop
        autoPlay
        autoPlayInterval={5000}
        renderItem={({ item }) => <BannerItem item={item} />}
      />
    </View>
  );
};
