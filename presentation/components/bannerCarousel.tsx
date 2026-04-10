import { useEffect, useRef, useState } from 'react';
import { View, Dimensions, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Banner } from '~/domain/entities/bannerEntity';
import { WebViewComponent } from '~/presentation/screens/webview';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;
const BANNER_HEIGHT = 180;
const PRIMARY_RED = '#DA2919';

type Props = { banners: Banner[]; intervalMs?: number };

export const BannerCarousel = ({ banners, intervalMs = 4000 }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showWebView, setShowWebView] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!banners || banners.length <= 1) return;

    const timer = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setActiveIndex((prev) => (prev + 1) % banners.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [banners?.length, intervalMs]);

  if (!banners || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[activeIndex];
  const clean = (url: string) => url?.replace(/`/g, '').trim() || '';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (currentBanner.link) setShowWebView(true);
        }}>
        <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
          <Image
            source={{ uri: clean(currentBanner.imagen) }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
        </Animated.View>
      </TouchableOpacity>

      {/* Pagination Dots */}
      {banners.length > 1 && (
        <View style={styles.dotsContainer}>
          {banners.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setActiveIndex(i)}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      )}

      {currentBanner.link ? (
        <WebViewComponent
          url={clean(currentBanner.link)}
          visible={showWebView}
          onClose={() => setShowWebView(false)}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  imageContainer: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    borderRadius: 4,
  },
  dotActive: {
    width: 20,
    height: 6,
    backgroundColor: PRIMARY_RED,
    borderRadius: 3,
  },
  dotInactive: {
    width: 6,
    height: 6,
    backgroundColor: '#D9D9D9',
  },
});
