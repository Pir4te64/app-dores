import { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';

import { Banner } from '~/domain/entities/bannerEntity';
import { WebViewComponent } from '~/presentation/screens/webview';

interface Props {
  item: Banner;
  width: number;
  height: number;
}

export const BannerItem = ({ item, width, height }: Props) => {
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const openUrl = () => {
    if (item.link) setShowWebView(true);
  };
  const clean = (url: string) => url.replace(/`/g, '').trim();

  return (
    <TouchableOpacity
      onPress={openUrl}
      activeOpacity={0.9}
      style={[styles.container, { width, height }]}>
      <Image
        source={{ uri: clean(item.imagen) }}
        style={[styles.image, { width, height }]}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      {item.link ? (
        <WebViewComponent
          url={clean(item.link)}
          visible={showWebView}
          onClose={() => setShowWebView(false)}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});
