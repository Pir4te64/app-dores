import { useState } from 'react';
import { TouchableOpacity, Image, Dimensions } from 'react-native';

import { Banner } from '~/domain/entities/bannerEntity';
import { WebViewComponent } from '~/presentation/screens/webview';

const { width } = Dimensions.get('window');

export const BannerItem = ({ item }: { item: Banner }) => {
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const openUrl = () => setShowWebView(true);
  const clean = (url: string) => url.replace(/`/g, '').trim();

  return (
    <TouchableOpacity
      className="overflow-hidden rounded-xl"
      onPress={openUrl}
      activeOpacity={0.8}>
      <Image
        source={{ uri: clean(item.imagen) }}
        style={{
          width: width - 32,
          height: 140,
          borderRadius: 12,
        }}
        resizeMode="cover"
      />
      <WebViewComponent
        url={clean(item.link)}
        visible={showWebView}
        onClose={() => setShowWebView(false)}
      />
    </TouchableOpacity>
  );
};
