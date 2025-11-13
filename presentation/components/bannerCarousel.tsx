import { useEffect, useRef, useState } from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import { BannerItem } from './bannerItem';
import { Banner } from '~/domain/entities/bannerEntity';
const { width } = Dimensions.get('window');

type Props = { banners: Banner[]; intervalMs?: number };

export const BannerCarousel = ({ banners, intervalMs = 5000 }: Props) => {
  const listRef = useRef<FlatList<Banner>>(null);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % banners.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [banners?.length, intervalMs]);

  useEffect(() => {
    setIndex(0);
    listRef.current?.scrollToIndex({ index: 0, animated: false });
  }, [banners]);
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <View className="w-full self-center px-4">
      <FlatList
        ref={listRef}
        data={banners}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <BannerItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, i) => ({ length: 140, offset: (width - 32) * i, index: i })}
        style={{ width: width - 32, height: 140 }}
      />
    </View>
  );
};
